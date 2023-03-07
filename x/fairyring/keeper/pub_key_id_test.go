package keeper_test

import (
	"strconv"
	"testing"

	keepertest "fairyring/testutil/keeper"
	"fairyring/testutil/nullify"
	"fairyring/x/fairyring/keeper"
	"fairyring/x/fairyring/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNPubKeyID(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.PubKeyID {
	items := make([]types.PubKeyID, n)
	for i := range items {
		items[i].Height = uint64(i)

		keeper.SetPubKeyID(ctx, items[i])
	}
	return items
}

func TestPubKeyIDGet(t *testing.T) {
	keeper, ctx := keepertest.FairyringKeeper(t)
	items := createNPubKeyID(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetPubKeyID(ctx,
			item.Height,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestPubKeyIDRemove(t *testing.T) {
	keeper, ctx := keepertest.FairyringKeeper(t)
	items := createNPubKeyID(keeper, ctx, 10)
	for _, item := range items {
		keeper.RemovePubKeyID(ctx,
			item.Height,
		)
		_, found := keeper.GetPubKeyID(ctx,
			item.Height,
		)
		require.False(t, found)
	}
}

func TestPubKeyIDGetAll(t *testing.T) {
	keeper, ctx := keepertest.FairyringKeeper(t)
	items := createNPubKeyID(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllPubKeyID(ctx)),
	)
}
