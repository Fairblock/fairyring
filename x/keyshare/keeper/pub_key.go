package keeper

import (
	"cosmossdk.io/store/prefix"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	"context"
)

// SetActivePubKey set a specific public key to active in the store
func (k Keeper) SetActivePubKey(ctx context.Context, activePubKey types.ActivePubKey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	b := k.cdc.MustMarshal(&activePubKey)
	store.Set(types.KeyPrefix(types.ActivePubKeyPrefix), b)
}

// SetQueuedPubKey set a specific public key in the store
func (k Keeper) SetQueuedPubKey(ctx context.Context, queuedPubKey types.QueuedPubKey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	b := k.cdc.MustMarshal(&queuedPubKey)
	store.Set(types.KeyPrefix(types.QueuedPubKeyPrefix), b)
}

// GetActivePubKey returns the Active public key
func (k Keeper) GetActivePubKey(
	ctx context.Context,
) (val types.ActivePubKey, found bool) {
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
func (k Keeper) GetQueuedPubKey(
	ctx context.Context,
) (val types.QueuedPubKey, found bool) {
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
func (k Keeper) DeleteActivePubKey(ctx context.Context) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	store.Delete(types.KeyPrefix(types.ActivePubKeyPrefix))
}

// DeleteQueuedPubKey deletes the queued public key in the store
func (k Keeper) DeleteQueuedPubKey(ctx context.Context) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	store.Delete(types.KeyPrefix(types.QueuedPubKeyPrefix))
}
