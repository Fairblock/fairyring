package keeper

import (
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// GetQueueEntry returns a queue entry by its identity
func (k Keeper) GetQueueEntry(
	ctx sdk.Context,
	identity string,
) (val types.GenEncTxExecutionQueue, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxKeyPrefix))

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
func (k Keeper) SetQueueEntry(
	ctx sdk.Context,
	val types.GenEncTxExecutionQueue,
) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxKeyPrefix))

	entry := k.cdc.MustMarshal(&val)
	store.Set(
		types.GenEncTxQueueKey(val.Identity),
		entry,
	)
}

// RemoveQueueEntry removes an entry from the store
func (k Keeper) RemoveQueueEntry(
	ctx sdk.Context,
	identity string,
) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GenEncTxKeyPrefix))
	store.Delete(types.GenEncTxQueueKey(identity))
}

// GetAllGenEncTxQueueEntry returns all GenEncTxQueue entries
func (k Keeper) GetAllGenEncTxQueueEntry(ctx sdk.Context) (list []types.GenEncTxExecutionQueue) {
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

func (k Keeper) AppendTxToQueueEntry(ctx sdk.Context, identity string, encTx types.GeneralEncryptedTx) uint64 {
	val, _ := k.GetQueueEntry(ctx, identity)
	index := len(val.TxList.EncryptedTx)
	encTx.Index = uint64(index)
	val.TxList.EncryptedTx = append(val.TxList.EncryptedTx, encTx)
	k.SetQueueEntry(ctx, val)
	return uint64(index)
}
