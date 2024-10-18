package keeper_test

import (
	"strconv"
	"testing"

	"cosmossdk.io/math"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/testutil/random"
	"github.com/Fairblock/fairyring/testutil/sample"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestSubmitGeneralEncryptedTx(t *testing.T) {
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

	validIdentity := random.RandHex(16)

	for _, tc := range []struct {
		desc     string
		request  *types.MsgSubmitGeneralEncryptedTx
		response *types.MsgSubmitEncryptedTxResponse
		err      error
		errMsg   string
	}{
		{
			desc: "InvalidIdentity",
			request: &types.MsgSubmitGeneralEncryptedTx{
				Creator: sample.AccAddress(),
				ReqId:   random.RandHex(32),
				Data:    random.RandHex(192),
			},
			err: types.ErrInvalidIdentity,
		},
		{
			desc: "InvalidMsgCreator",
			request: &types.MsgSubmitGeneralEncryptedTx{
				Creator: "abcdefghjkoem0-294",
				ReqId:   validIdentity,
				Data:    random.RandHex(192),
			},
			err: types.ErrInvalidMsgCreator,
		},
		{
			desc: "ValidEncryptedTx",
			request: &types.MsgSubmitGeneralEncryptedTx{
				Creator: trustedAddr,
				ReqId:   validIdentity,
				Data:    random.RandHex(192),
			},
			response: &types.MsgSubmitEncryptedTxResponse{},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := srv.SubmitGeneralEncryptedTx(wctx, tc.request)
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

			if tc.desc == "InvalidIdentity" {
				k.SetEntry(wctx, types.IdentityExecutionEntry{
					Creator:       sample.AccAddress(),
					RequestId:     validIdentity,
					Identity:      validIdentity,
					Pubkey:        random.RandHex(96),
					TxList:        nil,
					DecryptionKey: random.RandHex(96),
				})
			}
		})
	}
}
