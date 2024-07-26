package keeper

import (
	"context"
	"cosmossdk.io/store/prefix"
	storetypes "cosmossdk.io/store/types"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/runtime"
)

// GetEntry returns a queue entry by its identity
func (k Keeper) GetEntry(
	ctx context.Context,
	reqID string,
) (val types.GenEncTxExecutionQueue, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxKeyPrefix))

	b := store.Get(types.GenEncTxQueueKey(
		reqID,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// SetEntry sets a queue entry by its identity
func (k Keeper) SetEntry(
	ctx context.Context,
	val types.GenEncTxExecutionQueue,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxKeyPrefix))

	entry := k.cdc.MustMarshal(&val)
	store.Set(
		types.GenEncTxQueueKey(val.RequestId),
		entry,
	)
}

// RemoveEntry removes an entry from the store
func (k Keeper) RemoveEntry(
	ctx context.Context,
	reqID string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(reqID))
}

// GetAllGenEncTxEntry returns all GenEncTxQueue entries
func (k Keeper) GetAllGenEncTxEntry(ctx context.Context) (list []types.GenEncTxExecutionQueue) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.GenEncTxExecutionQueue
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}
	return
}

func (k Keeper) AppendTxToEntry(ctx context.Context, reqID string, encTx types.GeneralEncryptedTx) uint64 {
	val, _ := k.GetEntry(ctx, reqID)
	var index uint64 = 0
	var list types.GeneralEncryptedTxArray
	if val.TxList != nil {
		index = uint64(len(val.TxList.EncryptedTx))
		list = *val.TxList
	}
	encTx.Index = index
	list.EncryptedTx = append(list.EncryptedTx, encTx)

	val.TxList = &list
	k.SetEntry(ctx, val)
	return uint64(index)
}

// GetRequestQueueEntry returns a queue entry by its identity
func (k Keeper) GetRequestQueueEntry(
	ctx context.Context,
	reqID string,
) (val commontypes.RequestAggrKeyshare, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxReqQueueKeyPrefix))

	b := store.Get(types.GenEncTxQueueKey(
		reqID,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// SetQueueEntry sets a queue entry by its identity
func (k Keeper) SetReqQueueEntry(
	ctx context.Context,
	val commontypes.RequestAggrKeyshare,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxReqQueueKeyPrefix))

	entry := k.cdc.MustMarshal(&val)
	store.Set(
		types.GenEncTxQueueKey(val.GetRequestId()),
		entry,
	)
}

// RemoveQueueEntry removes an entry from the store
func (k Keeper) RemoveReqQueueEntry(
	ctx context.Context,
	reqID string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxReqQueueKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(reqID))
}

// GetAllGenEncTxQueueEntry returns all GenEncTxQueue entries
func (k Keeper) GetAllGenEncTxReqQueueEntry(ctx context.Context) (list []commontypes.RequestAggrKeyshare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxReqQueueKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val commontypes.RequestAggrKeyshare
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}
	return
}

// GetQueueEntry returns a queue entry by its identity
func (k Keeper) GetSignalQueueEntry(
	ctx context.Context,
	reqID string,
) (val commontypes.GetAggrKeyshare, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxSignalQueueKeyPrefix))

	b := store.Get(types.GenEncTxQueueKey(
		reqID,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// SetQueueEntry sets a queue entry by its identity
func (k Keeper) SetSignalQueueEntry(
	ctx context.Context,
	val commontypes.GetAggrKeyshare,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxSignalQueueKeyPrefix))

	entry := k.cdc.MustMarshal(&val)
	store.Set(
		types.GenEncTxQueueKey(val.GetRequestId()),
		entry,
	)
}

// RemoveQueueEntry removes an entry from the store
func (k Keeper) RemoveSignalQueueEntry(
	ctx context.Context,
	reqID string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxSignalQueueKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(reqID))
}

// GetAllGenEncTxQueueEntry returns all GenEncTxQueue entries
func (k Keeper) GetAllGenEncTxSignalQueueEntry(ctx context.Context) (list []commontypes.GetAggrKeyshare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxSignalQueueKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val commontypes.GetAggrKeyshare
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}
	return
}

// GetQueueEntry returns a queue entry by its identity
func (k Keeper) GetExecutionQueueEntry(
	ctx context.Context,
	reqID string,
) (val types.GenEncTxExecutionQueue, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxExeQueueKeyPrefix))

	b := store.Get(types.GenEncTxQueueKey(
		reqID,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// SetQueueEntry sets a queue entry by its identity
func (k Keeper) SetExecutionQueueEntry(
	ctx context.Context,
	val types.GenEncTxExecutionQueue,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxExeQueueKeyPrefix))

	entry := k.cdc.MustMarshal(&val)
	store.Set(
		types.GenEncTxQueueKey(val.RequestId),
		entry,
	)
}

// RemoveQueueEntry removes an entry from the store
func (k Keeper) RemoveExecutionQueueEntry(
	ctx context.Context,
	reqID string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxExeQueueKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(reqID))
}

// GetAllGenEncTxQueueEntry returns all GenEncTxQueue entries
func (k Keeper) GetAllGenEncTxExecutionQueueEntry(ctx context.Context) (list []types.GenEncTxExecutionQueue) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxExeQueueKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.GenEncTxExecutionQueue
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}
	return
}
