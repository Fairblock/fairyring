package keeper_test

import (
	"github.com/Fairblock/fairyring/testutil/random"
	"math/rand"
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/Fairblock/fairyring/x/pep/keeper"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

func createActivePubKeys(keeper *keeper.Keeper, ctx sdk.Context) commontypes.ActivePublicKey {
	var items commontypes.ActivePublicKey
	items.PublicKey = random.RandHex(10)
	items.Expiry = rand.Uint64()
	keeper.SetActivePubKey(ctx, items)
	return items
}

func createQueuedPubKeys(keeper *keeper.Keeper, ctx sdk.Context) commontypes.QueuedPublicKey {
	var items commontypes.QueuedPublicKey
	items.PublicKey = random.RandHex(10)
	items.Expiry = rand.Uint64()
	keeper.SetQueuedPubKey(ctx, items)
	return items
}

func TestActivePubKeyGet(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	item := createActivePubKeys(&keeper, ctx)
	rst, found := keeper.GetActivePubKey(ctx)
	require.True(t, found)
	require.Equal(t,
		nullify.Fill(&item),
		nullify.Fill(&rst),
	)
}

func TestQueuedPubKeyGet(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	item := createQueuedPubKeys(&keeper, ctx)
	rst, found := keeper.GetQueuedPubKey(ctx)
	require.True(t, found)
	require.Equal(t,
		nullify.Fill(&item),
		nullify.Fill(&rst),
	)
}

func TestActivePubKeyRemoved(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	createActivePubKeys(&keeper, ctx)
	keeper.DeleteActivePubKey(ctx)
	_, found := keeper.GetActivePubKey(ctx)
	require.False(t, found)
}

func TestQueuedPubKeyRemoved(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	createQueuedPubKeys(&keeper, ctx)
	keeper.DeleteQueuedPubKey(ctx)
	_, found := keeper.GetQueuedPubKey(ctx)
	require.False(t, found)
}
