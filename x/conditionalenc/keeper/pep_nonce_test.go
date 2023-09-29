package keeper_test

import (
	"strconv"
	"testing"

	keepertest "fairyring/testutil/keeper"
	"fairyring/testutil/nullify"
	"fairyring/x/conditionalenc/keeper"
	"fairyring/x/conditionalenc/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNConditionalencNonce(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.ConditionalencNonce {
	items := make([]types.ConditionalencNonce, n)
	for i := range items {
		items[i].Address = strconv.Itoa(i)

		keeper.SetConditionalencNonce(ctx, items[i])
	}
	return items
}

func TestConditionalencNonceGet(t *testing.T) {
	keeper, ctx := keepertest.ConditionalEncKeeper(t)
	items := createNConditionalencNonce(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetConditionalencNonce(ctx,
			item.Address,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestConditionalencNonceRemove(t *testing.T) {
	keeper, ctx := keepertest.ConditionalEncKeeper(t)
	items := createNConditionalencNonce(keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveConditionalencNonce(ctx,
			item.Address,
		)
		_, found := keeper.GetConditionalencNonce(ctx,
			item.Address,
		)
		require.False(t, found)
	}
}

func TestConditionalencNonceGetAll(t *testing.T) {
	keeper, ctx := keepertest.ConditionalEncKeeper(t)
	items := createNConditionalencNonce(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllConditionalencNonce(ctx)),
	)
}
