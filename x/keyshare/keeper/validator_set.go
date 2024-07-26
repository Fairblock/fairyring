package keeper

import (
	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	"context"
	"cosmossdk.io/store/prefix"
)

// SetValidatorSet set a specific validatorSet in the store from its index
func (k Keeper) SetValidatorSet(ctx context.Context, validatorSet types.ValidatorSet) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.ValidatorSetKeyPrefix))
	b := k.cdc.MustMarshal(&validatorSet)
	store.Set(types.ValidatorSetKey(
		validatorSet.Index,
	), b)
}

// GetValidatorSet returns a validatorSet from its index
func (k Keeper) GetValidatorSet(
	ctx context.Context,
	index string,

) (val types.ValidatorSet, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.ValidatorSetKeyPrefix))

	b := store.Get(types.ValidatorSetKey(
		index,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveValidatorSet removes a validatorSet from the store
func (k Keeper) RemoveValidatorSet(
	ctx context.Context,
	index string,

) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.ValidatorSetKeyPrefix))
	store.Delete(types.ValidatorSetKey(
		index,
	))
}

// GetAllValidatorSet returns all validatorSet
func (k Keeper) GetAllValidatorSet(ctx context.Context) (list []types.ValidatorSet) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.ValidatorSetKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.ValidatorSet
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
