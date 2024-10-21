package keeper

import (
	"encoding/binary"

	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	"cosmossdk.io/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetDecryptionKey set a specific decryption key in the store from its index
func (k Keeper) SetDecryptionKey(ctx sdk.Context, decryptionKey types.DecryptionKey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyKeyPrefix))

	b := k.cdc.MustMarshal(&decryptionKey)
	store.Set(types.DecryptionKeyKey(
		decryptionKey.Height,
	), b)
}

// GetDecryptionKey returns a decryption key from its index
func (k Keeper) GetDecryptionKey(
	ctx sdk.Context,
	height uint64,

) (val types.DecryptionKey, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyKeyPrefix))

	b := store.Get(types.DecryptionKeyKey(
		height,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveDecryptionKey removes a decryption key from the store
func (k Keeper) RemoveDecryptionKey(
	ctx sdk.Context,
	height uint64,

) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyKeyPrefix))

	store.Delete(types.DecryptionKeyKey(
		height,
	))
}

// GetAllDecryptionKeys returns all decryption keys
func (k Keeper) GetAllDecryptionKeys(ctx sdk.Context) (list []types.DecryptionKey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.DecryptionKey
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}

// SetDecryptionKeyLength set a specific length to decryption key length
func (k Keeper) SetDecryptionKeyLength(ctx sdk.Context, length uint64) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyLengthPrefix))
	lengthBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(lengthBytes, length)
	store.Set([]byte(types.DecryptionKeyLengthPrefix), lengthBytes)
}

// GetDecryptionKeyLength returns the length of decryption key
func (k Keeper) GetDecryptionKeyLength(
	ctx sdk.Context,
) uint64 {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyLengthPrefix))
	b := store.Get([]byte(types.DecryptionKeyLengthPrefix))
	if len(b) == 0 {
		return 0
	}
	return binary.BigEndian.Uint64(b)
}
