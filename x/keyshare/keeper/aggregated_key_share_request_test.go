package keeper_test

import (
	"fmt"
	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	"testing"
)

func createNKeyshareRequest(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.KeyShareRequest {
	items := make([]types.KeyShareRequest, n)
	for i := range items {
		items[i].RequestId = fmt.Sprintf("%d/rq", i)
		items[i].Identity = fmt.Sprintf("%d/rq", i)
		keeper.SetKeyShareRequest(ctx, items[i])
	}
	return items
}

func TestKeyShareRequestGet(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	items := createNKeyshareRequest(&keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetKeyShareRequest(ctx,
			item.Identity,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestKeyShareRequestRemove(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	items := createNKeyshareRequest(&keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveKeyShareRequest(ctx,
			item.Identity,
		)
		_, found := keeper.GetKeyShareRequest(ctx,
			item.Identity,
		)
		require.False(t, found)
	}
}

func TestKeyShareRequestGetAll(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	items := createNKeyshareRequest(&keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllKeyShareRequests(ctx)),
	)
}
