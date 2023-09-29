package keeper

import (
	"fairyring/x/conditionalenc/types"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetConditionalencNonce set a specific ConditionalencNonce in the store from its index
func (k Keeper) SetConditionalencNonce(ctx sdk.Context, ConditionalencNonce types.ConditionalencNonce) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.ConditionalencNonceKeyPrefix))
	b := k.cdc.MustMarshal(&ConditionalencNonce)
	store.Set(types.ConditionalencNonceKey(
		ConditionalencNonce.Address,
	), b)
}

// IncreaseConditionalencNonce increase specific ConditionalencNonce by 1 and returns the new nonce
func (k Keeper) IncreaseConditionalencNonce(
	ctx sdk.Context,
	address string,
) uint64 {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.ConditionalencNonceKeyPrefix))

	b := store.Get(types.ConditionalencNonceKey(
		address,
	))

	var nonce types.ConditionalencNonce
	var newNonce uint64 = 2
	if b == nil {
		// New address ?
		nonce = types.ConditionalencNonce{
			Address: address,
			Nonce:   newNonce,
		}
	} else {
		k.cdc.MustUnmarshal(b, &nonce)
		nonce.Nonce = nonce.Nonce + 1
		newNonce = nonce.Nonce
	}

	k.SetConditionalencNonce(ctx, nonce)

	return newNonce
}

// GetConditionalencNonce returns a ConditionalencNonce from its index
func (k Keeper) GetConditionalencNonce(
	ctx sdk.Context,
	address string,

) (val types.ConditionalencNonce, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.ConditionalencNonceKeyPrefix))

	b := store.Get(types.ConditionalencNonceKey(
		address,
	))
	if b == nil {
		initNonce := types.ConditionalencNonce{
			Address: address,
			Nonce:   1,
		}
		k.SetConditionalencNonce(ctx, initNonce)
		return initNonce, true
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveConditionalencNonce removes a ConditionalencNonce from the store
func (k Keeper) RemoveConditionalencNonce(
	ctx sdk.Context,
	address string,

) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.ConditionalencNonceKeyPrefix))
	store.Delete(types.ConditionalencNonceKey(
		address,
	))
}

// GetAllConditionalencNonce returns all ConditionalencNonce
func (k Keeper) GetAllConditionalencNonce(ctx sdk.Context) (list []types.ConditionalencNonce) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.ConditionalencNonceKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.ConditionalencNonce
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
