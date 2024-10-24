package keeper

import (
	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	"context"

	"cosmossdk.io/store/prefix"
)

// SetKeyshare set a specific keyShare in the store from its index
func (k Keeper) SetKeyshare(ctx context.Context, keyShare types.Keyshare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.KeyshareKeyPrefix))
	b := k.cdc.MustMarshal(&keyShare)
	store.Set(types.KeyshareKey(
		keyShare.Validator,
		keyShare.BlockHeight,
	), b)
}

// GetKeyshare returns a keyshare from its index
func (k Keeper) GetKeyshare(
	ctx context.Context,
	validator string,
	blockHeight uint64,

) (val types.Keyshare, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.KeyshareKeyPrefix))

	b := store.Get(types.KeyshareKey(
		validator,
		blockHeight,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveKeyshare removes a keyShare from the store
func (k Keeper) RemoveKeyshare(
	ctx context.Context,
	validator string,
	blockHeight uint64,

) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.KeyshareKeyPrefix))
	store.Delete(types.KeyshareKey(
		validator,
		blockHeight,
	))
}

// GetAllKeyshare returns all keyshares
func (k Keeper) GetAllKeyshare(ctx context.Context) (list []types.Keyshare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.KeyshareKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.Keyshare
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
