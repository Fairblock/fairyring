package keeper

import (
	"github.com/Fairblock/fairyring/x/keyshare/types"

	"cosmossdk.io/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetKeyShare set a specific keyShare in the store from its index
func (k Keeper) SetKeyShare(ctx sdk.Context, keyShare types.KeyShare) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.KeyShareKeyPrefix))
	b := k.cdc.MustMarshal(&keyShare)
	store.Set(types.KeyShareKey(
		keyShare.Validator,
		keyShare.BlockHeight,
	), b)
}

// GetKeyShare returns a keyShare from its index
func (k Keeper) GetKeyShare(
	ctx sdk.Context,
	validator string,
	blockHeight uint64,

) (val types.KeyShare, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.KeyShareKeyPrefix))

	b := store.Get(types.KeyShareKey(
		validator,
		blockHeight,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveKeyShare removes a keyShare from the store
func (k Keeper) RemoveKeyShare(
	ctx sdk.Context,
	validator string,
	blockHeight uint64,

) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.KeyShareKeyPrefix))
	store.Delete(types.KeyShareKey(
		validator,
		blockHeight,
	))
}

// GetAllKeyShare returns all keyShare
func (k Keeper) GetAllKeyShare(ctx sdk.Context) (list []types.KeyShare) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.KeyShareKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.KeyShare
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
