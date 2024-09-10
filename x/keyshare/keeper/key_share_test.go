package keeper_test

import (
	"github.com/Fairblock/fairyring/testutil/random"
	"github.com/Fairblock/fairyring/testutil/sample"
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

func createNKeyShares(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.KeyShare {
	items := make([]types.KeyShare, n)
	for i := range items {
		items[i].Validator = sample.AccAddress()
		items[i].KeyShare = random.RandHex(10)
		items[i].BlockHeight = uint64(i)
		keeper.SetKeyShare(ctx, items[i])
	}
	return items
}

func TestKeyShareGet(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNKeyShares(&keeper, ctx, 10)
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

func TestKeySharesRemove(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNKeyShares(&keeper, ctx, 10)

	keeper.RemoveKeyShare(ctx,
		items[0].Validator,
		items[0].BlockHeight,
	)
	_, found := keeper.GetKeyShare(ctx,
		items[0].Validator,
		items[0].BlockHeight,
	)
	require.False(t, found)
}

func TestKeySharesGetAll(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNKeyShares(&keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllKeyShare(ctx)),
	)
}
