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

func createNEncryptedTx(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.EncryptedTx {
	items := make([]types.EncryptedTx, n)
	for i := range items {
		items[i].TargetHeight = uint64(i)
		items[i].Index = uint64(i)

		keeper.SetEncryptedTx(ctx, items[i])
	}
	return items
}

func TestEncryptedTxGet(t *testing.T) {
	keeper, ctx := keepertest.FairblockKeeper(t)
	items := createNEncryptedTx(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetEncryptedTx(ctx,
			item.TargetHeight,
			item.Index,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestEncryptedTxRemove(t *testing.T) {
	keeper, ctx := keepertest.FairblockKeeper(t)
	items := createNEncryptedTx(keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveEncryptedTx(ctx,
			item.TargetHeight,
			item.Index,
		)
		_, found := keeper.GetEncryptedTx(ctx,
			item.TargetHeight,
			item.Index,
		)
		require.False(t, found)
	}
}

func TestEncryptedTxGetAll(t *testing.T) {
	keeper, ctx := keepertest.FairblockKeeper(t)
	items := createNEncryptedTx(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllEncryptedTx(ctx)),
	)
}
