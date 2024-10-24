package keeper_test

import (
	"strconv"
	"testing"

	"github.com/Fairblock/fairyring/testutil/shares"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestSendKeyshareMsgServerCreateAggregated(t *testing.T) {
	k, ctx, _ := keepertest.KeyshareKeeper(t)
	srv := keeper.NewMsgServerImpl(k)
	wctx := sdk.UnwrapSDKContext(ctx)

	out, creator := SetupTestGeneralKeyshare(t, wctx, k, 1, 1)

	var idUint uint64 = 1

	derived, err := shares.DeriveShare(out.GeneratedShare[0].Share, 1, "1")
	require.NoError(t, err)

	expected := &types.MsgSendKeyshare{
		Creator:       creator,
		Message:       derived,
		KeyshareIndex: idUint,
		BlockHeight:   idUint,
	}

	_, err = srv.SendKeyshare(wctx, expected)
	require.NoError(t, err)

	rst, found := k.GetKeyshare(wctx,
		expected.Creator,
		idUint,
	)
	require.True(t, found)
	require.Equal(t, expected.Creator, rst.Validator)

	_, found = k.GetDecryptionKey(wctx, idUint)
	require.True(t, found)
}

func TestSendKeyshareMsgServerCreateNotAggregated(t *testing.T) {
	k, ctx, _ := keepertest.KeyshareKeeper(t)
	srv := keeper.NewMsgServerImpl(k)
	wctx := sdk.UnwrapSDKContext(ctx)

	out, creator := SetupTestGeneralKeyshare(t, wctx, k, 10, 10)

	var idUint uint64 = 1

	derived, err := shares.DeriveShare(out.GeneratedShare[0].Share, 1, "1")
	require.NoError(t, err)

	expected := &types.MsgSendKeyshare{
		Creator:       creator,
		Message:       derived,
		KeyshareIndex: idUint,
		BlockHeight:   idUint,
	}

	_, err = srv.SendKeyshare(wctx, expected)
	require.NoError(t, err)

	rst, found := k.GetKeyshare(wctx,
		expected.Creator,
		idUint,
	)
	require.True(t, found)
	require.Equal(t, expected.Creator, rst.Validator)

	_, found = k.GetDecryptionKey(wctx, idUint)
	require.False(t, found)
}

func TestSendKeyshareMsgServerFailCases(t *testing.T) {
	k, ctx, _ := keepertest.KeyshareKeeper(t)
	srv := keeper.NewMsgServerImpl(k)
	wctx := sdk.UnwrapSDKContext(ctx)

	_, creator := SetupTestGeneralKeyshare(t, wctx, k, 1, 1)

	for _, tc := range []struct {
		desc    string
		request *types.MsgSendKeyshare
		err     error
	}{
		{
			desc:    "Unauthorized",
			request: &types.MsgSendKeyshare{Creator: "B"},
			err:     types.ErrAddrIsNotValidatorOrAuthorized,
		},
		{
			desc: "InvalidBlockHeight",
			request: &types.MsgSendKeyshare{
				Creator:     creator,
				BlockHeight: 999,
			},
			err: types.ErrInvalidBlockHeight,
		},
		{
			desc: "InvalidKeyshareIndex",
			request: &types.MsgSendKeyshare{
				Creator:       creator,
				KeyshareIndex: 999,
			},
			err: types.ErrInvalidKeyshareIndex,
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			_, err := srv.SendKeyshare(wctx, tc.request)

			require.ErrorIs(t, err, tc.err)
		})
	}
}
