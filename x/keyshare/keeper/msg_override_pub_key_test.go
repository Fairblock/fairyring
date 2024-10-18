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

func TestOverrideLatestPubKeyMsgServer(t *testing.T) {
	k, ctx, _, _ := keepertest.KeyshareKeeper(t)
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
		request *types.MsgOverrideLatestPubKey
		err     error
	}{
		{
			desc:    "Unauthorized",
			request: &types.MsgOverrideLatestPubKey{Creator: "B"},
			err:     types.ErrAddressNotTrusted,
		},
		{
			desc: "SuccessOverridePubKey",
			request: &types.MsgOverrideLatestPubKey{
				PublicKey:          out.MasterPublicKey,
				Creator:            creator,
				Commitments:        out.Commitments,
				NumberOfValidators: 1,
				EncryptedKeyshares: out.KeyShareEncryptedKeyShares,
			},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {

			_, err := srv.OverrideLatestPubKey(wctx, tc.request)

			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
			}

			if tc.desc == "QueuedKeyAlreadyExists" {
				k.DeleteQueuedPubKey(wctx)
			}
		})
	}
}
