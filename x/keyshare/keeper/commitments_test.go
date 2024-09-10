package keeper_test

import (
	"github.com/Fairblock/fairyring/testutil/random"
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

func createNCommitments(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.Commitments {
	items := make([]types.Commitments, n)
	for i := range items {
		commitments := make([]string, n)
		for j := 0; j < n; j++ {
			commitments[j] = random.RandHex(10)
		}
		items[i].Commitments = commitments
		keeper.SetActiveCommitments(ctx, items[i])
		keeper.SetQueuedCommitments(ctx, items[i])
	}
	return items
}

func TestActiveCommitmentsGet(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNCommitments(&keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetActiveCommitments(ctx)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}

func TestQueuedCommitmentsGet(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	items := createNCommitments(&keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetQueuedCommitments(ctx)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}

func TestActiveCommitmentsRemove(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	createNCommitments(&keeper, ctx, 10)
	_, found := keeper.GetActiveCommitments(ctx)
	require.True(t, found)

	keeper.DeleteActiveCommitments(ctx)
	_, found = keeper.GetActiveCommitments(ctx)
	require.False(t, found)
}

func TestQueuedCommitmentsRemove(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	createNCommitments(&keeper, ctx, 10)
	_, found := keeper.GetQueuedCommitments(ctx)
	require.True(t, found)

	keeper.DeleteQueuedCommitments(ctx)
	_, found = keeper.GetQueuedCommitments(ctx)
	require.False(t, found)
}
