package keeper_test

import (
	"strconv"
	"testing"

	"github.com/Fairblock/fairyring/testutil/random"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestOverrideLatestPubkeyMsgServer(t *testing.T) {
	k, ctx, _ := keepertest.KeyshareKeeper(t)
	srv := keeper.NewMsgServerImpl(k)
	wctx := sdk.UnwrapSDKContext(ctx)

	out, err := random.GeneratePubKeyAndShares(1)
	require.NoError(t, err)

	creator := out.GeneratedShare[0].ValidatorAddress

	params := types.DefaultParams()
	params.TrustedAddresses = append(params.TrustedAddresses, creator)
	err = k.SetParams(wctx, params)
	require.NoError(t, err)

	for _, tc := range []struct {
		desc    string
		request *types.MsgOverrideLatestPubkey
		err     error
	}{
		{
			desc:    "Unauthorized",
			request: &types.MsgOverrideLatestPubkey{Creator: "B"},
			err:     types.ErrAddressNotTrusted,
		},
		{
			desc: "SuccessOverridePubkey",
			request: &types.MsgOverrideLatestPubkey{
				PublicKey:          out.MasterPublicKey,
				Creator:            creator,
				Commitments:        out.Commitments,
				NumberOfValidators: 1,
				EncryptedKeyshares: out.KeyshareEncryptedKeyshares,
			},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			_, err := srv.OverrideLatestPubkey(wctx, tc.request)

			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
			}

			if tc.desc == "QueuedKeyAlreadyExists" {
				k.DeleteQueuedPubkey(wctx)
			}
		})
	}
}
