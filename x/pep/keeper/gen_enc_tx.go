package keeper

import (
	"cosmossdk.io/store/prefix"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// GetEntry returns a queue entry by its identity
func (k Keeper) GetEntry(
	ctx sdk.Context,
	reqID string,
) (val types.GenEncTxExecutionQueue, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxKeyPrefix))

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
	ctx sdk.Context,
	val types.GenEncTxExecutionQueue,
) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxKeyPrefix))

	entry := k.cdc.MustMarshal(&val)
	store.Set(
		types.GenEncTxQueueKey(val.RequestId),
		entry,
	)
}

// RemoveEntry removes an entry from the store
func (k Keeper) RemoveEntry(
	ctx sdk.Context,
	reqID string,
) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(reqID))
}

// GetAllGenEncTxEntry returns all GenEncTxQueue entries
func (k Keeper) GetAllGenEncTxEntry(ctx sdk.Context) (list []types.GenEncTxExecutionQueue) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.GenEncTxExecutionQueue
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}
	return
}

func (k Keeper) AppendTxToEntry(ctx sdk.Context, reqID string, encTx types.GeneralEncryptedTx) uint64 {
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
	ctx sdk.Context,
	reqID string,
) (val commontypes.RequestAggrKeyshare, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxReqQueueKeyPrefix))

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
	ctx sdk.Context,
	val commontypes.RequestAggrKeyshare,
) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxReqQueueKeyPrefix))

	entry := k.cdc.MustMarshal(&val)
	store.Set(
		types.GenEncTxQueueKey(val.GetRequestId()),
		entry,
	)
}

// RemoveQueueEntry removes an entry from the store
func (k Keeper) RemoveReqQueueEntry(
	ctx sdk.Context,
	reqID string,
) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxReqQueueKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(reqID))
}

// GetAllGenEncTxQueueEntry returns all GenEncTxQueue entries
func (k Keeper) GetAllGenEncTxReqQueueEntry(ctx sdk.Context) (list []commontypes.RequestAggrKeyshare) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxReqQueueKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

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
	ctx sdk.Context,
	reqID string,
) (val commontypes.GetAggrKeyshare, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxSignalQueueKeyPrefix))

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
	ctx sdk.Context,
	val commontypes.GetAggrKeyshare,
) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxSignalQueueKeyPrefix))

	entry := k.cdc.MustMarshal(&val)
	store.Set(
		types.GenEncTxQueueKey(val.GetRequestId()),
		entry,
	)
}

// RemoveQueueEntry removes an entry from the store
func (k Keeper) RemoveSignalQueueEntry(
	ctx sdk.Context,
	reqID string,
) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxSignalQueueKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(reqID))
}

// GetAllGenEncTxQueueEntry returns all GenEncTxQueue entries
func (k Keeper) GetAllGenEncTxSignalQueueEntry(ctx sdk.Context) (list []commontypes.GetAggrKeyshare) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxSignalQueueKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

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
	ctx sdk.Context,
	reqID string,
) (val types.GenEncTxExecutionQueue, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxExeQueueKeyPrefix))

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
	ctx sdk.Context,
	val types.GenEncTxExecutionQueue,
) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxExeQueueKeyPrefix))

	entry := k.cdc.MustMarshal(&val)
	store.Set(
		types.GenEncTxQueueKey(val.RequestId),
		entry,
	)
}

// RemoveQueueEntry removes an entry from the store
func (k Keeper) RemoveExecutionQueueEntry(
	ctx sdk.Context,
	reqID string,
) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxExeQueueKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(reqID))
}

// GetAllGenEncTxQueueEntry returns all GenEncTxQueue entries
func (k Keeper) GetAllGenEncTxExecutionQueueEntry(ctx sdk.Context) (list []types.GenEncTxExecutionQueue) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxExeQueueKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.GenEncTxExecutionQueue
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}
	return
}
