package keeper

import (
	"fairyring/x/fairyring/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetPubKeyID set a specific pubKeyID in the store from its index
func (k Keeper) SetPubKeyID(ctx sdk.Context, pubKeyID types.PubKeyID) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.PubKeyIDKeyPrefix))
	b := k.cdc.MustMarshal(&pubKeyID)
	store.Set(types.PubKeyIDKey(
		pubKeyID.Height,
	), b)
}

// GetPubKeyID returns a pubKeyID from its index
func (k Keeper) GetPubKeyID(
	ctx sdk.Context,
	height uint64,

) (val types.PubKeyID, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.PubKeyIDKeyPrefix))

	b := store.Get(types.PubKeyIDKey(
		height,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemovePubKeyID removes a pubKeyID from the store
func (k Keeper) RemovePubKeyID(
	ctx sdk.Context,
	height uint64,

) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.PubKeyIDKeyPrefix))
	store.Delete(types.PubKeyIDKey(
		height,
	))
}

// GetAllPubKeyID returns all pubKeyID
func (k Keeper) GetAllPubKeyID(ctx sdk.Context) (list []types.PubKeyID) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.PubKeyIDKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.PubKeyID
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
