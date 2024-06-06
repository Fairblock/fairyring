package keeper

import (
	"cosmossdk.io/math"
	"github.com/Fairblock/fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// GetParams get all parameters as types.Params
func (k Keeper) GetParams(ctx sdk.Context) types.Params {
	return types.NewParams(
		k.KeyExpiry(ctx),
		k.TrustedAddresses(ctx),
		k.MinimumBonded(ctx),
		k.SlashFractionNoKeyshare(ctx),
		k.SlashFractionWrongKeyshare(ctx),
		k.MaxIdledBlock(ctx),
	)
}

// SetParams set the params
func (k Keeper) SetParams(ctx sdk.Context, params types.Params) {
	k.params.Set(ctx, params)
}

// KeyExpiry returns the KeyExpiry param
func (k Keeper) KeyExpiry(ctx sdk.Context) uint64 {
	store, _ := k.params.Get(ctx)
	return store.GetKeyExpiry()
}

// TrustedAddresses returns the TrustedAddresses param
func (k Keeper) TrustedAddresses(ctx sdk.Context) (res []string) {
	store, _ := k.params.Get(ctx)
	res = store.GetTrustedAddresses()
	return
}

// MinimumBonded returns the MinimumBonded param
func (k Keeper) MinimumBonded(ctx sdk.Context) (res uint64) {
	store, _ := k.params.Get(ctx)
	res = store.GetMinimumBonded()
	return
}

// SlashFractionNoKeyshare returns the SlashFractionNoKeyshare param
func (k Keeper) SlashFractionNoKeyshare(ctx sdk.Context) (res math.LegacyDec) {
	store, _ := k.params.Get(ctx)
	res = store.SlashFractionNoKeyshare
	return
}

// SlashFractionWrongKeyshare returns the SlashFractionWrongKeyshare param
func (k Keeper) SlashFractionWrongKeyshare(ctx sdk.Context) (res math.LegacyDec) {
	store, _ := k.params.Get(ctx)
	res = store.SlashFractionWrongKeyshare
	return
}

// MaxIdledBlock returns the MaxIdledBlock param
func (k Keeper) MaxIdledBlock(ctx sdk.Context) (res uint64) {
	store, _ := k.params.Get(ctx)
	res = store.GetMaxIdledBlock()
	return
}
