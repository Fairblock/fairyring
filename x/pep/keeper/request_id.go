package keeper

import (
	"context"

	"cosmossdk.io/store/prefix"
	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/runtime"
)

// SetRequestId set a specific requestId in the store from its index
func (k Keeper) SetRequestId(ctx context.Context, requestId types.RequestId) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.RequestIdKeyPrefix))
	b := k.cdc.MustMarshal(&requestId)
	store.Set(types.RequestIdKey(
		requestId.Creator,
		requestId.ReqId,
	), b)
}

// GetRequestId returns a requestId from its index
func (k Keeper) GetRequestId(
	ctx context.Context,
	creator string,
	reqID string,
) (val types.RequestId, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.RequestIdKeyPrefix))

	b := store.Get(types.RequestIdKey(
		creator,
		reqID,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// GetAllRequestId returns all requestId
func (k Keeper) GetAllRequestId(ctx context.Context) (list []types.RequestId) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.RequestIdKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.RequestId
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
