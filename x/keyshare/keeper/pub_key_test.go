package keeper_test

import (
	"math/rand"
	"testing"

	"github.com/Fairblock/fairyring/testutil/random"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

func createActivePubkeys(keeper *keeper.Keeper, ctx sdk.Context) types.ActivePubkey {
	var items types.ActivePubkey
	items.PublicKey = random.RandHex(10)
	items.Expiry = rand.Uint64()
	items.NumberOfValidators = rand.Uint64()
	keeper.SetActivePubkey(ctx, items)
	return items
}

func createQueuedPubkeys(keeper *keeper.Keeper, ctx sdk.Context) types.QueuedPubkey {
	var items types.QueuedPubkey
	items.PublicKey = random.RandHex(10)
	items.Expiry = rand.Uint64()
	items.NumberOfValidators = rand.Uint64()
	keeper.SetQueuedPubkey(ctx, items)
	return items
}

func TestActivePubkeyGet(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	item := createActivePubkeys(&keeper, ctx)
	rst, found := keeper.GetActivePubkey(ctx)
	require.True(t, found)
	require.Equal(t,
		nullify.Fill(&item),
		nullify.Fill(&rst),
	)
}

func TestQueuedPubkeyGet(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	item := createQueuedPubkeys(&keeper, ctx)
	rst, found := keeper.GetQueuedPubkey(ctx)
	require.True(t, found)
	require.Equal(t,
		nullify.Fill(&item),
		nullify.Fill(&rst),
	)
}

func TestActivePubkeyRemoved(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	createActivePubkeys(&keeper, ctx)
	keeper.DeleteActivePubkey(ctx)
	_, found := keeper.GetActivePubkey(ctx)
	require.False(t, found)
}

func TestQueuedPubkeyRemoved(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	createQueuedPubkeys(&keeper, ctx)
	keeper.DeleteQueuedPubkey(ctx)
	_, found := keeper.GetQueuedPubkey(ctx)
	require.False(t, found)
}
