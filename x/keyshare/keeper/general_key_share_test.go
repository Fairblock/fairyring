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

func createNGeneralKeyShares(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.GeneralKeyshare {
	items := make([]types.GeneralKeyshare, n)
	for i := range items {
		items[i].Validator = sample.AccAddress()
		items[i].IdValue = fmt.Sprintf("testing/%d", i)
		items[i].IdType = "testing"
		items[i].Keyshare = random.RandHex(10)
		keeper.SetGeneralKeyShare(ctx, items[i])
	}
	return items
}

func TestGeneralKeyShareGet(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	items := createNGeneralKeyShares(&keeper, ctx, 10)
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

func TestGeneralKeySharesRemove(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	items := createNGeneralKeyShares(&keeper, ctx, 10)

	keeper.RemoveGeneralKeyShare(ctx,
		items[0].Validator,
		items[0].IdType,
		items[0].IdValue,
	)
	_, found := keeper.GetGeneralKeyShare(ctx,
		items[0].Validator,
		items[0].IdType,
		items[0].IdValue,
	)
	require.False(t, found)
}

func TestGeneralKeySharesGetAll(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	items := createNGeneralKeyShares(&keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllGeneralKeyShare(ctx)),
	)
}
