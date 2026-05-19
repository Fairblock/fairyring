package keeper_test

import (
	"bytes"
	"context"
	"net"
	"strings"
	"testing"

	"cosmossdk.io/log"
	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/zkp/keeper"
	"github.com/Fairblock/fairyring/x/zkp/types"
	"github.com/cosmos/cosmos-sdk/codec"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"
	"github.com/cosmos/cosmos-sdk/runtime"
	"github.com/cosmos/cosmos-sdk/testutil"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/status"
	"google.golang.org/grpc/test/bufconn"
)

const zkpGRPCBufSize = 1024 * 1024

type zkpGRPCTestFixture struct {
	keeper *keeper.Keeper
	ctx    sdk.Context
	client types.QueryClient
	closer func()
}

func newZkpKeeperForGRPCTest(t *testing.T) (*keeper.Keeper, sdk.Context) {
	t.Helper()

	storeKey := storetypes.NewKVStoreKey(types.StoreKey)
	testCtx := testutil.DefaultContextWithDB(t, storeKey, storetypes.NewTransientStoreKey("transient_zkp_grpc_test"))
	ctx := testCtx.Ctx.WithBlockHeight(1)

	cdc := codec.NewProtoCodec(codectypes.NewInterfaceRegistry())
	k := keeper.NewKeeper(cdc, runtime.NewKVStoreService(storeKey), log.NewNopLogger())

	return k, ctx
}

func newZkpGRPCTestFixture(t *testing.T, queryServer types.QueryServer) zkpGRPCTestFixture {
	t.Helper()

	k, sdkCtx := newZkpKeeperForGRPCTest(t)
	if queryServer == nil {
		queryServer = k
	}

	return startZkpGRPCServer(t, k, sdkCtx, queryServer)
}

func newFilteredZkpGRPCTestFixture(t *testing.T) zkpGRPCTestFixture {
	t.Helper()

	k, sdkCtx := newZkpKeeperForGRPCTest(t)
	return startZkpGRPCServer(t, k, sdkCtx, keeper.NewFilteredQueryServer(*k))
}

func startZkpGRPCServer(t *testing.T, k *keeper.Keeper, sdkCtx sdk.Context, queryServer types.QueryServer) zkpGRPCTestFixture {
	t.Helper()

	listener := bufconn.Listen(zkpGRPCBufSize)
	grpcServer := grpc.NewServer(grpc.UnaryInterceptor(func(goCtx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
		return handler(sdk.WrapSDKContext(sdkCtx), req)
	}))
	types.RegisterQueryServer(grpcServer, queryServer)

	serveErr := make(chan error, 1)
	go func() {
		serveErr <- grpcServer.Serve(listener)
	}()

	dialCtx, cancel := context.WithCancel(context.Background())
	conn, err := grpc.DialContext(
		dialCtx,
		"bufnet",
		grpc.WithContextDialer(func(context.Context, string) (net.Conn, error) { return listener.Dial() }),
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	require.NoError(t, err)

	closer := func() {
		cancel()
		require.NoError(t, conn.Close())
		grpcServer.Stop()
		require.NoError(t, listener.Close())
		select {
		case err := <-serveErr:
			if err != nil && !strings.Contains(err.Error(), "closed") && !strings.Contains(err.Error(), "Server.Stop") {
				t.Fatalf("gRPC server returned unexpected error: %v", err)
			}
		default:
		}
	}

	return zkpGRPCTestFixture{
		keeper: k,
		ctx:    sdkCtx,
		client: types.NewQueryClient(conn),
		closer: closer,
	}
}

func assertPermissionDenied(t *testing.T, err error) {
	t.Helper()
	require.Error(t, err)
	st, ok := status.FromError(err)
	require.True(t, ok, "expected gRPC status error, got %T: %v", err, err)
	require.Equal(t, codes.PermissionDenied, st.Code())
	require.Equal(t, "ZKP verification queries are only accessible through CosmWasm contracts, not via gRPC or REST API", st.Message())
}

func TestFilteredGRPCParamsAndTrustedContractsRemainPublic(t *testing.T) {
	fx := newFilteredZkpGRPCTestFixture(t)
	defer fx.closer()

	authority := sdk.AccAddress(bytes.Repeat([]byte{0xA1}, 20)).String()
	require.NoError(t, fx.keeper.SetParams(fx.ctx, types.NewParams(authority)))

	contractA := sdk.AccAddress(bytes.Repeat([]byte{0x01}, 20)).String()
	contractB := sdk.AccAddress(bytes.Repeat([]byte{0x02}, 20)).String()
	fx.keeper.StoreTrustedContract(fx.ctx, contractA)
	fx.keeper.StoreTrustedContract(fx.ctx, contractB)

	paramsResp, err := fx.client.Params(context.Background(), &types.QueryParamsRequest{})
	require.NoError(t, err)
	require.Equal(t, authority, paramsResp.Params.Authority)

	contractsResp, err := fx.client.TrustedContracts(context.Background(), &types.TrustedContractsRequest{})
	require.NoError(t, err)
	require.ElementsMatch(t, []string{contractA, contractB}, contractsResp.ContractAddresses)
}

func TestFilteredGRPCProofVerificationEndpointsAreDenied(t *testing.T) {
	fx := newFilteredZkpGRPCTestFixture(t)
	defer fx.closer()

	tests := []struct {
		name string
		call func(context.Context) error
	}{
		{
			name: "withdraw range proof",
			call: func(ctx context.Context) error {
				_, err := fx.client.VerifyWithdrawRangeProof(ctx, &types.QueryVerifyWithdrawRangeProofRequest{ProofData: []byte("must-not-be-parsed")})
				return err
			},
		},
		{
			name: "transfer range proof",
			call: func(ctx context.Context) error {
				_, err := fx.client.VerifyTransferRangeProof(ctx, &types.QueryVerifyTransferRangeProofRequest{ProofData: []byte("must-not-be-parsed")})
				return err
			},
		},
		{
			name: "validity proof",
			call: func(ctx context.Context) error {
				_, err := fx.client.VerifyValidityProof(ctx, &types.QueryVerifyValidityProofRequest{ProofData: []byte("must-not-be-parsed")})
				return err
			},
		},
		{
			name: "equality proof",
			call: func(ctx context.Context) error {
				_, err := fx.client.VerifyEqualityProof(ctx, &types.QueryVerifyEqualityProofRequest{ProofData: []byte("must-not-be-parsed")})
				return err
			},
		},
		{
			name: "transfer proof bundle",
			call: func(ctx context.Context) error {
				_, err := fx.client.VerifyTransferProofs(ctx, &types.QueryVerifyTransferProofsRequest{EqualityProofData: []byte("must-not-be-parsed")})
				return err
			},
		},
		{
			name: "withdraw proof bundle",
			call: func(ctx context.Context) error {
				_, err := fx.client.VerifyWithdrawProofs(ctx, &types.QueryVerifyWithdrawProofsRequest{EqualityProofData: []byte("must-not-be-parsed")})
				return err
			},
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			assertPermissionDenied(t, tc.call(context.Background()))
		})
	}
}

func TestDirectKeeperGRPCProofVerificationRejectsMalformedProofPayloads(t *testing.T) {
	fx := newZkpGRPCTestFixture(t, nil)
	defer fx.closer()

	t.Run("withdraw range proof", func(t *testing.T) {
		resp, err := fx.client.VerifyWithdrawRangeProof(context.Background(), &types.QueryVerifyWithdrawRangeProofRequest{})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "invalid proof data length", resp.Error)
	})

	t.Run("transfer range proof", func(t *testing.T) {
		resp, err := fx.client.VerifyTransferRangeProof(context.Background(), &types.QueryVerifyTransferRangeProofRequest{})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "invalid proof data length", resp.Error)
	})

	t.Run("validity proof", func(t *testing.T) {
		resp, err := fx.client.VerifyValidityProof(context.Background(), &types.QueryVerifyValidityProofRequest{})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "invalid proof data length", resp.Error)
	})

	t.Run("equality proof", func(t *testing.T) {
		resp, err := fx.client.VerifyEqualityProof(context.Background(), &types.QueryVerifyEqualityProofRequest{})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "invalid proof data length", resp.Error)
	})

	t.Run("transfer proof bundle", func(t *testing.T) {
		resp, err := fx.client.VerifyTransferProofs(context.Background(), &types.QueryVerifyTransferProofsRequest{})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "invalid equality proof data length", resp.Error)
	})

	t.Run("withdraw proof bundle", func(t *testing.T) {
		resp, err := fx.client.VerifyWithdrawProofs(context.Background(), &types.QueryVerifyWithdrawProofsRequest{})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "invalid equality proof data length", resp.Error)
	})
}

func TestDirectKeeperGRPCCompositeProofsRequireBindingFields(t *testing.T) {
	fx := newZkpGRPCTestFixture(t, nil)
	defer fx.closer()

	t.Run("transfer proof bundle requires binding fields", func(t *testing.T) {
		resp, err := fx.client.VerifyTransferProofs(context.Background(), &types.QueryVerifyTransferProofsRequest{
			EqualityProofData: make([]byte, 320),
			RangeProofData:    make([]byte, 8*32+8+736),
			ValidityProofData: make([]byte, 416),
		})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "transfer proof verification failed: missing or invalid pubkey/balance fields (expected 32-byte values)", resp.Error)
	})

	t.Run("withdraw proof bundle requires binding fields", func(t *testing.T) {
		resp, err := fx.client.VerifyWithdrawProofs(context.Background(), &types.QueryVerifyWithdrawProofsRequest{
			EqualityProofData: make([]byte, 328),
			RangeProofData:    make([]byte, 8*32+8+8+672),
		})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "withdraw proof verification failed: missing or invalid pubkey/ciphertext fields (expected 32-byte values)", resp.Error)
	})
}

func TestDirectKeeperGRPCProofVerificationRejectsWellFormedButInvalidPayloads(t *testing.T) {
	fx := newZkpGRPCTestFixture(t, nil)
	defer fx.closer()

	t.Run("withdraw range proof", func(t *testing.T) {
		resp, err := fx.client.VerifyWithdrawRangeProof(context.Background(), &types.QueryVerifyWithdrawRangeProofRequest{
			ProofData: make([]byte, 8*32+8+8+672),
		})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "algebraic relation failed", resp.Error)
	})

	t.Run("transfer range proof", func(t *testing.T) {
		resp, err := fx.client.VerifyTransferRangeProof(context.Background(), &types.QueryVerifyTransferRangeProofRequest{
			ProofData: make([]byte, 8*32+8+736),
		})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "algebraic relation failed", resp.Error)
	})

	t.Run("validity proof", func(t *testing.T) {
		resp, err := fx.client.VerifyValidityProof(context.Background(), &types.QueryVerifyValidityProofRequest{
			ProofData: make([]byte, 416),
		})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "validity proof: invalid proof", resp.Error)
	})

	t.Run("equality proof", func(t *testing.T) {
		resp, err := fx.client.VerifyEqualityProof(context.Background(), &types.QueryVerifyEqualityProofRequest{
			ProofData: make([]byte, 320),
		})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "algebraic relation failed", resp.Error)
	})
}

func TestDirectKeeperGRPCCompositeProofsBindingAndVerificationFailures(t *testing.T) {
	fx := newZkpGRPCTestFixture(t, nil)
	defer fx.closer()

	zero32 := make([]byte, 32)
	nonZero32 := make([]byte, 32)
	nonZero32[0] = 1

	t.Run("transfer proof bundle binding mismatch", func(t *testing.T) {
		resp, err := fx.client.VerifyTransferProofs(context.Background(), &types.QueryVerifyTransferProofsRequest{
			EqualityProofData:         make([]byte, 320),
			RangeProofData:            make([]byte, 8*32+8+736),
			ValidityProofData:         make([]byte, 416),
			SenderPubkey:              nonZero32,
			RecipientPubkey:           zero32,
			CurrentBalanceCommitment:  zero32,
			CurrentBalanceHandle:      zero32,
		})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "transfer proof verification failed: sender pubkey mismatch", resp.Error)
	})

	t.Run("transfer proof bundle verification stage", func(t *testing.T) {
		resp, err := fx.client.VerifyTransferProofs(context.Background(), &types.QueryVerifyTransferProofsRequest{
			EqualityProofData:         make([]byte, 320),
			RangeProofData:            make([]byte, 8*32+8+736),
			ValidityProofData:         make([]byte, 416),
			SenderPubkey:              zero32,
			RecipientPubkey:           zero32,
			CurrentBalanceCommitment:  zero32,
			CurrentBalanceHandle:      zero32,
		})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "transfer proof verification failed: algebraic relation failed", resp.Error)
	})

	t.Run("withdraw proof bundle nonce mismatch", func(t *testing.T) {
		resp, err := fx.client.VerifyWithdrawProofs(context.Background(), &types.QueryVerifyWithdrawProofsRequest{
			EqualityProofData:      make([]byte, 328),
			RangeProofData:         make([]byte, 8*32+8+8+672),
			UserPubkey:             zero32,
			CiphertextCommitment:   zero32,
			CiphertextHandle:       zero32,
			ExpectedNonce:          1,
		})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "withdraw proof verification failed: withdraw equality proof nonce mismatch", resp.Error)
	})

	t.Run("withdraw proof bundle verification stage", func(t *testing.T) {
		resp, err := fx.client.VerifyWithdrawProofs(context.Background(), &types.QueryVerifyWithdrawProofsRequest{
			EqualityProofData:      make([]byte, 328),
			RangeProofData:         make([]byte, 8*32+8+8+672),
			UserPubkey:             zero32,
			CiphertextCommitment:   zero32,
			CiphertextHandle:       zero32,
			ExpectedNonce:          0,
		})
		require.NoError(t, err)
		require.False(t, resp.Valid)
		require.Equal(t, "withdraw proof verification failed: algebraic relation failed", resp.Error)
	})
}
