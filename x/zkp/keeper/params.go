package keeper

import (
	"context"

	"github.com/cosmos/cosmos-sdk/runtime"

	"github.com/Fairblock/fairyring/x/zkp/types"
)

// GetParams returns the current zkp module params.
func (k Keeper) GetParams(ctx context.Context) (params types.Params) {
	store := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	bz := store.Get(types.ParamsKey)
	if bz == nil {
		return types.DefaultParams()
	}

	k.cdc.MustUnmarshal(bz, &params)
	if params.Authority == "" {
		params.Authority = types.DefaultAuthority()
	}
	return params
}

// SetParams stores the zkp module params after validating them.
func (k Keeper) SetParams(ctx context.Context, params types.Params) error {
	if err := params.Validate(); err != nil {
		return err
	}

	store := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	bz, err := k.cdc.Marshal(&params)
	if err != nil {
		return err
	}
	store.Set(types.ParamsKey, bz)

	return nil
}
