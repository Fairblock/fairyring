package keeper_test

import (
	"fmt"
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

func createNGeneralKeyshares(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.GeneralKeyshare {
	items := make([]types.GeneralKeyshare, n)
	for i := range items {
		items[i].Validator = sample.AccAddress()
		items[i].IdValue = fmt.Sprintf("testing/%d", i)
		items[i].IdType = "testing"
		items[i].Keyshare = random.RandHex(10)
		keeper.SetGeneralKeyshare(ctx, items[i])
	}
	return items
}

func TestGeneralKeyshareGet(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	items := createNGeneralKeyshares(&keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetGeneralKeyshare(ctx,
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

func TestGeneralKeysharesRemove(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	items := createNGeneralKeyshares(&keeper, ctx, 10)

	keeper.RemoveGeneralKeyshare(ctx,
		items[0].Validator,
		items[0].IdType,
		items[0].IdValue,
	)
	_, found := keeper.GetGeneralKeyshare(ctx,
		items[0].Validator,
		items[0].IdType,
		items[0].IdValue,
	)
	require.False(t, found)
}

func TestGeneralKeysharesGetAll(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	items := createNGeneralKeyshares(&keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllGeneralKeyshare(ctx)),
	)
}
