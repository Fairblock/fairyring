package keeper_test

import (
	"fmt"
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

func createNDecryptionKeyRequests(
	keeper *keeper.Keeper,
	ctx sdk.Context,
	n int,
) []types.DecryptionKeyRequest {
	items := make([]types.DecryptionKeyRequest, n)
	for i := range items {
		items[i].RequestId = fmt.Sprintf("%d/rq", i)
		items[i].Identity = fmt.Sprintf("%d/rq", i)
		keeper.SetDecryptionKeyRequest(ctx, items[i])
	}
	return items
}

func TestDecryptionKeyRequestGet(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	items := createNDecryptionKeyRequests(&keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetDecryptionKeyRequest(ctx,
			item.Identity,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestDecryptionKeyRequestRemove(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	items := createNDecryptionKeyRequests(&keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveDecryptionKeyRequest(ctx,
			item.Identity,
		)
		_, found := keeper.GetDecryptionKeyRequest(ctx,
			item.Identity,
		)
		require.False(t, found)
	}
}

func TestDecryptionKeyRequestGetAll(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	items := createNDecryptionKeyRequests(&keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllDecryptionKeyRequests(ctx)),
	)
}
