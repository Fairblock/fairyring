package keeper_test

import (
	"strconv"
	"testing"

	keepertest "github.com/FairBlock/fairyring/testutil/keeper"
	"github.com/FairBlock/fairyring/testutil/nullify"
	"github.com/FairBlock/fairyring/x/keyshare/keeper"
	"github.com/FairBlock/fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNValidatorSet(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.ValidatorSet {
	items := make([]types.ValidatorSet, n)
	for i := range items {
		items[i].Index = strconv.Itoa(i)

		keeper.SetValidatorSet(ctx, items[i])
	}
	return items
}

func TestValidatorSetGet(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNValidatorSet(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetValidatorSet(ctx,
			item.Index,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestValidatorSetRemove(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNValidatorSet(keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveValidatorSet(ctx,
			item.Index,
		)
		_, found := keeper.GetValidatorSet(ctx,
			item.Index,
		)
		require.False(t, found)
	}
}

func TestValidatorSetGetAll(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNValidatorSet(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllValidatorSet(ctx)),
	)
}
