package keeper_test

import (
	"github.com/Fairblock/fairyring/testutil/random"
	"math/rand"
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

func createActivePubKeys(keeper *keeper.Keeper, ctx sdk.Context) types.ActivePubKey {
	var items types.ActivePubKey
	items.PublicKey = random.RandHex(10)
	items.Expiry = rand.Uint64()
	items.NumberOfValidators = rand.Uint64()
	keeper.SetActivePubKey(ctx, items)
	return items
}

func createQueuedPubKeys(keeper *keeper.Keeper, ctx sdk.Context) types.QueuedPubKey {
	var items types.QueuedPubKey
	items.PublicKey = random.RandHex(10)
	items.Expiry = rand.Uint64()
	items.NumberOfValidators = rand.Uint64()
	keeper.SetQueuedPubKey(ctx, items)
	return items
}

func TestActivePubKeyGet(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	item := createActivePubKeys(&keeper, ctx)
	rst, found := keeper.GetActivePubKey(ctx)
	require.True(t, found)
	require.Equal(t,
		nullify.Fill(&item),
		nullify.Fill(&rst),
	)
}

func TestQueuedPubKeyGet(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	item := createQueuedPubKeys(&keeper, ctx)
	rst, found := keeper.GetQueuedPubKey(ctx)
	require.True(t, found)
	require.Equal(t,
		nullify.Fill(&item),
		nullify.Fill(&rst),
	)
}

func TestActivePubKeyRemoved(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	createActivePubKeys(&keeper, ctx)
	keeper.DeleteActivePubKey(ctx)
	_, found := keeper.GetActivePubKey(ctx)
	require.False(t, found)
}

func TestQueuedPubKeyRemoved(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	createQueuedPubKeys(&keeper, ctx)
	keeper.DeleteQueuedPubKey(ctx)
	_, found := keeper.GetQueuedPubKey(ctx)
	require.False(t, found)
}
