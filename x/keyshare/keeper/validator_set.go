package keeper

import (
	"github.com/Fairblock/fairyring/x/keyshare/types"

	"cosmossdk.io/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetValidatorSet set a specific validatorSet in the store from its index
func (k Keeper) SetValidatorSet(ctx sdk.Context, validatorSet types.ValidatorSet) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.ValidatorSetKeyPrefix))
	b := k.cdc.MustMarshal(&validatorSet)
	store.Set(types.ValidatorSetKey(
		validatorSet.Index,
	), b)
}

// GetValidatorSet returns a validatorSet from its index
func (k Keeper) GetValidatorSet(
	ctx sdk.Context,
	index string,

) (val types.ValidatorSet, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.ValidatorSetKeyPrefix))

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
	ctx sdk.Context,
	index string,

) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.ValidatorSetKeyPrefix))
	store.Delete(types.ValidatorSetKey(
		index,
	))
}

// GetAllValidatorSet returns all validatorSet
func (k Keeper) GetAllValidatorSet(ctx sdk.Context) (list []types.ValidatorSet) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.ValidatorSetKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.ValidatorSet
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
