package keeper_test

import (
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	keepertest "fairyring/testutil/keeper"
	"fairyring/x/fairblock/keeper"
	"fairyring/x/fairblock/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestAggregatedKeyShareMsgServerCreate(t *testing.T) {
	k, ctx := keepertest.FairblockKeeper(t)
	srv := keeper.NewMsgServerImpl(*k)
	wctx := sdk.WrapSDKContext(ctx)
	creator := "A"
	for i := 0; i < 5; i++ {
		expected := &types.MsgCreateAggregatedKeyShare{Creator: creator,
			Height: uint64(i),
		}
		_, err := srv.CreateAggregatedKeyShare(wctx, expected)
		require.NoError(t, err)
		rst, found := k.GetAggregatedKeyShare(ctx,
			expected.Height,
		)
		require.True(t, found)
		require.Equal(t, expected.Creator, rst.Creator)
	}
}
