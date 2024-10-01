package keeper_test

import (
	"github.com/Fairblock/fairyring/testutil/random"
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestLatestPubKeyMsgServerCreate(t *testing.T) {
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

	k.SetQueuedPubKey(wctx, types.QueuedPubKey{
		PublicKey:          out.MasterPublicKey,
		Creator:            creator,
		Expiry:             123456,
		NumberOfValidators: 1,
		EncryptedKeyShares: out.KeyShareEncryptedKeyShares,
	})

	for _, tc := range []struct {
		desc    string
		request *types.MsgCreateLatestPubKey
		err     error
	}{
		{
			desc:    "Unauthorized",
			request: &types.MsgCreateLatestPubKey{Creator: "B"},
			err:     types.ErrAddressNotTrusted,
		},
		{
			desc: "QueuedKeyAlreadyExists",
			request: &types.MsgCreateLatestPubKey{
				Creator: creator,
			},
			err: types.ErrQueuedKeyAlreadyExists,
		},
		{
			desc: "SuccessCreatePubKey",
			request: &types.MsgCreateLatestPubKey{
				PublicKey:          out.MasterPublicKey,
				Creator:            creator,
				NumberOfValidators: 1,
				EncryptedKeyShares: out.KeyShareEncryptedKeyShares,
			},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {

			_, err := srv.CreateLatestPubKey(wctx, tc.request)

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
