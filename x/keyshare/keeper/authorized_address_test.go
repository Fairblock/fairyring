package keeper_test

import (
	"github.com/Fairblock/fairyring/testutil/sample"
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

func createNAuthorizedAddress(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.AuthorizedAddress {
	items := make([]types.AuthorizedAddress, n)
	for i := range items {
		items[i].IsAuthorized = true
		items[i].AuthorizedBy = sample.AccAddress()
		items[i].Target = sample.AccAddress()

		keeper.SetAuthorizedAddress(ctx, items[i])
	}
	return items
}

func TestAuthorizedAddressGet(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	items := createNAuthorizedAddress(&keeper, ctx, 10)
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
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	items := createNAuthorizedAddress(&keeper, ctx, 10)
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
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	items := createNAuthorizedAddress(&keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllAuthorizedAddress(ctx)),
	)
}
