package keeper

import (
	"fairyring/x/pep/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// GetLatestHeight gets the last registered fairyring Height
func (k Keeper) GetLatestHeight(
	ctx sdk.Context,
) string {
	store := ctx.KVStore(k.storeKey)
	return string(store.Get(types.LatestHeightKey))
}

// SetLatestHeight sets the last registered fairyring Height
func (k Keeper) SetLatestHeight(
	ctx sdk.Context,
	height string,
) {
	store := ctx.KVStore(k.storeKey)

	store.Set(types.LatestHeightKey, []byte(height))
}

// GetLastExecutedHeight gets the last execution height
func (k Keeper) GetLastExecutedHeight(
	ctx sdk.Context,
) string {
	store := ctx.KVStore(k.storeKey)
	return string(store.Get(types.LastExecutedHeightKey))
}

// SetLastExecutedHeight sets the last execution height
func (k Keeper) SetLastExecutedHeight(
	ctx sdk.Context,
	height string,
) {
	store := ctx.KVStore(k.storeKey)

	store.Set(types.LastExecutedHeightKey, []byte(height))
}
