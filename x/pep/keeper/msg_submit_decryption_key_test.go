package keeper_test

import (
	"math/rand"
	"strconv"
	"testing"

	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/testutil/random"
	"github.com/Fairblock/fairyring/testutil/sample"
	"github.com/Fairblock/fairyring/testutil/shares"
	types2 "github.com/Fairblock/fairyring/x/common/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestSubmitDecryptionKey(t *testing.T) {
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
		request  *types.MsgSubmitDecryptionKey
		response *types.MsgSubmitDecryptionKeyResponse
		err      error
		errMsg   string
	}{
		{
			desc: "SourceChainTriesToSubmitDecryptionKey",
			request: &types.MsgSubmitDecryptionKey{
				Creator: sample.AccAddress(),
				Height:  rand.Uint64(),
				Data:    random.RandHex(192),
			},
			errMsg: "submission of external decryption keyshare not permitted on source chain",
		},
		{
			desc: "SubmittedFromNotTrustedAddr",
			request: &types.MsgSubmitDecryptionKey{
				Creator: sample.AccAddress(),
				Height:  rand.Uint64(),
				Data:    random.RandHex(192),
			},
			errMsg: "msg not from trusted source",
		},
		{
			desc: "ActiveKeyNotFound",
			request: &types.MsgSubmitDecryptionKey{
				Creator: trustedAddr,
				Height:  rand.Uint64(),
				Data:    random.RandHex(192),
			},
			errMsg: "active key not found",
		},
		{
			desc: "InvalidDecryptionKey",
			request: &types.MsgSubmitDecryptionKey{
				Creator: trustedAddr,
				Height:  rand.Uint64(),
				Data:    random.RandHex(12),
			},
			errMsg: "input string length must be equal to 96 bytes",
		},
		{
			desc: "DecryptError",
			request: &types.MsgSubmitDecryptionKey{
				Creator: trustedAddr,
				Height:  999,
				Data:    incorrectDerived,
			},
			errMsg: "age decrypt: errNoMatch",
		},
		{
			desc: "ValidDecryptionKey",
			request: &types.MsgSubmitDecryptionKey{
				Creator: trustedAddr,
				Height:  999,
				Data:    derived,
			},
			response: &types.MsgSubmitDecryptionKeyResponse{},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := srv.SubmitDecryptionKey(wctx, tc.request)
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

			if tc.desc == "SourceChainTriesToSubmitDecryptionKey" {
				startParams.IsSourceChain = false
				err = k.SetParams(wctx, startParams)
				require.NoError(t, err)
			} else if tc.desc == "SubmittedFromNotTrustedAddr" {
				param := k.GetParams(wctx)
				param.TrustedAddresses = []string{trustedAddr}
				err = k.SetParams(wctx, param)
				require.NoError(t, err)
			} else if tc.desc == "ActiveKeyNotFound" {
				k.SetActivePubkey(wctx, types2.ActivePublicKey{
					PublicKey: out.MasterPublicKey,
					Creator:   trustedAddr,
					Expiry:    12342423432,
				})
			}
		})
	}
}
