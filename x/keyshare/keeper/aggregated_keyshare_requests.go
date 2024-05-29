package keeper

import (
	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	"cosmossdk.io/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetKeyShareRequest set a specific keyShare request in the store by its index
func (k Keeper) SetKeyShareRequest(ctx sdk.Context, KeyShareRequest types.KeyShareRequest) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.KeyShareRequestKeyPrefix))
	key := []byte(KeyShareRequest.Identity)
	b := k.cdc.MustMarshal(&KeyShareRequest)
	store.Set(key, b)
}

// GetKeyShareRequest returns a keyShare request from its index
func (k Keeper) GetKeyShareRequest(
	ctx sdk.Context,
	identity string,

) (val types.KeyShareRequest, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.KeyShareRequestKeyPrefix))

	b := store.Get([]byte(identity))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveKeyShareRequest removes a keyShare request from the store
func (k Keeper) RemoveKeyShareRequest(
	ctx sdk.Context,
	identity string,

) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.KeyShareRequestKeyPrefix))
	store.Delete([]byte(identity))
}

// GetAllKeyShareRequests returns all keyShare requests
func (k Keeper) GetAllKeyShareRequests(ctx sdk.Context) (list []types.KeyShareRequest) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.KeyShareRequestKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.KeyShareRequest
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
