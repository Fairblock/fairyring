package keeper_test

import (
	"strconv"
	"testing"

	"github.com/Fairblock/fairyring/testutil/random"
	"github.com/Fairblock/fairyring/testutil/sample"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNAggregatedKeyShare(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.DecryptionKey {
	items := make([]types.DecryptionKey, n)
	for i := range items {
		items[i].Height = uint64(i)
		items[i].Data = random.RandHex(32)
		items[i].Creator = sample.AccAddress()

		keeper.SetDecryptionKey(ctx, items[i])
	}
	return items
}

func TestAggregatedKeyShareGet(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNAggregatedKeyShare(&keeper, ctx, 10)
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
func TestAggregatedKeyShareRemove(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNAggregatedKeyShare(&keeper, ctx, 10)
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

func TestAggregatedKeyShareGetAll(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNAggregatedKeyShare(&keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllDecryptionKeys(ctx)),
	)
}
