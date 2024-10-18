package keeper

import (
	"cosmossdk.io/store/prefix"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	"context"
)

// SetActivePubkey set a specific public key to active in the store
func (k Keeper) SetActivePubkey(ctx context.Context, activePubkey types.ActivePubkey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	b := k.cdc.MustMarshal(&activePubkey)
	store.Set(types.KeyPrefix(types.ActivePubkeyPrefix), b)
}

// SetQueuedPubkey set a specific public key in the store
func (k Keeper) SetQueuedPubkey(ctx context.Context, queuedPubkey types.QueuedPubkey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	b := k.cdc.MustMarshal(&queuedPubkey)
	store.Set(types.KeyPrefix(types.QueuedPubkeyPrefix), b)
}

// GetActivePubkey returns the Active public key
func (k Keeper) GetActivePubkey(
	ctx context.Context,
) (val types.ActivePubkey, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})

	b := store.Get(types.KeyPrefix(types.ActivePubkeyPrefix))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)

	return val, true
}

// GetQueuedPubkey returns the Queued public key
func (k Keeper) GetQueuedPubkey(
	ctx context.Context,
) (val types.QueuedPubkey, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})

	b := store.Get(types.KeyPrefix(types.QueuedPubkeyPrefix))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)

	return val, true
}

// DeleteActivePubkey deletes the active public key in the store
func (k Keeper) DeleteActivePubkey(ctx context.Context) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	store.Delete(types.KeyPrefix(types.ActivePubkeyPrefix))
}

// DeleteQueuedPubkey deletes the queued public key in the store
func (k Keeper) DeleteQueuedPubkey(ctx context.Context) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	store.Delete(types.KeyPrefix(types.QueuedPubkeyPrefix))
}
