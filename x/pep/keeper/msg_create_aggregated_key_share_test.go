package keeper_test

import (
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/testutil/random"
	"github.com/Fairblock/fairyring/testutil/sample"
	"github.com/Fairblock/fairyring/testutil/shares"
	types2 "github.com/Fairblock/fairyring/x/common/types"
	"math/rand"
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestAggregatedKeyShareMsgServerCreate(t *testing.T) {
	k, ctx := keepertest.PepKeeper(t)
	srv := keeper.NewMsgServerImpl(k)
	wctx := sdk.UnwrapSDKContext(ctx)

	startParams := types.DefaultParams()
	startParams.IsSourceChain = true

	err := k.SetParams(wctx, startParams)
	require.NoError(t, err)

	trustedAddr := sample.AccAddress()

	out, err := random.GeneratePubKeyAndShares(1)
	require.NoError(t, err)

	derived, err := shares.DeriveShare(out.GeneratedShare[0].Share, 1, "999")
	require.NoError(t, err)

	incorrectDerived, err := shares.DeriveShare(out.GeneratedShare[0].Share, 1, "9999")
	require.NoError(t, err)

	for _, tc := range []struct {
		desc     string
		request  *types.MsgCreateAggregatedKeyShare
		response *types.MsgCreateAggregatedKeyShareResponse
		err      error
		errMsg   string
	}{
		{
			desc: "IsSourceChainTriesToCreateAggrKey",
			request: &types.MsgCreateAggregatedKeyShare{
				Creator: sample.AccAddress(),
				Height:  rand.Uint64(),
				Data:    random.RandHex(192),
			},
			errMsg: "submission of external aggregated keyshare not permitted on source chain",
		},
		{
			desc: "SubmittedFromNotTrustedAddr",
			request: &types.MsgCreateAggregatedKeyShare{
				Creator: sample.AccAddress(),
				Height:  rand.Uint64(),
				Data:    random.RandHex(192),
			},
			errMsg: "msg not from trusted source",
		},
		{
			desc: "ActiveKeyNotFound",
			request: &types.MsgCreateAggregatedKeyShare{
				Creator: trustedAddr,
				Height:  rand.Uint64(),
				Data:    random.RandHex(192),
			},
			errMsg: "active key not found",
		},
		{
			desc: "InvalidAggregatedKeyShare",
			request: &types.MsgCreateAggregatedKeyShare{
				Creator: trustedAddr,
				Height:  rand.Uint64(),
				Data:    random.RandHex(12),
			},
			errMsg: "input string length must be equal to 96 bytes",
		},
		{
			desc: "DecryptError",
			request: &types.MsgCreateAggregatedKeyShare{
				Creator: trustedAddr,
				Height:  999,
				Data:    incorrectDerived,
			},
			errMsg: "age decrypt: errNoMatch",
		},
		{
			desc: "ValidAggregatedKeyShare",
			request: &types.MsgCreateAggregatedKeyShare{
				Creator: trustedAddr,
				Height:  999,
				Data:    derived,
			},
			response: &types.MsgCreateAggregatedKeyShareResponse{},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := srv.CreateAggregatedKeyShare(wctx, tc.request)
			if len(tc.errMsg) > 0 {
				require.Equal(t,
					nullify.Fill(err.Error()),
					nullify.Fill(tc.errMsg))
			} else if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
				require.Equal(t,
					nullify.Fill(tc.response),
					nullify.Fill(response),
				)
			}

			if tc.desc == "IsSourceChainTriesToCreateAggrKey" {
				startParams.IsSourceChain = false
				err = k.SetParams(wctx, startParams)
				require.NoError(t, err)
			} else if tc.desc == "SubmittedFromNotTrustedAddr" {
				param := k.GetParams(wctx)
				param.TrustedAddresses = []string{trustedAddr}
				err = k.SetParams(wctx, param)
				require.NoError(t, err)
			} else if tc.desc == "ActiveKeyNotFound" {
				k.SetActivePubKey(wctx, types2.ActivePublicKey{
					PublicKey: out.MasterPublicKey,
					Creator:   trustedAddr,
					Expiry:    12342423432,
				})
			}
		})
	}
}
