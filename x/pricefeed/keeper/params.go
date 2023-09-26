package keeper

import (
	sdk "github.com/cosmos/cosmos-sdk/types"

	"fairyring/x/pricefeed/types"
)

// GetParams get all parameters as types.Params
func (k Keeper) GetParams(ctx sdk.Context) types.Params {
	return types.NewParams(
		k.AskCount(ctx),
		k.MinCount(ctx),
		k.MinDsCount(ctx),
		k.PrepareGasBase(ctx),
		k.PrepareGasEach(ctx),
		k.ExecuteGasBase(ctx),
		k.ExecuteGasEach(ctx),
		k.SourceChannel(ctx),
		k.FeeLimit(ctx),
	)
}

// SetParams set the params
func (k Keeper) SetParams(ctx sdk.Context, params types.Params) {
	k.paramSpace.SetParamSet(ctx, &params)
}

func (k Keeper) AskCount(ctx sdk.Context) (res uint64) {
	k.paramSpace.Get(ctx, types.KeyAskCount, &res)
	return
}

func (k Keeper) MinCount(ctx sdk.Context) (res uint64) {
	k.paramSpace.Get(ctx, types.KeyMinCount, &res)
	return
}

func (k Keeper) MinDsCount(ctx sdk.Context) (res uint64) {
	k.paramSpace.Get(ctx, types.KeyMinDsCount, &res)
	return
}

func (k Keeper) PrepareGasBase(ctx sdk.Context) (res uint64) {
	k.paramSpace.Get(ctx, types.KeyPrepareGasBase, &res)
	return
}

func (k Keeper) PrepareGasEach(ctx sdk.Context) (res uint64) {
	k.paramSpace.Get(ctx, types.KeyPrepareGasEach, &res)
	return
}

func (k Keeper) ExecuteGasBase(ctx sdk.Context) (res uint64) {
	k.paramSpace.Get(ctx, types.KeyExecuteGasBase, &res)
	return
}

func (k Keeper) ExecuteGasEach(ctx sdk.Context) (res uint64) {
	k.paramSpace.Get(ctx, types.KeyExecuteGasEach, &res)
	return
}

func (k Keeper) SourceChannel(ctx sdk.Context) (res string) {
	k.paramSpace.Get(ctx, types.KeySourceChannel, &res)
	return
}

func (k Keeper) FeeLimit(ctx sdk.Context) (res sdk.Coins) {
	k.paramSpace.Get(ctx, types.KeyFeeLimit, &res)
	return
}
