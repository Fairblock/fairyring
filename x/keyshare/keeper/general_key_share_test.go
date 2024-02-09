package keeper_test

import (
	"strconv"
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNGeneralKeyShare(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.GeneralKeyShare {
	items := make([]types.GeneralKeyShare, n)
	for i := range items {
		items[i].Validator = strconv.Itoa(i)
		items[i].IdType = strconv.Itoa(i)
		items[i].IdValue = strconv.Itoa(i)

		keeper.SetGeneralKeyShare(ctx, items[i])
	}
	return items
}

func TestGeneralKeyShareGet(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNGeneralKeyShare(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetGeneralKeyShare(ctx,
			item.Validator,
			item.IdType,
			item.IdValue,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestGeneralKeyShareRemove(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNGeneralKeyShare(keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveGeneralKeyShare(ctx,
			item.Validator,
			item.IdType,
			item.IdValue,
		)
		_, found := keeper.GetGeneralKeyShare(ctx,
			item.Validator,
			item.IdType,
			item.IdValue,
		)
		require.False(t, found)
	}
}

func TestGeneralKeyShareGetAll(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNGeneralKeyShare(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllGeneralKeyShare(ctx)),
	)
}
