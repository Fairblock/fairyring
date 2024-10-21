package keeper

import (
	"context"

	"cosmossdk.io/store/prefix"
	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/runtime"
)

// SetGeneralKeyshare set a specific generalKeyShare in the store from its index
func (k Keeper) SetGeneralKeyshare(ctx context.Context, generalKeyshare types.GeneralKeyshare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GeneralKeyshareKeyPrefix))

	b := k.cdc.MustMarshal(&generalKeyshare)
	store.Set(types.GeneralKeyshareKey(
		generalKeyshare.Validator,
		generalKeyshare.IdType,
		generalKeyshare.IdValue,
	), b)
}

// GetGeneralKeyshare returns a generalKeyShare from its index
func (k Keeper) GetGeneralKeyshare(
	ctx context.Context,
	validator string,
	idType string,
	idValue string,
) (val types.GeneralKeyshare, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GeneralKeyshareKeyPrefix))

	b := store.Get(types.GeneralKeyshareKey(
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

// RemoveGeneralKeyshare removes a generalKeyshare from the store
func (k Keeper) RemoveGeneralKeyshare(
	ctx context.Context,
	validator string,
	idType string,
	idValue string,

) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GeneralKeyshareKeyPrefix))
	store.Delete(types.GeneralKeyshareKey(
		validator,
		idType,
		idValue,
	))
}

// GetAllGeneralKeyshare returns all generalKeyshare
func (k Keeper) GetAllGeneralKeyshare(ctx context.Context) (list []types.GeneralKeyshare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GeneralKeyshareKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.GeneralKeyshare
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}

// SetPrivateKeyshare set a specific private Keyshare in the store from its index
func (k Keeper) SetPrivateKeyshare(ctx context.Context, encKeyShare types.ValidatorEncryptedKeyshare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateKeyshareKeyPrefix))

	b := k.cdc.MustMarshal(&encKeyShare)
	store.Set(types.PrivateKeyshareKey(
		encKeyShare.Validator,
		encKeyShare.Identity,
		encKeyShare.Requester,
	), b)
}

// GetPrivateKeyshare returns a private Keyshare from its index
func (k Keeper) GetPrivateKeyshare(
	ctx context.Context,
	validator string,
	identity string,
	requester string,
) (val types.ValidatorEncryptedKeyshare, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateKeyshareKeyPrefix))

	b := store.Get(types.PrivateKeyshareKey(
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

// RemovePrivateKeyshare removes an private Keyshare from the store
func (k Keeper) RemovePrivateKeyshare(
	ctx context.Context,
	validator string,
	identiy string,
	requester string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateKeyshareKeyPrefix))
	store.Delete(types.PrivateKeyshareKey(
		validator,
		identiy,
		requester,
	))
}

// GetAllPrivateKeyshare returns all private Keyshares
func (k Keeper) GetAllPrivateKeyshare(ctx context.Context) (list []types.ValidatorEncryptedKeyshare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PrivateKeyshareKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.ValidatorEncryptedKeyshare
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
