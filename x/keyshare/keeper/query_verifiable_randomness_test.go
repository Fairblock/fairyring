package keeper_test

import (
	"crypto/sha256"
	"encoding/hex"
	"math/rand"
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/testutil/random"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func TestVerifiableRandomnessQuery(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)

	for _, tc := range []struct {
		desc     string
		request  *types.QueryVerifiableRandomnessRequest
		response *types.QueryVerifiableRandomnessResponse
		err      error
	}{
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
		{
			desc:    "DecryptionKeyNotFound",
			request: &types.QueryVerifiableRandomnessRequest{},
			err:     status.Error(codes.Internal, "decryption key not found"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.VerifiableRandomness(wctx, tc.request)
			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
				require.Equal(t,
					nullify.Fill(tc.response),
					nullify.Fill(response),
				)
			}
		})
	}

	randomHeight := rand.Uint64()

	keeper.SetDecryptionKey(ctx, types.DecryptionKey{
		Height: randomHeight,
		Data:   "NotHexString",
	})

	randomData := random.RandHex(64)
	randomBytes, _ := hex.DecodeString(randomData)

	hash := sha256.New()
	hash.Write(randomBytes)
	hashedDecryptionKey := hash.Sum(nil)

	for _, tc := range []struct {
		desc     string
		request  *types.QueryVerifiableRandomnessRequest
		response *types.QueryVerifiableRandomnessResponse
		err      error
	}{
		{
			desc:    "UnableDecodeDecryptionKey",
			request: &types.QueryVerifiableRandomnessRequest{},
			err:     status.Error(codes.Internal, "unable to decode decryption key"),
		},
		{
			desc:    "QueryVerifiableRandomness",
			request: &types.QueryVerifiableRandomnessRequest{},
			response: &types.QueryVerifiableRandomnessResponse{
				Randomness: hex.EncodeToString(hashedDecryptionKey),
				Round:      randomHeight + 1,
			},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.VerifiableRandomness(wctx, tc.request)
			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
				require.Equal(t,
					nullify.Fill(tc.response),
					nullify.Fill(response),
				)
			}
		})
		keeper.SetDecryptionKey(ctx, types.DecryptionKey{
			Height: randomHeight + 1,
			Data:   randomData,
		})
	}
}
