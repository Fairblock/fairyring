package keeper

import (
	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	"context"

	"cosmossdk.io/store/prefix"
)

// SetKeyShareRequest set a specific keyShare request in the store by its index
func (k Keeper) SetKeyShareRequest(ctx context.Context, KeyShareRequest types.DecryptionKeyRequest) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyRequestKeyPrefix))
	key := []byte(KeyShareRequest.Identity)
	b := k.cdc.MustMarshal(&KeyShareRequest)
	store.Set(key, b)
}

// GetKeyShareRequest returns a keyShare request from its index
func (k Keeper) GetKeyShareRequest(
	ctx context.Context,
	identity string,

) (val types.DecryptionKeyRequest, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyRequestKeyPrefix))

	b := store.Get([]byte(identity))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveKeyShareRequest removes a keyShare request from the store
func (k Keeper) RemoveKeyShareRequest(
	ctx context.Context,
	identity string,

) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyRequestKeyPrefix))
	store.Delete([]byte(identity))
}

// GetAllKeyShareRequests returns all keyShare requests
func (k Keeper) GetAllKeyShareRequests(ctx context.Context) (list []types.DecryptionKeyRequest) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyRequestKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.DecryptionKeyRequest
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}

// SetPrivateKeyShareRequest set a specific private keyShare request in the store by its index
func (k Keeper) SetPrivateKeyShareRequest(ctx context.Context, KeyShareRequest types.PrivateDecryptionKeyRequest) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateDecryptionKeyRequestKeyPrefix))
	key := []byte(KeyShareRequest.Identity)
	b := k.cdc.MustMarshal(&KeyShareRequest)
	store.Set(key, b)
}

// GetPrivateKeyShareRequest returns a private keyShare request from its index
func (k Keeper) GetPrivateKeyShareRequest(
	ctx context.Context,
	identity string,
) (val types.PrivateDecryptionKeyRequest, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateDecryptionKeyRequestKeyPrefix))

	b := store.Get([]byte(identity))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemovePrivateKeyShareRequest removes a private keyShare request from the store
func (k Keeper) RemovePrivateKeyShareRequest(
	ctx context.Context,
	identity string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateDecryptionKeyRequestKeyPrefix))
	store.Delete([]byte(identity))
}

// GetAllPrivateKeyShareRequests returns all private keyShare requests
func (k Keeper) GetAllPrivateKeyShareRequests(ctx context.Context) (list []types.PrivateDecryptionKeyRequest) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateDecryptionKeyRequestKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.PrivateDecryptionKeyRequest
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
