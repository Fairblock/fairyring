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

// IncreaseFairblockNonce increase specific fairblockNonce by 1 and returns the new nonce
func (k Keeper) IncreaseFairblockNonce(
	ctx sdk.Context,
	address string,
) uint64 {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.FairblockNonceKeyPrefix))

	b := store.Get(types.FairblockNonceKey(
		address,
	))

	var nonce types.FairblockNonce
	var newNonce uint64
	if b == nil {
		// New address ?
		nonce = types.FairblockNonce{
			Address: address,
			Nonce:   2,
		}
		newNonce = 2
	} else {
		k.cdc.MustUnmarshal(b, &nonce)
		nonce.Nonce = nonce.Nonce + 1
		newNonce = nonce.Nonce
	}

	k.SetFairblockNonce(ctx, nonce)

	return newNonce
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
