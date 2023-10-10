package keeper_test

import (
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	keepertest "fairyring/testutil/keeper"
	"fairyring/x/conditionalenc/keeper"
	"fairyring/x/conditionalenc/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestAggregatedConditionalKeyShareMsgServerCreate(t *testing.T) {
	k, ctx := keepertest.ConditionalEncKeeper(t)
	srv := keeper.NewMsgServerImpl(*k)
	wctx := sdk.WrapSDKContext(ctx)
	creator := "A"
	for i := 0; i < 5; i++ {
		expected := &types.MsgCreateAggregatedConditionalKeyShare{Creator: creator,
			Condition: strconv.Itoa(i),
		}
		_, err := srv.CreateAggregatedConditionalKeyShare(wctx, expected)
		require.NoError(t, err)
		rst, found := k.GetAggregatedConditionalKeyShare(ctx,
			expected.Condition,
		)
		require.True(t, found)
		require.Equal(t, expected.Creator, rst.Creator)
	}
}
