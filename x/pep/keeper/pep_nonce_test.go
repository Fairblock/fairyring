package keeper_test

import (
	"strconv"
	"testing"

	keepertest "fairyring/testutil/keeper"
	"fairyring/testutil/nullify"
	"fairyring/x/pep/keeper"
	"fairyring/x/pep/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNPepNonce(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.PepNonce {
	items := make([]types.PepNonce, n)
	for i := range items {
		items[i].Address = strconv.Itoa(i)

		keeper.SetPepNonce(ctx, items[i])
	}
	return items
}

func TestPepNonceGet(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNPepNonce(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetPepNonce(ctx,
			item.Address,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestPepNonceRemove(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNPepNonce(keeper, ctx, 10)
	for _, item := range items {
		keeper.RemovePepNonce(ctx,
			item.Address,
		)
		_, found := keeper.GetPepNonce(ctx,
			item.Address,
		)
		require.False(t, found)
	}
}

func TestPepNonceGetAll(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNPepNonce(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllPepNonce(ctx)),
	)
}
