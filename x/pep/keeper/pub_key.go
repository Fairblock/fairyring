package keeper

import (
	"context"

	"cosmossdk.io/store/prefix"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/runtime"
)

// SetActivePubKey set a specific public key to active in the store
func (k Keeper) SetActivePubkey(ctx context.Context, activePubKey commontypes.ActivePublicKey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	b := k.cdc.MustMarshal(&activePubKey)
	store.Set(types.KeyPrefix(types.ActivePubKeyPrefix), b)
}

// SetQueuedPubKey set a specific public key in the store
func (k Keeper) SetQueuedPubkey(ctx context.Context, queuedPubKey commontypes.QueuedPublicKey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	b := k.cdc.MustMarshal(&queuedPubKey)
	store.Set(types.KeyPrefix(types.QueuedPubKeyPrefix), b)
}

// GetActivePubKey returns the Active public key
func (k Keeper) GetActivePubkey(
	ctx context.Context,
) (val commontypes.ActivePublicKey, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})

	b := store.Get(types.KeyPrefix(types.ActivePubKeyPrefix))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)

	return val, true
}

// GetQueuedPubKey returns the Queued public key
func (k Keeper) GetQueuedPubkey(
	ctx context.Context,
) (val commontypes.QueuedPublicKey, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})

	b := store.Get(types.KeyPrefix(types.QueuedPubKeyPrefix))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)

	return val, true
}

// DeleteActivePubKey deletes the active public key in the store
func (k Keeper) DeleteActivePubkey(ctx context.Context) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	store.Delete(types.KeyPrefix(types.ActivePubKeyPrefix))
}

// DeleteQueuedPubKey deletes the queued public key in the store
func (k Keeper) DeleteQueuedPubkey(ctx context.Context) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	store.Delete(types.KeyPrefix(types.QueuedPubKeyPrefix))
}
