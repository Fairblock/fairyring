package keeper

import (
	"github.com/Fairblock/fairyring/x/pep/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// GetParams get all parameters as types.Params
func (k Keeper) GetParams(ctx sdk.Context) types.Params {
	coin := k.MinGasPrice(ctx)
	return types.NewParams(
		k.TrustedAddresses(ctx),
		k.TrustedCounterParties(ctx),
		k.PepChannelID(ctx),
		k.KeyshareChannelID(ctx),
		&coin,
		k.IsSourceChain(ctx),
	)
}

// SetParams set the params
func (k Keeper) SetParams(ctx sdk.Context, params types.Params) {
	k.paramstore.SetParamSet(ctx, &params)
}

// TrustedAddresses returns the TrustedAddresses param
func (k Keeper) TrustedAddresses(ctx sdk.Context) (res []string) {
	k.paramstore.Get(ctx, types.KeyTrustedAddresses, &res)
	return
}

// TrustedCounterParties returns the TrustedCounterParties param
func (k Keeper) TrustedCounterParties(ctx sdk.Context) (res []*types.TrustedCounterParty) {
	k.paramstore.Get(ctx, types.KeyTrustedCounterParties, &res)
	return
}

// ChannelID returns the PepChannelID param
func (k Keeper) PepChannelID(ctx sdk.Context) (res string) {
	k.paramstore.Get(ctx, types.KeyPepChannelID, &res)
	return
}

// KeyshareChannelID returns the KeyshareChannelID param
func (k Keeper) KeyshareChannelID(ctx sdk.Context) (res string) {
	k.paramstore.Get(ctx, types.KeyKeyshareChannelID, &res)
	return
}

func (k Keeper) MinGasPrice(ctx sdk.Context) (res sdk.Coin) {
	k.paramstore.Get(ctx, types.KeyMinGasPrice, &res)
	return
}

func (k Keeper) IsSourceChain(ctx sdk.Context) (res bool) {
	k.paramstore.Get(ctx, types.KeyIsSourceChain, &res)
	return
}
