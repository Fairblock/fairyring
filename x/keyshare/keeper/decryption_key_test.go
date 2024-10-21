package keeper_test

import (
	"strconv"
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNDecryptionKeys(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.DecryptionKey {
	items := make([]types.DecryptionKey, n)
	for i := range items {
		items[i].Height = uint64(i)

		keeper.SetDecryptionKey(ctx, items[i])
	}
	return items
}

func TestDecryptionKeyGet(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	items := createNDecryptionKeys(&keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetDecryptionKey(ctx,
			item.Height,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestDecryptionKeyRemove(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	items := createNDecryptionKeys(&keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveDecryptionKey(ctx,
			item.Height,
		)
		_, found := keeper.GetDecryptionKey(ctx,
			item.Height,
		)
		require.False(t, found)
	}
}

func TestDecryptionKeyGetAll(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	items := createNDecryptionKeys(&keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllDecryptionKeys(ctx)),
	)
}
