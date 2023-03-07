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

func TestPubKeyIDMsgServerCreate(t *testing.T) {
	k, ctx := keepertest.FairyringKeeper(t)
	srv := keeper.NewMsgServerImpl(*k)
	wctx := sdk.WrapSDKContext(ctx)
	creator := "A"
	for i := 0; i < 5; i++ {
		expected := &types.MsgCreatePubKeyID{Creator: creator,
			Height: uint64(i),
		}
		_, err := srv.CreatePubKeyID(wctx, expected)
		require.NoError(t, err)
		rst, found := k.GetPubKeyID(ctx,
			expected.Height,
		)
		require.True(t, found)
		require.Equal(t, expected.Creator, rst.Creator)
	}
}
