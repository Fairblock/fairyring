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

func createNAuthorizedAddress(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.AuthorizedAddress {
	items := make([]types.AuthorizedAddress, n)
	for i := range items {
		items[i].Target = strconv.Itoa(i)

		keeper.SetAuthorizedAddress(ctx, items[i])
	}
	return items
}

func TestAuthorizedAddressGet(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNAuthorizedAddress(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetAuthorizedAddress(ctx,
			item.Target,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestAuthorizedAddressRemove(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNAuthorizedAddress(keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveAuthorizedAddress(ctx,
			item.Target,
		)
		_, found := keeper.GetAuthorizedAddress(ctx,
			item.Target,
		)
		require.False(t, found)
	}
}

func TestAuthorizedAddressGetAll(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNAuthorizedAddress(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllAuthorizedAddress(ctx)),
	)
}
