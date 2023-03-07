package keeper

import (
	"fairyring/x/fairblock/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetFairblockExecutedNonce set a specific fairblockExecutedNonce in the store from its index
func (k Keeper) SetFairblockExecutedNonce(ctx sdk.Context, fairblockExecutedNonce types.FairblockExecutedNonce) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.FairblockExecutedNonceKeyPrefix))
	b := k.cdc.MustMarshal(&fairblockExecutedNonce)
	store.Set(types.FairblockExecutedNonceKey(
		fairblockExecutedNonce.Address,
	), b)
}

// IncreaseFairblockExecutedNonce increase specific fairblockExecutedNonce by 1 and returns the new nonce
func (k Keeper) IncreaseFairblockExecutedNonce(
	ctx sdk.Context,
	address string,
) uint64 {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.FairblockExecutedNonceKeyPrefix))

	b := store.Get(types.FairblockExecutedNonceKey(
		address,
	))

	var nonce types.FairblockExecutedNonce
	var newNonce uint64
	if b == nil {
		// New address ?
		nonce = types.FairblockExecutedNonce{
			Address: address,
			Nonce:   2,
		}
		newNonce = 2
	} else {
		k.cdc.MustUnmarshal(b, &nonce)
		nonce.Nonce = nonce.Nonce + 1
		newNonce = nonce.Nonce
	}

	k.SetFairblockExecutedNonce(ctx, nonce)

	return newNonce
}

// GetFairblockExecutedNonce returns a fairblockExecutedNonce from its index
func (k Keeper) GetFairblockExecutedNonce(
	ctx sdk.Context,
	address string,

) (val types.FairblockExecutedNonce, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.FairblockExecutedNonceKeyPrefix))

	b := store.Get(types.FairblockExecutedNonceKey(
		address,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveFairblockExecutedNonce removes a fairblockExecutedNonce from the store
func (k Keeper) RemoveFairblockExecutedNonce(
	ctx sdk.Context,
	address string,

) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.FairblockExecutedNonceKeyPrefix))
	store.Delete(types.FairblockExecutedNonceKey(
		address,
	))
}

// GetAllFairblockExecutedNonce returns all fairblockExecutedNonce
func (k Keeper) GetAllFairblockExecutedNonce(ctx sdk.Context) (list []types.FairblockExecutedNonce) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.FairblockExecutedNonceKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.FairblockExecutedNonce
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
