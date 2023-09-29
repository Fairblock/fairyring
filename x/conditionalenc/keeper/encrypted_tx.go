package keeper

import (
	"fairyring/x/conditionalenc/types"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// AppendEncryptedTx append a specific encryptedTx in the store
func (k Keeper) AppendEncryptedTx(
	ctx sdk.Context,
	encryptedTx types.EncryptedTx,
) uint64 {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.EncryptedTxKeyPrefix))
	var allTxsFromHeight types.EncryptedTxArray
	b := store.Get(types.EncryptedTxAllFromCondition(
		encryptedTx.TargetCondition,
	))

	k.cdc.MustUnmarshal(b, &allTxsFromHeight)

	encryptedTx.Index = uint64(len(allTxsFromHeight.GetEncryptedTx()))

	allTxsFromHeight.EncryptedTx = append(allTxsFromHeight.EncryptedTx, encryptedTx)

	parsedEncryptedTxArr := k.cdc.MustMarshal(&allTxsFromHeight)

	store.Set(types.EncryptedTxAllFromCondition(
		encryptedTx.TargetCondition,
	), parsedEncryptedTxArr)

	return encryptedTx.Index
}

// SetEncryptedTx add a specific encryptedTx in the store from its index
func (k Keeper) SetEncryptedTx(
	ctx sdk.Context,
	condition string,
	encryptedTxArr types.EncryptedTxArray,
) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.EncryptedTxKeyPrefix))

	parsedEncryptedTxArr := k.cdc.MustMarshal(&encryptedTxArr)

	store.Set(types.EncryptedTxAllFromCondition(
		condition,
	), parsedEncryptedTxArr)
}

// GetEncryptedTx returns a encryptedTx from its index
func (k Keeper) GetEncryptedTx(
	ctx sdk.Context,
	targetCondition string,
	index uint64,

) (val types.EncryptedTx, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.EncryptedTxKeyPrefix))

	b := store.Get(types.EncryptedTxAllFromCondition(
		targetCondition,
	))
	if b == nil {
		return val, false
	}

	var arr types.EncryptedTxArray
	k.cdc.MustUnmarshal(b, &arr)

	if uint64(len(arr.GetEncryptedTx())) <= index {
		return val, false
	}

	return arr.GetEncryptedTx()[index], true
}

// GetEncryptedTxAllFromCondition returns all encryptedTx from the height provided
func (k Keeper) GetEncryptedTxAllFromCondition(
	ctx sdk.Context,
	targetCondition string,

) types.EncryptedTxArray {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.EncryptedTxKeyPrefix))

	b := store.Get(types.EncryptedTxAllFromCondition(
		targetCondition,
	))

	var arr types.EncryptedTxArray
	k.cdc.MustUnmarshal(b, &arr)

	return arr
}

// GetAllEncryptedArray returns the list of all encrypted txs
func (k Keeper) GetAllEncryptedArray(ctx sdk.Context) (arr []types.EncryptedTxArray) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.EncryptedTxKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.EncryptedTxArray
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		arr = append(arr, val)
	}

	return
}

// RemoveEncryptedTx removes a encryptedTx from the store
func (k Keeper) RemoveEncryptedTx(
	ctx sdk.Context,
	targetCondition string,
	index uint64,
) {
	arr := k.GetEncryptedTxAllFromCondition(ctx, targetCondition)

	if index >= uint64(len(arr.EncryptedTx)) {
		return
	}

	arr.EncryptedTx = append(arr.EncryptedTx[:index], arr.EncryptedTx[index+1:]...)

	k.SetEncryptedTx(ctx, targetCondition, arr)
}

// RemoveAllEncryptedTxFromCondition removes all encryptedTx from the store for a particular height
func (k Keeper) RemoveAllEncryptedTxFromCondition(
	ctx sdk.Context,
	targetCondition string,

) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.EncryptedTxKeyPrefix))
	store.Delete(types.EncryptedTxAllFromCondition(
		targetCondition,
	))
}
