package keeper_test

import (
	"strconv"
	"testing"

	keepertest "fairyring/testutil/keeper"
	"fairyring/testutil/nullify"
	"fairyring/x/keyshare/keeper"
	"fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNKeyShare(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.KeyShare {
	items := make([]types.KeyShare, n)
	for i := range items {
		items[i].Validator = strconv.Itoa(i)
		items[i].BlockHeight = uint64(i)

		keeper.SetKeyShare(ctx, items[i])
	}
	return items
}

func TestKeyShareGet(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNKeyShare(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetKeyShare(ctx,
			item.Validator,
			item.BlockHeight,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestKeyShareRemove(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNKeyShare(keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveKeyShare(ctx,
			item.Validator,
			item.BlockHeight,
		)
		_, found := keeper.GetKeyShare(ctx,
			item.Validator,
			item.BlockHeight,
		)
		require.False(t, found)
	}
}

func TestKeyShareGetAll(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNKeyShare(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllKeyShare(ctx)),
	)
}
