package keeper_test

import (
	"context"
	"github.com/Fairblock/fairyring/testutil/random"
	"strconv"
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createLatestHeight(keeper keeper.Keeper, ctx context.Context) string {
	randHeight := random.RandHex(16)
	keeper.SetLatestHeight(ctx, randHeight)
	return randHeight
}

func TestLatestHeightGet(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	latestHeight := createLatestHeight(keeper, ctx)
	result := keeper.GetLatestHeight(ctx)
	require.Equal(t,
		nullify.Fill(latestHeight),
		nullify.Fill(result),
	)
}

func createLastExecutedHeight(keeper keeper.Keeper, ctx context.Context) string {
	randHeight := random.RandHex(16)
	keeper.SetLastExecutedHeight(ctx, randHeight)
	return randHeight
}

func TestLastExecutedHeightGet(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	latestHeight := createLastExecutedHeight(keeper, ctx)
	result := keeper.GetLastExecutedHeight(ctx)
	require.Equal(t,
		nullify.Fill(latestHeight),
		nullify.Fill(result),
	)
}
