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

func createNValidatorSet(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.ValidatorSet {
	items := make([]types.ValidatorSet, n)
	for i := range items {
		addr := sample.AccAddress()
		items[i].Validator = addr
		items[i].Index = random.RandHex(10)
		items[i].IsActive = true
		keeper.SetValidatorSet(ctx, items[i])
	}
	return items
}

func TestValidatorSetGet(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	items := createNValidatorSet(&keeper, ctx, 10)
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
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	items := createNValidatorSet(&keeper, ctx, 10)

	keeper.RemoveValidatorSet(ctx,
		items[0].Index,
	)
	_, found := keeper.GetValidatorSet(ctx,
		items[0].Index,
	)
	require.False(t, found)
}

func TestValidatorSetGetAll(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	items := createNValidatorSet(&keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllValidatorSet(ctx)),
	)
}
