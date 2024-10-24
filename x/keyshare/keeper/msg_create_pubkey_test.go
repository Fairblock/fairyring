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

func TestLatestPubkeyMsgServerCreate(t *testing.T) {
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

	k.SetQueuedPubkey(wctx, types.QueuedPubkey{
		PublicKey:          out.MasterPublicKey,
		Creator:            creator,
		Expiry:             123456,
		NumberOfValidators: 1,
		EncryptedKeyshares: out.KeyshareEncryptedKeyshares,
	})

	for _, tc := range []struct {
		desc    string
		request *types.MsgCreateLatestPubkey
		err     error
	}{
		{
			desc:    "Unauthorized",
			request: &types.MsgCreateLatestPubkey{Creator: "B"},
			err:     types.ErrAddressNotTrusted,
		},
		{
			desc: "QueuedKeyAlreadyExists",
			request: &types.MsgCreateLatestPubkey{
				Creator: creator,
			},
			err: types.ErrQueuedKeyAlreadyExists,
		},
		{
			desc: "SuccessCreatePubkey",
			request: &types.MsgCreateLatestPubkey{
				PublicKey:          out.MasterPublicKey,
				Creator:            creator,
				NumberOfValidators: 1,
				EncryptedKeyshares: out.KeyshareEncryptedKeyshares,
			},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			_, err := srv.CreateLatestPubkey(wctx, tc.request)

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
