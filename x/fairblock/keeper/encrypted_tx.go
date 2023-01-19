package keeper

import (
	"fairyring/x/fairblock/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetEncryptedTx set a specific encryptedTx in the store from its index
func (k Keeper) SetEncryptedTx(ctx sdk.Context, encryptedTx types.EncryptedTx) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.EncryptedTxKeyPrefix))
	b := k.cdc.MustMarshal(&encryptedTx)
	store.Set(types.EncryptedTxKey(
		encryptedTx.TargetHeight,
		encryptedTx.Index,
	), b)
}

// GetEncryptedTx returns a encryptedTx from its index
func (k Keeper) GetEncryptedTx(
	ctx sdk.Context,
	targetHeight uint64,
	index uint64,

) (val types.EncryptedTx, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.EncryptedTxKeyPrefix))

	b := store.Get(types.EncryptedTxKey(
		targetHeight,
		index,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveEncryptedTx removes a encryptedTx from the store
func (k Keeper) RemoveEncryptedTx(
	ctx sdk.Context,
	targetHeight uint64,
	index uint64,

) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.EncryptedTxKeyPrefix))
	store.Delete(types.EncryptedTxKey(
		targetHeight,
		index,
	))
}

// GetAllEncryptedTx returns all encryptedTx
func (k Keeper) GetAllEncryptedTx(ctx sdk.Context) (list []types.EncryptedTx) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.EncryptedTxKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.EncryptedTx
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
