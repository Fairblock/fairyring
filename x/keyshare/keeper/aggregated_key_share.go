package keeper

import (
	"encoding/binary"

	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	"cosmossdk.io/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetAggregatedKeyShare set a specific aggregatedKeyShare in the store from its index
func (k Keeper) SetAggregatedKeyShare(ctx sdk.Context, aggregatedKeyShare types.DecryptionKey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AggregatedKeyShareKeyPrefix))

	b := k.cdc.MustMarshal(&aggregatedKeyShare)
	store.Set(types.AggregatedKeyShareKey(
		aggregatedKeyShare.Height,
	), b)
}

// GetAggregatedKeyShare returns a aggregatedKeyShare from its index
func (k Keeper) GetAggregatedKeyShare(
	ctx sdk.Context,
	height uint64,

) (val types.DecryptionKey, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AggregatedKeyShareKeyPrefix))

	b := store.Get(types.AggregatedKeyShareKey(
		height,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveAggregatedKeyShare removes a aggregatedKeyShare from the store
func (k Keeper) RemoveAggregatedKeyShare(
	ctx sdk.Context,
	height uint64,

) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AggregatedKeyShareKeyPrefix))

	store.Delete(types.AggregatedKeyShareKey(
		height,
	))
}

// GetAllAggregatedKeyShare returns all aggregatedKeyShare
func (k Keeper) GetAllAggregatedKeyShare(ctx sdk.Context) (list []types.DecryptionKey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AggregatedKeyShareKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.DecryptionKey
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}

// SetAggregatedKeyShareLength set a specific length to aggregatedKeyShareLength
func (k Keeper) SetAggregatedKeyShareLength(ctx sdk.Context, length uint64) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AggregatedKeyShareLengthPrefix))
	lengthBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(lengthBytes, length)
	store.Set([]byte(types.AggregatedKeyShareLengthPrefix), lengthBytes)
}

// GetAggregatedKeyShareLength returns the length of aggregatedKeyShare
func (k Keeper) GetAggregatedKeyShareLength(
	ctx sdk.Context,
) uint64 {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AggregatedKeyShareLengthPrefix))
	b := store.Get([]byte(types.AggregatedKeyShareLengthPrefix))
	if len(b) == 0 {
		return 0
	}
	return binary.BigEndian.Uint64(b)
}
