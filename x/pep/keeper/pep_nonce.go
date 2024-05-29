package keeper

import (
	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	"cosmossdk.io/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetPepNonce set a specific pepNonce in the store from its index
func (k Keeper) SetPepNonce(ctx sdk.Context, pepNonce types.PepNonce) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PepNonceKeyPrefix))
	b := k.cdc.MustMarshal(&pepNonce)
	store.Set(types.PepNonceKey(
		pepNonce.Address,
	), b)
}

// IncreasePepNonce increase specific pepNonce by 1 and returns the new nonce
func (k Keeper) IncreasePepNonce(
	ctx sdk.Context,
	address string,
) uint64 {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PepNonceKeyPrefix))

	b := store.Get(types.PepNonceKey(
		address,
	))

	var nonce types.PepNonce
	var newNonce uint64 = 2
	if b == nil {
		// New address ?
		nonce = types.PepNonce{
			Address: address,
			Nonce:   newNonce,
		}
	} else {
		k.cdc.MustUnmarshal(b, &nonce)
		nonce.Nonce = nonce.Nonce + 1
		newNonce = nonce.Nonce
	}

	k.SetPepNonce(ctx, nonce)

	return newNonce
}

// GetPepNonce returns a pepNonce from its index
func (k Keeper) GetPepNonce(
	ctx sdk.Context,
	address string,

) (val types.PepNonce, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PepNonceKeyPrefix))

	b := store.Get(types.PepNonceKey(
		address,
	))
	if b == nil {
		initNonce := types.PepNonce{
			Address: address,
			Nonce:   1,
		}
		k.SetPepNonce(ctx, initNonce)
		return initNonce, true
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemovePepNonce removes a pepNonce from the store
func (k Keeper) RemovePepNonce(
	ctx sdk.Context,
	address string,

) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PepNonceKeyPrefix))
	store.Delete(types.PepNonceKey(
		address,
	))
}

// GetAllPepNonce returns all pepNonce
func (k Keeper) GetAllPepNonce(ctx sdk.Context) (list []types.PepNonce) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PepNonceKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.PepNonce
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
