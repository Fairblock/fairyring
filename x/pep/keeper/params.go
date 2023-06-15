package keeper

import (
	"fairyring/x/pep/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// GetParams get all parameters as types.Params
func (k Keeper) GetParams(ctx sdk.Context) types.Params {
	return types.NewParams(
		k.MaximumEncryptedTx(ctx),
	)
}

// SetParams set the params
func (k Keeper) SetParams(ctx sdk.Context, params types.Params) {
	k.paramstore.SetParamSet(ctx, &params)
}

// MaximumEncryptedTx returns the MaximumEncryptedTx param
func (k Keeper) MaximumEncryptedTx(ctx sdk.Context) (res uint64) {
	k.paramstore.Get(ctx, types.KeyMaximumEncryptedTx, &res)
	return
}
