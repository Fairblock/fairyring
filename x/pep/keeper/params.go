package keeper

import (
	"context"
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/cosmos/cosmos-sdk/runtime"

	"github.com/Fairblock/fairyring/x/pep/types"
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

// TrustedAddresses returns the TrustedAddresses param
func (k Keeper) TrustedAddresses(ctx context.Context) (res []string) {
	return k.GetParams(ctx).TrustedAddresses
}

// TrustedCounterParties returns the TrustedCounterParties param
func (k Keeper) TrustedCounterParties(ctx context.Context) (res []*types.TrustedCounterParty) {
	return k.GetParams(ctx).TrustedCounterParties
}

// KeyshareChannelID returns the KeyshareChannelID param
func (k Keeper) KeyshareChannelID(ctx context.Context) (res string) {
	return k.GetParams(ctx).KeyshareChannelId
}

func (k Keeper) MinGasPrice(ctx context.Context) (res sdk.Coin) {
	return *k.GetParams(ctx).MinGasPrice
}

func (k Keeper) IsSourceChain(ctx context.Context) (res bool) {
	return k.GetParams(ctx).IsSourceChain
}
