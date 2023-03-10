package keeper_test

import (
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	keepertest "fairyring/testutil/keeper"
	"fairyring/x/fairyring/keeper"
	"fairyring/x/fairyring/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestLatestPubKeyMsgServerCreate(t *testing.T) {
	k, ctx := keepertest.FairyringKeeper(t)
	srv := keeper.NewMsgServerImpl(*k)
	wctx := sdk.WrapSDKContext(ctx)
	creator := "A"
	for i := 0; i < 5; i++ {
		expected := &types.MsgCreateLatestPubKey{Creator: creator,
			PublicKey: strconv.Itoa(i),
		}
		_, err := srv.CreateLatestPubKey(wctx, expected)
		require.NoError(t, err)
		rst, found := k.GetLatestPubKey(ctx)
		require.True(t, found)
		require.Equal(t, expected.Creator, rst.Creator)
	}
}
