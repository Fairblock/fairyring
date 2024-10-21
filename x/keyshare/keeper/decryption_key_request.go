package keeper

import (
	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	"context"

	"cosmossdk.io/store/prefix"
)

// SetDecryptionKeyRequest set a specific decryption key request in the store by its index
func (k Keeper) SetDecryptionKeyRequest(ctx context.Context, decryptionKeyReq types.DecryptionKeyRequest) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyRequestKeyPrefix))
	key := []byte(decryptionKeyReq.Identity)
	b := k.cdc.MustMarshal(&decryptionKeyReq)
	store.Set(key, b)
}

// GetDecryptionKeyRequest returns a decryption key request from its index
func (k Keeper) GetDecryptionKeyRequest(
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

// RemoveDecryptionKeyRequest removes a decryption key request from the store
func (k Keeper) RemoveDecryptionKeyRequest(
	ctx context.Context,
	identity string,

) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyRequestKeyPrefix))
	store.Delete([]byte(identity))
}

// GetAllDecryptionKeyRequests returns all decryption key requests
func (k Keeper) GetAllDecryptionKeyRequests(ctx context.Context) (list []types.DecryptionKeyRequest) {
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

// SetPrivateDecryptionKeyRequest set a specific private
// decryption key request in the store by its index
func (k Keeper) SetPrivateDecryptionKeyRequest(
	ctx context.Context,
	privDecryptionKeyReq types.PrivateDecryptionKeyRequest,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateDecryptionKeyRequestKeyPrefix))
	key := []byte(privDecryptionKeyReq.Identity)
	b := k.cdc.MustMarshal(&privDecryptionKeyReq)
	store.Set(key, b)
}

// GetPrivateDecryptionKeyRequest returns a private decryption key request from its index
func (k Keeper) GetPrivateDecryptionKeyRequest(
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

// RemovePrivateDecryptionKeyRequest removes a private decryption key request from the store
func (k Keeper) RemovePrivateDecryptionKeyRequest(
	ctx context.Context,
	identity string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateDecryptionKeyRequestKeyPrefix))
	store.Delete([]byte(identity))
}

// GetAllPrivateDecryptionKeyRequests returns all private keyShare requests
func (k Keeper) GetAllPrivateDecryptionKeyRequests(
	ctx context.Context,
) (list []types.PrivateDecryptionKeyRequest) {
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
