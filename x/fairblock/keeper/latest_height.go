package keeper

import (
	"fairyring/x/fairblock/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k Keeper) GetLatestHeight(
	ctx sdk.Context,
) string {
	store := ctx.KVStore(k.storeKey)
	return string(store.Get(types.LatestHeightKey))
}

func (k Keeper) SetLatestHeight(
	ctx sdk.Context,
	height string,
) {
	store := ctx.KVStore(k.storeKey)

	store.Set(types.LatestHeightKey, []byte(height))
}

func (k Keeper) GetLastExecutedHeight(
	ctx sdk.Context,
) string {
	store := ctx.KVStore(k.storeKey)
	return string(store.Get(types.LastExecutedHeightKey))
}

func (k Keeper) SetLastExecutedHeight(
	ctx sdk.Context,
	height string,
) {
	store := ctx.KVStore(k.storeKey)

	store.Set(types.LastExecutedHeightKey, []byte(height))
}
