package keeper_test

import (
	"strconv"
	"testing"

	keepertest "fairyring/testutil/keeper"
	"fairyring/testutil/nullify"
	"fairyring/x/fairblock/keeper"
	"fairyring/x/fairblock/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNFairblockExecutedNonce(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.FairblockExecutedNonce {
	items := make([]types.FairblockExecutedNonce, n)
	for i := range items {
		items[i].Address = strconv.Itoa(i)

		keeper.SetFairblockExecutedNonce(ctx, items[i])
	}
	return items
}

func TestFairblockExecutedNonceGet(t *testing.T) {
	keeper, ctx := keepertest.FairblockKeeper(t)
	items := createNFairblockExecutedNonce(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetFairblockExecutedNonce(ctx,
			item.Address,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestFairblockExecutedNonceRemove(t *testing.T) {
	keeper, ctx := keepertest.FairblockKeeper(t)
	items := createNFairblockExecutedNonce(keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveFairblockExecutedNonce(ctx,
			item.Address,
		)
		_, found := keeper.GetFairblockExecutedNonce(ctx,
			item.Address,
		)
		require.False(t, found)
	}
}

func TestFairblockExecutedNonceGetAll(t *testing.T) {
	keeper, ctx := keepertest.FairblockKeeper(t)
	items := createNFairblockExecutedNonce(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllFairblockExecutedNonce(ctx)),
	)
}
