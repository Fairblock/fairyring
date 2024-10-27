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
	identity string,
) (val types.IdentityExecutionEntry, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxKeyPrefix))

	b := store.Get(types.GenEncTxQueueKey(
		identity,
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
	val types.IdentityExecutionEntry,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxKeyPrefix))

	entry := k.cdc.MustMarshal(&val)
	store.Set(
		types.GenEncTxQueueKey(val.Identity),
		entry,
	)
}

// RemoveEntry removes an entry from the store
func (k Keeper) RemoveEntry(
	ctx context.Context,
	identity string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(identity))
}

// GetAllGenEncTxEntry returns all GenEncTxQueue entries
func (k Keeper) GetAllGenEncTxEntry(ctx context.Context) (list []types.IdentityExecutionEntry) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.IdentityExecutionEntry
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}
	return
}

func (k Keeper) AppendTxToEntry(
	ctx context.Context,
	identity string,
	encTx types.GeneralEncryptedTx,
) uint64 {
	val, _ := k.GetEntry(ctx, identity)
	var index uint64 = 0
	var list types.GeneralEncryptedTxArray
	if val.TxList != nil {
		index = uint64(len(val.TxList.EncryptedTxs))
		list = *val.TxList
	}
	encTx.Index = index
	list.EncryptedTxs = append(list.EncryptedTxs, encTx)

	val.TxList = &list
	k.SetEntry(ctx, val)
	return uint64(index)
}

// GetRequestQueueEntry returns a queue entry by its identity
func (k Keeper) GetRequestQueueEntry(
	ctx context.Context,
	identity string,
) (val commontypes.RequestDecryptionKey, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxReqQueueKeyPrefix))

	b := store.Get(types.GenEncTxQueueKey(
		identity,
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
	val commontypes.RequestDecryptionKey,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxReqQueueKeyPrefix))

	entry := k.cdc.MustMarshal(&val)
	store.Set(
		types.GenEncTxQueueKey(val.GetIdentity()),
		entry,
	)
}

// RemoveQueueEntry removes an entry from the store
func (k Keeper) RemoveReqQueueEntry(
	ctx context.Context,
	identity string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxReqQueueKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(identity))
}

// GetAllGenEncTxQueueEntry returns all GenEncTxQueue entries
func (k Keeper) GetAllGenEncTxReqQueueEntry(
	ctx context.Context,
) (list []commontypes.RequestDecryptionKey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxReqQueueKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val commontypes.RequestDecryptionKey
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}
	return
}

// GetQueueEntry returns a queue entry by its identity
func (k Keeper) GetSignalQueueEntry(
	ctx context.Context,
	identity string,
) (val commontypes.GetDecryptionKey, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxSignalQueueKeyPrefix))

	b := store.Get(types.GenEncTxQueueKey(
		identity,
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
	val commontypes.GetDecryptionKey,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxSignalQueueKeyPrefix))

	entry := k.cdc.MustMarshal(&val)
	store.Set(
		types.GenEncTxQueueKey(val.GetIdentity()),
		entry,
	)
}

// RemoveQueueEntry removes an entry from the store
func (k Keeper) RemoveSignalQueueEntry(
	ctx context.Context,
	identity string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxSignalQueueKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(identity))
}

// GetAllGenEncTxQueueEntry returns all GenEncTxQueue entries
func (k Keeper) GetAllGenEncTxSignalQueueEntry(
	ctx context.Context,
) (list []commontypes.GetDecryptionKey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxSignalQueueKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val commontypes.GetDecryptionKey
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}
	return
}

// GetQueueEntry returns a queue entry by its identity
func (k Keeper) GetExecutionQueueEntry(
	ctx context.Context,
	identity string,
) (val types.IdentityExecutionEntry, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxExeQueueKeyPrefix))

	b := store.Get(types.GenEncTxQueueKey(
		identity,
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
	val types.IdentityExecutionEntry,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxExeQueueKeyPrefix))

	entry := k.cdc.MustMarshal(&val)
	store.Set(
		types.GenEncTxQueueKey(val.GetIdentity()),
		entry,
	)
}

// RemoveQueueEntry removes an entry from the store
func (k Keeper) RemoveExecutionQueueEntry(
	ctx context.Context,
	identity string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxExeQueueKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(identity))
}

// GetAllGenEncTxQueueEntry returns all GenEncTxQueue entries
func (k Keeper) GetAllGenEncTxExecutionQueueEntry(
	ctx context.Context,
) (list []types.IdentityExecutionEntry) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxExeQueueKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.IdentityExecutionEntry
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}
	return
}

// GetPrivateRequestQueueEntry returns a queue entry by its identity
func (k Keeper) GetPrivateRequestQueueEntry(
	ctx context.Context,
	identity string,
) (val commontypes.RequestPrivateDecryptionKey, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateRequestQueueKeyPrefix))

	b := store.Get(types.GenEncTxQueueKey(
		identity,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// SetPrivateReqQueueEntry sets a queue entry by its identity
func (k Keeper) SetPrivateReqQueueEntry(
	ctx context.Context,
	val commontypes.RequestPrivateDecryptionKey,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateRequestQueueKeyPrefix))

	entry := k.cdc.MustMarshal(&val)
	store.Set(
		types.GenEncTxQueueKey(val.GetIdentity()),
		entry,
	)
}

// RemovePrivateReqQueueEntry removes an entry from the store
func (k Keeper) RemovePrivateReqQueueEntry(
	ctx context.Context,
	identity string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateRequestQueueKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(identity))
}

// GetAllPrivateReqQueueEntry returns all PrivateQueue entries
func (k Keeper) GetAllPrivateReqQueueEntry(
	ctx context.Context) (list []commontypes.RequestPrivateDecryptionKey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateRequestQueueKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val commontypes.RequestPrivateDecryptionKey
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}
	return
}

// GetQueueEntry returns a queue entry by its identity
func (k Keeper) GetPrivateSignalQueueEntry(
	ctx context.Context,
	identity string,
) (val commontypes.GetPrivateDecryptionKey, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateSignalQueueKeyPrefix))

	b := store.Get(types.GenEncTxQueueKey(
		identity,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// SetPrivateSignalQueueEntry sets a queue entry by its identity
func (k Keeper) SetPrivateSignalQueueEntry(
	ctx context.Context,
	val commontypes.GetPrivateDecryptionKey,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateSignalQueueKeyPrefix))

	entry := k.cdc.MustMarshal(&val)
	store.Set(
		types.GenEncTxQueueKey(val.GetIdentity()),
		entry,
	)
}

// RemovePrivateSignalQueueEntry removes an entry from the store
func (k Keeper) RemovePrivateSignalQueueEntry(
	ctx context.Context,
	identity string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateSignalQueueKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(identity))
}

// GetAllPrivateSignalQueueEntry returns all GenEncTxQueue entries
func (k Keeper) GetAllPrivateSignalQueueEntry(
	ctx context.Context,
) (list []commontypes.GetPrivateDecryptionKey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateSignalQueueKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val commontypes.GetPrivateDecryptionKey
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}
	return
}
