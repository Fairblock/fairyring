package keeper

import (
	"context"

	"cosmossdk.io/store/prefix"
	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/runtime"
)

// SetGeneralKeyShare set a specific generalKeyShare in the store from its index
func (k Keeper) SetGeneralKeyShare(ctx context.Context, generalKeyShare types.GeneralKeyShare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GeneralKeyShareKeyPrefix))

	b := k.cdc.MustMarshal(&generalKeyShare)
	store.Set(types.GeneralKeyShareKey(
		generalKeyShare.Validator,
		generalKeyShare.IdType,
		generalKeyShare.IdValue,
	), b)
}

// GetGeneralKeyShare returns a generalKeyShare from its index
func (k Keeper) GetGeneralKeyShare(
	ctx context.Context,
	validator string,
	idType string,
	idValue string,
) (val types.GeneralKeyShare, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GeneralKeyShareKeyPrefix))

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
	ctx context.Context,
	validator string,
	idType string,
	idValue string,

) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GeneralKeyShareKeyPrefix))
	store.Delete(types.GeneralKeyShareKey(
		validator,
		idType,
		idValue,
	))
}

// GetAllGeneralKeyShare returns all generalKeyShare
func (k Keeper) GetAllGeneralKeyShare(ctx context.Context) (list []types.GeneralKeyShare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GeneralKeyShareKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.GeneralKeyShare
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}

// SetPrivateKeyShare set a specific private KeyShare in the store from its index
func (k Keeper) SetPrivateKeyShare(ctx context.Context, encKeyShare types.ValidatorEncryptedKeyShare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.EncryptedKeyShareKeyPrefix))

	b := k.cdc.MustMarshal(&encKeyShare)
	store.Set(types.EncryptedlKeyShareKey(
		encKeyShare.Validator,
		encKeyShare.Identity,
		encKeyShare.Requester,
	), b)
}

// GetPrivateKeyShare returns a private KeyShare from its index
func (k Keeper) GetPrivateKeyShare(
	ctx context.Context,
	validator string,
	identity string,
	requester string,
) (val types.ValidatorEncryptedKeyShare, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.EncryptedKeyShareKeyPrefix))

	b := store.Get(types.EncryptedlKeyShareKey(
		validator,
		identity,
		requester,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemovePrivateKeyShare removes an private KeyShare from the store
func (k Keeper) RemovePrivateKeyShare(
	ctx context.Context,
	validator string,
	identiy string,
	requester string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.EncryptedKeyShareKeyPrefix))
	store.Delete(types.EncryptedlKeyShareKey(
		validator,
		identiy,
		requester,
	))
}

// GetAllPrivateKeyShare returns all private KeyShares
func (k Keeper) GetAllPrivateKeyShare(ctx context.Context) (list []types.ValidatorEncryptedKeyShare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.EncryptedKeyShareKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.ValidatorEncryptedKeyShare
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
