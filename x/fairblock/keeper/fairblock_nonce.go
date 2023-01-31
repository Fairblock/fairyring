package keeper

import (
	"fairyring/x/fairblock/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetFairblockNonce set a specific fairblockNonce in the store from its index
func (k Keeper) SetFairblockNonce(ctx sdk.Context, fairblockNonce types.FairblockNonce) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.FairblockNonceKeyPrefix))
	b := k.cdc.MustMarshal(&fairblockNonce)
	store.Set(types.FairblockNonceKey(
		fairblockNonce.Address,
	), b)
}

// GetFairblockNonce returns a fairblockNonce from its index
func (k Keeper) GetFairblockNonce(
	ctx sdk.Context,
	address string,

) (val types.FairblockNonce, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.FairblockNonceKeyPrefix))

	b := store.Get(types.FairblockNonceKey(
		address,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveFairblockNonce removes a fairblockNonce from the store
func (k Keeper) RemoveFairblockNonce(
	ctx sdk.Context,
	address string,

) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.FairblockNonceKeyPrefix))
	store.Delete(types.FairblockNonceKey(
		address,
	))
}

// GetAllFairblockNonce returns all fairblockNonce
func (k Keeper) GetAllFairblockNonce(ctx sdk.Context) (list []types.FairblockNonce) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.FairblockNonceKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.FairblockNonce
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
