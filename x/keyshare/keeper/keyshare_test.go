package keeper_test

import (
	"testing"

	"github.com/Fairblock/fairyring/testutil/random"
	"github.com/Fairblock/fairyring/testutil/sample"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

func createNKeyshares(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.Keyshare {
	items := make([]types.Keyshare, n)
	for i := range items {
		items[i].Validator = sample.AccAddress()
		items[i].Keyshare = random.RandHex(10)
		items[i].BlockHeight = uint64(i)
		keeper.SetKeyshare(ctx, items[i])
	}
	return items
}

func TestKeyshareGet(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	items := createNKeyshares(&keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetKeyshare(ctx,
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

func TestKeysharesRemove(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	items := createNKeyshares(&keeper, ctx, 10)

	keeper.RemoveKeyshare(ctx,
		items[0].Validator,
		items[0].BlockHeight,
	)
	_, found := keeper.GetKeyshare(ctx,
		items[0].Validator,
		items[0].BlockHeight,
	)
	require.False(t, found)
}

func TestKeysharesGetAll(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	items := createNKeyshares(&keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllKeyshare(ctx)),
	)
}
