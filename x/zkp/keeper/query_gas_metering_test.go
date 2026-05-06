package keeper_test

import (
	"context"
	"testing"

	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/zkp/keeper"
	"github.com/Fairblock/fairyring/x/zkp/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

func newGasMeteredKeeperContext(t *testing.T) (*keeper.Keeper, sdk.Context, context.Context) {
	t.Helper()
	k, ctx := newZkpKeeperForGRPCTest(t)
	ctx = ctx.WithGasMeter(storetypes.NewGasMeter(1_000_000_000))
	return k, ctx, sdk.WrapSDKContext(ctx)
}

func TestKeeperGasMeteringBaseCharge(t *testing.T) {
	k, ctx, goCtx := newGasMeteredKeeperContext(t)

	before := ctx.GasMeter().GasConsumed()
	respEq, err := k.VerifyEqualityProof(goCtx, &types.QueryVerifyEqualityProofRequest{ProofData: []byte{1}})
	require.NoError(t, err)
	require.False(t, respEq.Valid)
	require.Equal(t, "invalid proof data length", respEq.Error)
	afterEq := ctx.GasMeter().GasConsumed()
	require.Equal(t, before+types.GasVerifyEqualityProof, afterEq)

	respVal, err := k.VerifyValidityProof(goCtx, &types.QueryVerifyValidityProofRequest{ProofData: []byte{1}})
	require.NoError(t, err)
	require.False(t, respVal.Valid)
	require.Equal(t, "invalid proof data length", respVal.Error)
	afterVal := ctx.GasMeter().GasConsumed()
	require.Equal(t, afterEq+types.GasVerifyValidityProof, afterVal)
}

func TestKeeperGasMeteringMalformedPreParse(t *testing.T) {
	k, ctx, goCtx := newGasMeteredKeeperContext(t)

	before := ctx.GasMeter().GasConsumed()
	respW, err := k.VerifyWithdrawRangeProof(goCtx, &types.QueryVerifyWithdrawRangeProofRequest{ProofData: []byte{1}})
	require.NoError(t, err)
	require.False(t, respW.Valid)
	require.Equal(t, "invalid proof data length", respW.Error)
	afterW := ctx.GasMeter().GasConsumed()
	require.Equal(t, before+types.GasVerifyWithdrawRangeProof, afterW)

	respT, err := k.VerifyTransferRangeProof(goCtx, &types.QueryVerifyTransferRangeProofRequest{ProofData: []byte{1}})
	require.NoError(t, err)
	require.False(t, respT.Valid)
	require.Equal(t, "invalid proof data length", respT.Error)
	afterT := ctx.GasMeter().GasConsumed()
	require.Equal(t, afterW+types.GasVerifyTransferRangeProof, afterT)

	respTP, err := k.VerifyTransferProofs(goCtx, &types.QueryVerifyTransferProofsRequest{
		EqualityProofData: []byte{1},
		RangeProofData:    []byte{1},
		ValidityProofData: []byte{1},
	})
	require.NoError(t, err)
	require.False(t, respTP.Valid)
	require.Equal(t, "invalid equality proof data length", respTP.Error)
	afterTP := ctx.GasMeter().GasConsumed()
	require.Equal(t, afterT+types.GasVerifyTransferProofs, afterTP)

	respWP, err := k.VerifyWithdrawProofs(goCtx, &types.QueryVerifyWithdrawProofsRequest{
		EqualityProofData: []byte{1},
		RangeProofData:    []byte{1},
	})
	require.NoError(t, err)
	require.False(t, respWP.Valid)
	require.Equal(t, "invalid equality proof data length", respWP.Error)
	afterWP := ctx.GasMeter().GasConsumed()
	require.Equal(t, afterTP+types.GasVerifyWithdrawProofs, afterWP)
}

func TestKeeperGasMeteringProportionalCharge(t *testing.T) {
	makeTransferRangeProof := func(bitLen uint8) []byte {
		raw := make([]byte, 8*32+8+736)
		raw[8*32] = bitLen
		return raw
	}
	makeWithdrawRangeProof := func(bitLen uint8) []byte {
		raw := make([]byte, 8*32+8+8+672)
		raw[8*32] = bitLen
		return raw
	}

	t.Run("transfer range scales by bit length", func(t *testing.T) {
		k, ctx, goCtx := newGasMeteredKeeperContext(t)
		before := ctx.GasMeter().GasConsumed()
		_, err := k.VerifyTransferRangeProof(goCtx, &types.QueryVerifyTransferRangeProofRequest{
			ProofData: makeTransferRangeProof(16),
		})
		require.NoError(t, err)
		after16 := ctx.GasMeter().GasConsumed()

		_, err = k.VerifyTransferRangeProof(goCtx, &types.QueryVerifyTransferRangeProofRequest{
			ProofData: makeTransferRangeProof(64),
		})
		require.NoError(t, err)
		after64 := ctx.GasMeter().GasConsumed()

		charge16 := after16 - before
		charge64 := after64 - after16
		require.Equal(t, types.GasVerifyTransferRangeProof+16*types.GasRangeProofPerBitU128, charge16)
		require.Equal(t, types.GasVerifyTransferRangeProof+64*types.GasRangeProofPerBitU128, charge64)
		require.Greater(t, charge64, charge16)
	})

	t.Run("withdraw range scales by bit length", func(t *testing.T) {
		k, ctx, goCtx := newGasMeteredKeeperContext(t)
		before := ctx.GasMeter().GasConsumed()
		_, err := k.VerifyWithdrawRangeProof(goCtx, &types.QueryVerifyWithdrawRangeProofRequest{
			ProofData: makeWithdrawRangeProof(16),
		})
		require.NoError(t, err)
		after16 := ctx.GasMeter().GasConsumed()

		_, err = k.VerifyWithdrawRangeProof(goCtx, &types.QueryVerifyWithdrawRangeProofRequest{
			ProofData: makeWithdrawRangeProof(64),
		})
		require.NoError(t, err)
		after64 := ctx.GasMeter().GasConsumed()

		charge16 := after16 - before
		charge64 := after64 - after16
		require.Equal(t, types.GasVerifyWithdrawRangeProof+16*types.GasRangeProofPerBitU64, charge16)
		require.Equal(t, types.GasVerifyWithdrawRangeProof+64*types.GasRangeProofPerBitU64, charge64)
		require.Greater(t, charge64, charge16)
	})
}
