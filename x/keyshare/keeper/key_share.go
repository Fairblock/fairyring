package keeper

import (
	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	"context"
	"cosmossdk.io/store/prefix"
)

// SetKeyShare set a specific keyShare in the store from its index
func (k Keeper) SetKeyShare(ctx context.Context, keyShare types.KeyShare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.KeyShareKeyPrefix))
	b := k.cdc.MustMarshal(&keyShare)
	store.Set(types.KeyShareKey(
		keyShare.Validator,
		keyShare.BlockHeight,
	), b)
}

// GetKeyShare returns a keyShare from its index
func (k Keeper) GetKeyShare(
	ctx context.Context,
	validator string,
	blockHeight uint64,

) (val types.KeyShare, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.KeyShareKeyPrefix))

	b := store.Get(types.KeyShareKey(
		validator,
		blockHeight,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveKeyShare removes a keyShare from the store
func (k Keeper) RemoveKeyShare(
	ctx context.Context,
	validator string,
	blockHeight uint64,

) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.KeyShareKeyPrefix))
	store.Delete(types.KeyShareKey(
		validator,
		blockHeight,
	))
}

// GetAllKeyShare returns all keyShare
func (k Keeper) GetAllKeyShare(ctx context.Context) (list []types.KeyShare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.KeyShareKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.KeyShare
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
