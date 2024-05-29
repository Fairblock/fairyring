package keeper

import (
	"cosmossdk.io/store/prefix"
	storetypes "cosmossdk.io/store/types"
	"encoding/binary"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/runtime"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k Keeper) GetAuthorizedCount(
	ctx sdk.Context,
	creator string,
) uint64 {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AuthorizedCountKeyPrefix))

	b := store.Get(types.AuthorizedCountKey(
		creator,
	))
	if b == nil {
		return 0
	}

	return binary.BigEndian.Uint64(b)
}

func (k Keeper) IncreaseAuthorizedCount(
	ctx sdk.Context,
	creator string,
) {
	count := k.GetAuthorizedCount(ctx, creator)

	countByte := make([]byte, 8)

	binary.BigEndian.PutUint64(countByte, count+1)

	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AuthorizedCountKeyPrefix))

	store.Set(types.AuthorizedCountKey(creator), countByte)
}

func (k Keeper) DecreaseAuthorizedCount(
	ctx sdk.Context,
	creator string,
) {
	count := k.GetAuthorizedCount(ctx, creator)

	countByte := make([]byte, 8)

	var newCount uint64 = 0

	if count > 0 {
		newCount = count - 1
	}

	binary.BigEndian.PutUint64(countByte, newCount)

	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AuthorizedCountKeyPrefix))

	store.Set(types.AuthorizedCountKey(creator), countByte)
}

// SetAuthorizedAddress set a specific authorizedAddress in the store from its index
func (k Keeper) SetAuthorizedAddress(ctx sdk.Context, authorizedAddress types.AuthorizedAddress) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AuthorizedCountKeyPrefix))
	b := k.cdc.MustMarshal(&authorizedAddress)
	store.Set(types.AuthorizedAddressKey(
		authorizedAddress.Target,
	), b)
}

// GetAuthorizedAddress returns a authorizedAddress from its index
func (k Keeper) GetAuthorizedAddress(
	ctx sdk.Context,
	target string,

) (val types.AuthorizedAddress, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AuthorizedCountKeyPrefix))

	b := store.Get(types.AuthorizedAddressKey(
		target,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveAuthorizedAddress removes a authorizedAddress from the store
func (k Keeper) RemoveAuthorizedAddress(
	ctx sdk.Context,
	target string,

) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AuthorizedCountKeyPrefix))
	store.Delete(types.AuthorizedAddressKey(
		target,
	))
}

// GetAllAuthorizedAddress returns all authorizedAddress
func (k Keeper) GetAllAuthorizedAddress(ctx sdk.Context) (list []types.AuthorizedAddress) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AuthorizedCountKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.AuthorizedAddress
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
