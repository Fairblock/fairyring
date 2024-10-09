package keeper_test

import (
	"cosmossdk.io/math"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/testutil/random"
	"github.com/Fairblock/fairyring/testutil/sample"
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

func TestSubmitEncryptedTx(t *testing.T) {
	k, ctx := keepertest.PepKeeper(t)
	srv := keeper.NewMsgServerImpl(k)
	wctx := sdk.UnwrapSDKContext(ctx)

	startParams := types.DefaultParams()
	startParams.IsSourceChain = true
	coin := sdk.NewCoin("stake", math.NewInt(0))
	startParams.MinGasPrice = &coin

	err := k.SetParams(wctx, startParams)
	require.NoError(t, err)

	trustedAddr := sample.AccAddress()

	out, err := random.GeneratePubKeyAndShares(1)
	require.NoError(t, err)

	for _, tc := range []struct {
		desc     string
		request  *types.MsgSubmitEncryptedTx
		response *types.MsgSubmitEncryptedTxResponse
		err      error
		errMsg   string
	}{
		{
			desc: "InvalidTargetBlockHeightLowerThanLatestHeight",
			request: &types.MsgSubmitEncryptedTx{
				Creator:           sample.AccAddress(),
				TargetBlockHeight: 0,
				Data:              random.RandHex(192),
			},
			err: types.ErrInvalidTargetBlockHeight,
		},
		{
			desc: "ActivePubKeyNotFound",
			request: &types.MsgSubmitEncryptedTx{
				Creator:           sample.AccAddress(),
				TargetBlockHeight: rand.Uint64(),
				Data:              random.RandHex(192),
			},
			err: types.ErrActivePubKeyNotFound,
		},
		{
			desc: "InvalidTargetBlockHeightHigherThanPubKey",
			request: &types.MsgSubmitEncryptedTx{
				Creator:           trustedAddr,
				TargetBlockHeight: 325677454353,
				Data:              random.RandHex(192),
			},
			err: types.ErrInvalidTargetBlockHeight,
		},
		{
			desc: "InvalidMsgCreator",
			request: &types.MsgSubmitEncryptedTx{
				Creator:           "abcdefghjkoem0-294",
				TargetBlockHeight: 123,
				Data:              random.RandHex(192),
			},
			err: types.ErrInvalidMsgCreator,
		},
		{
			desc: "ValidEncryptedTx",
			request: &types.MsgSubmitEncryptedTx{
				Creator:           trustedAddr,
				TargetBlockHeight: 999,
				Data:              random.RandHex(192),
			},
			response: &types.MsgSubmitEncryptedTxResponse{},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := srv.SubmitEncryptedTx(wctx, tc.request)
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

			if tc.desc == "ActivePubKeyNotFound" {
				k.SetActivePubKey(wctx, types2.ActivePublicKey{
					PublicKey: out.MasterPublicKey,
					Creator:   trustedAddr,
					Expiry:    325677,
				})
			}
		})
	}
}
