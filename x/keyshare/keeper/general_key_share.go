package keeper

import (
	"fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetGeneralKeyShare set a specific generalKeyShare in the store from its index
func (k Keeper) SetGeneralKeyShare(ctx sdk.Context, generalKeyShare types.GeneralKeyShare) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GeneralKeyShareKeyPrefix))
	b := k.cdc.MustMarshal(&generalKeyShare)
	store.Set(types.GeneralKeyShareKey(
		generalKeyShare.Validator,
		generalKeyShare.IdType,
		generalKeyShare.IdValue,
	), b)
}

// GetGeneralKeyShare returns a generalKeyShare from its index
func (k Keeper) GetGeneralKeyShare(
	ctx sdk.Context,
	validator string,
	idType string,
	idValue string,
) (val types.GeneralKeyShare, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GeneralKeyShareKeyPrefix))

	b := store.Get(types.GeneralKeyShareKey(
		validator,
		idType,
		idValue,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveGeneralKeyShare removes a generalKeyShare from the store
func (k Keeper) RemoveGeneralKeyShare(
	ctx sdk.Context,
	validator string,
	idType string,
	idValue string,

) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GeneralKeyShareKeyPrefix))
	store.Delete(types.GeneralKeyShareKey(
		validator,
		idType,
		idValue,
	))
}

// GetAllGeneralKeyShare returns all generalKeyShare
func (k Keeper) GetAllGeneralKeyShare(ctx sdk.Context) (list []types.GeneralKeyShare) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.GeneralKeyShareKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.GeneralKeyShare
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
