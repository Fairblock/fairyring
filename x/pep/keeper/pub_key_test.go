package keeper_test

import (
	"math/rand"
	"testing"

	"github.com/Fairblock/fairyring/testutil/random"

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
	keeper.SetActivePubkey(ctx, items)
	return items
}

func createQueuedPubKeys(keeper *keeper.Keeper, ctx sdk.Context) commontypes.QueuedPublicKey {
	var items commontypes.QueuedPublicKey
	items.PublicKey = random.RandHex(10)
	items.Expiry = rand.Uint64()
	keeper.SetQueuedPubkey(ctx, items)
	return items
}

func TestActivePubKeyGet(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	item := createActivePubKeys(&keeper, ctx)
	rst, found := keeper.GetActivePubkey(ctx)
	require.True(t, found)
	require.Equal(t,
		nullify.Fill(&item),
		nullify.Fill(&rst),
	)
}

func TestQueuedPubKeyGet(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	item := createQueuedPubKeys(&keeper, ctx)
	rst, found := keeper.GetQueuedPubkey(ctx)
	require.True(t, found)
	require.Equal(t,
		nullify.Fill(&item),
		nullify.Fill(&rst),
	)
}

func TestActivePubKeyRemoved(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	createActivePubKeys(&keeper, ctx)
	keeper.DeleteActivePubkey(ctx)
	_, found := keeper.GetActivePubkey(ctx)
	require.False(t, found)
}

func TestQueuedPubKeyRemoved(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	createQueuedPubKeys(&keeper, ctx)
	keeper.DeleteQueuedPubkey(ctx)
	_, found := keeper.GetQueuedPubkey(ctx)
	require.False(t, found)
}
