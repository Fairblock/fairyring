package keeper_test

import (
	"strconv"
	"testing"

	keepertest "fairyring/testutil/keeper"
	"fairyring/testutil/nullify"
	"fairyring/x/fairblock/keeper"
	"fairyring/x/fairblock/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNAggregatedKeyShare(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.AggregatedKeyShare {
	items := make([]types.AggregatedKeyShare, n)
	for i := range items {
		items[i].Height = uint64(i)

		keeper.SetAggregatedKeyShare(ctx, items[i])
	}
	return items
}

func TestAggregatedKeyShareGet(t *testing.T) {
	keeper, ctx := keepertest.FairblockKeeper(t)
	items := createNAggregatedKeyShare(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetAggregatedKeyShare(ctx,
			item.Height,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestAggregatedKeyShareRemove(t *testing.T) {
	keeper, ctx := keepertest.FairblockKeeper(t)
	items := createNAggregatedKeyShare(keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveAggregatedKeyShare(ctx,
			item.Height,
		)
		_, found := keeper.GetAggregatedKeyShare(ctx,
			item.Height,
		)
		require.False(t, found)
	}
}

func TestAggregatedKeyShareGetAll(t *testing.T) {
	keeper, ctx := keepertest.FairblockKeeper(t)
	items := createNAggregatedKeyShare(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllAggregatedKeyShare(ctx)),
	)
}
