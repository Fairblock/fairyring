package keeper

import (
	"context"
	"cosmossdk.io/math"
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/cosmos/cosmos-sdk/runtime"

	"github.com/Fairblock/fairyring/x/keyshare/types"
)

// GetParams get all parameters as types.Params
func (k Keeper) GetParams(ctx context.Context) (params types.Params) {
	store := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	bz := store.Get(types.ParamsKey)
	if bz == nil {
		return params
	}

	k.cdc.MustUnmarshal(bz, &params)
	return params
}

// SetParams set the params
func (k Keeper) SetParams(ctx context.Context, params types.Params) error {
	store := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	bz, err := k.cdc.Marshal(&params)
	if err != nil {
		return err
	}
	store.Set(types.ParamsKey, bz)

	return nil
}

// KeyExpiry returns the KeyExpiry param
func (k Keeper) KeyExpiry(ctx sdk.Context) uint64 {
	return k.GetParams(ctx).KeyExpiry
}

// TrustedAddresses returns the TrustedAddresses param
func (k Keeper) TrustedAddresses(ctx sdk.Context) (res []string) {
	return k.GetParams(ctx).TrustedAddresses
}

// MinimumBonded returns the MinimumBonded param
func (k Keeper) MinimumBonded(ctx sdk.Context) (res uint64) {
	return k.GetParams(ctx).MinimumBonded
}

// SlashFractionNoKeyshare returns the SlashFractionNoKeyshare param
func (k Keeper) SlashFractionNoKeyshare(ctx sdk.Context) (res math.LegacyDec) {
	return k.GetParams(ctx).SlashFractionNoKeyshare
}

// SlashFractionWrongKeyshare returns the SlashFractionWrongKeyshare param
func (k Keeper) SlashFractionWrongKeyshare(ctx sdk.Context) (res math.LegacyDec) {
	return k.GetParams(ctx).SlashFractionWrongKeyshare
}

// MaxIdledBlock returns the MaxIdledBlock param
func (k Keeper) MaxIdledBlock(ctx sdk.Context) (res uint64) {
	return k.GetParams(ctx).MaxIdledBlock
}
