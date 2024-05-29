package keeper

import (
	"cosmossdk.io/store/prefix"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// GetLatestHeight gets the last registered fairyring Height
func (k Keeper) GetLatestHeight(
	ctx sdk.Context,
) string {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	return string(store.Get(types.LatestHeightKey))
}

// SetLatestHeight sets the last registered fairyring Height
func (k Keeper) SetLatestHeight(
	ctx sdk.Context,
	height string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})

	store.Set(types.LatestHeightKey, []byte(height))
}

// GetLastExecutedHeight gets the last execution height
func (k Keeper) GetLastExecutedHeight(
	ctx sdk.Context,
) string {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	return string(store.Get(types.LastExecutedHeightKey))
}

// SetLastExecutedHeight sets the last execution height
func (k Keeper) SetLastExecutedHeight(
	ctx sdk.Context,
	height string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})

	store.Set(types.LastExecutedHeightKey, []byte(height))
}
