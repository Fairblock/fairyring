package keeper

import (
	"context"
	"sort"

	"cosmossdk.io/store/prefix"
	storetypes "cosmossdk.io/store/types"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/runtime"
)

func (k Keeper) genEncTxStore(ctx context.Context) storetypes.KVStore {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	return prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxKeyPrefix))
}

func (k Keeper) getGeneralEncryptedTxCount(ctx context.Context, identity string) uint64 {
	store := k.genEncTxStore(ctx)
	return bytesToUint64(store.Get(types.GenEncTxCountKey(identity)))
}

func (k Keeper) setGeneralEncryptedTxCount(ctx context.Context, identity string, count uint64) {
	store := k.genEncTxStore(ctx)
	store.Set(types.GenEncTxCountKey(identity), uint64ToBytes(count))
}

func (k Keeper) setGeneralEncryptedTx(ctx context.Context, identity string, tx types.GeneralEncryptedTx) {
	store := k.genEncTxStore(ctx)
	store.Set(types.GenEncTxTxKey(identity, tx.Index), k.cdc.MustMarshal(&tx))
}

func (k Keeper) getGeneralEncryptedTxsByIdentity(
	ctx context.Context,
	identity string,
) []types.GeneralEncryptedTx {
	store := k.genEncTxStore(ctx)
	iterator := storetypes.KVStorePrefixIterator(store, types.GenEncTxTxPrefix(identity))
	defer iterator.Close()

	txs := make([]types.GeneralEncryptedTx, 0)
	for ; iterator.Valid(); iterator.Next() {
		var tx types.GeneralEncryptedTx
		k.cdc.MustUnmarshal(iterator.Value(), &tx)
		txs = append(txs, tx)
	}

	sort.Slice(txs, func(i, j int) bool {
		return txs[i].Index < txs[j].Index
	})

	return txs
}

func (k Keeper) removeGeneralEncryptedTxsByIdentity(ctx context.Context, identity string) {
	store := k.genEncTxStore(ctx)
	iterator := storetypes.KVStorePrefixIterator(store, types.GenEncTxTxPrefix(identity))
	defer iterator.Close()

	keys := make([][]byte, 0)
	for ; iterator.Valid(); iterator.Next() {
		key := make([]byte, len(iterator.Key()))
		copy(key, iterator.Key())
		keys = append(keys, key)
	}
	for _, key := range keys {
		store.Delete(key)
	}
	store.Delete(types.GenEncTxCountKey(identity))
}

func identityEntryWithoutTxList(entry types.IdentityExecutionEntry) types.IdentityExecutionEntry {
	entry.TxList = nil
	return entry
}

func identityEntryWithTxList(entry types.IdentityExecutionEntry, txs []types.GeneralEncryptedTx) types.IdentityExecutionEntry {
	if len(txs) == 0 {
		entry.TxList = nil
		return entry
	}
	entry.TxList = &types.GeneralEncryptedTxArray{EncryptedTxs: txs}
	return entry
}

func (k Keeper) setEntryMetadata(ctx context.Context, val types.IdentityExecutionEntry) {
	store := k.genEncTxStore(ctx)
	entry := identityEntryWithoutTxList(val)
	store.Set(types.GenEncTxEntryKey(entry.Identity), k.cdc.MustMarshal(&entry))
}

// migrateLegacyGeneralEncryptedTxEntry moves the old one-entry-per-identity
// layout into the new per-identity/per-index tx layout.
//
// The legacy layout stored the full IdentityExecutionEntry, including TxList,
// under one key. That forced every SubmitGeneralEncryptedTx to rewrite the
// entire TxList and made gas grow with the number of encrypted txs in the same
// identity. The new layout keeps identity metadata small and stores each
// accepted encrypted tx under its own deterministic identity/index key.
func (k Keeper) migrateLegacyGeneralEncryptedTxEntry(ctx context.Context, identity string) {
	store := k.genEncTxStore(ctx)
	legacyKey := types.GenEncTxQueueKey(identity)
	b := store.Get(legacyKey)
	if b == nil {
		return
	}

	var entry types.IdentityExecutionEntry
	if err := k.cdc.Unmarshal(b, &entry); err != nil {
		return
	}
	if entry.Identity == "" {
		entry.Identity = identity
	}

	if entry.TxList != nil {
		for i := range entry.TxList.EncryptedTxs {
			tx := entry.TxList.EncryptedTxs[i]
			tx.Identity = entry.Identity
			tx.Index = uint64(i)
			k.setGeneralEncryptedTx(ctx, entry.Identity, tx)
		}
		if uint64(len(entry.TxList.EncryptedTxs)) > k.getGeneralEncryptedTxCount(ctx, entry.Identity) {
			k.setGeneralEncryptedTxCount(ctx, entry.Identity, uint64(len(entry.TxList.EncryptedTxs)))
		}
	}

	k.setEntryMetadata(ctx, entry)
	store.Delete(legacyKey)
}

// GetEntry returns identity metadata by identity. It intentionally does not
// hydrate TxList because hot paths such as keyshare aggregation only need the
// metadata/decryption-key fields. Use GetEntryWithTxList for queries/tests that
// need the encrypted tx list.
func (k Keeper) GetEntry(
	ctx context.Context,
	identity string,
) (val types.IdentityExecutionEntry, found bool) {
	k.migrateLegacyGeneralEncryptedTxEntry(ctx, identity)
	store := k.genEncTxStore(ctx)

	b := store.Get(types.GenEncTxEntryKey(identity))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	val.TxList = nil
	return val, true
}

// GetEntryWithTxList returns an identity entry with its encrypted txs hydrated
// from the per-identity/per-index tx store in accepted index order.
func (k Keeper) GetEntryWithTxList(
	ctx context.Context,
	identity string,
) (val types.IdentityExecutionEntry, found bool) {
	val, found = k.GetEntry(ctx, identity)
	if !found {
		return val, false
	}
	return identityEntryWithTxList(val, k.getGeneralEncryptedTxsByIdentity(ctx, identity)), true
}

// SetEntry sets an identity entry. If TxList is supplied, it is rewritten into
// per-tx keys; the entry metadata itself is stored without TxList to avoid
// future full-entry rewrites.
func (k Keeper) SetEntry(
	ctx context.Context,
	val types.IdentityExecutionEntry,
) {
	if val.Identity == "" {
		return
	}

	store := k.genEncTxStore(ctx)
	if val.TxList != nil {
		k.removeGeneralEncryptedTxsByIdentity(ctx, val.Identity)
		for i := range val.TxList.EncryptedTxs {
			tx := val.TxList.EncryptedTxs[i]
			tx.Identity = val.Identity
			tx.Index = uint64(i)
			k.setGeneralEncryptedTx(ctx, val.Identity, tx)
		}
		k.setGeneralEncryptedTxCount(ctx, val.Identity, uint64(len(val.TxList.EncryptedTxs)))
	}

	k.setEntryMetadata(ctx, val)
	store.Delete(types.GenEncTxQueueKey(val.Identity))
}

// RemoveEntry removes an identity entry and all encrypted txs stored under it.
func (k Keeper) RemoveEntry(
	ctx context.Context,
	identity string,
) {
	store := k.genEncTxStore(ctx)
	store.Delete(types.GenEncTxEntryKey(identity))
	store.Delete(types.GenEncTxQueueKey(identity))
	k.removeGeneralEncryptedTxsByIdentity(ctx, identity)
}

// GetAllGenEncTxEntry returns all GenEncTxQueue entries with tx lists hydrated.
func (k Keeper) GetAllGenEncTxEntry(ctx context.Context) (list []types.IdentityExecutionEntry) {
	store := k.genEncTxStore(ctx)
	entryStore := prefix.NewStore(store, types.KeyPrefix(types.GenEncTxEntryKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(entryStore, []byte{})
	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.IdentityExecutionEntry
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		val = identityEntryWithTxList(val, k.getGeneralEncryptedTxsByIdentity(ctx, val.Identity))
		list = append(list, val)
	}
	return
}

// AppendTxToEntry appends one general encrypted tx to an identity.
//
// This stores the tx under a deterministic identity/index key and only updates a
// tiny per-identity counter. Accepted order is preserved by assigning the index
// from this counter during DeliverTx and later iterating/sorting by Index.
func (k Keeper) AppendTxToEntry(
	ctx context.Context,
	identity string,
	encTx types.GeneralEncryptedTx,
) uint64 {
	k.migrateLegacyGeneralEncryptedTxEntry(ctx, identity)

	index := k.getGeneralEncryptedTxCount(ctx, identity)
	encTx.Identity = identity
	encTx.Index = index

	k.setGeneralEncryptedTx(ctx, identity, encTx)
	k.setGeneralEncryptedTxCount(ctx, identity, index+1)

	return index
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

// GetQueueEntry returns an execution queue entry by its identity with encrypted txs hydrated.
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
	return identityEntryWithTxList(val, k.getGeneralEncryptedTxsByIdentity(ctx, identity)), true
}

// SetQueueEntry sets an execution queue entry by its identity.
//
// The execution queue only needs the metadata/decryption key marker. The txs are
// read from the shared per-identity/per-index tx store at BeginBlock execution
// time, so this call does not rewrite the entire encrypted tx list.
func (k Keeper) SetExecutionQueueEntry(
	ctx context.Context,
	val types.IdentityExecutionEntry,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxExeQueueKeyPrefix))

	entry := identityEntryWithoutTxList(val)
	store.Set(
		types.GenEncTxQueueKey(entry.GetIdentity()),
		k.cdc.MustMarshal(&entry),
	)
}

// RemoveQueueEntry removes an entry from the execution queue.
func (k Keeper) RemoveExecutionQueueEntry(
	ctx context.Context,
	identity string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxExeQueueKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(identity))
}

// GetAllGenEncTxExecutionQueueEntry returns all execution queue entries with tx lists hydrated.
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
		val = identityEntryWithTxList(val, k.getGeneralEncryptedTxsByIdentity(ctx, val.Identity))
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
