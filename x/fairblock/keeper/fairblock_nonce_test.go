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

func createNFairblockNonce(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.FairblockNonce {
	items := make([]types.FairblockNonce, n)
	for i := range items {
		items[i].Address = strconv.Itoa(i)

		keeper.SetFairblockNonce(ctx, items[i])
	}
	return items
}

func TestFairblockNonceGet(t *testing.T) {
	keeper, ctx := keepertest.FairblockKeeper(t)
	items := createNFairblockNonce(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetFairblockNonce(ctx,
			item.Address,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestFairblockNonceRemove(t *testing.T) {
	keeper, ctx := keepertest.FairblockKeeper(t)
	items := createNFairblockNonce(keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveFairblockNonce(ctx,
			item.Address,
		)
		_, found := keeper.GetFairblockNonce(ctx,
			item.Address,
		)
		require.False(t, found)
	}
}

func TestFairblockNonceGetAll(t *testing.T) {
	keeper, ctx := keepertest.FairblockKeeper(t)
	items := createNFairblockNonce(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllFairblockNonce(ctx)),
	)
}
