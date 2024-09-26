package v3

import (
	"cosmossdk.io/core/store"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// MigrateStore migrates the x/pep module state from the consensus version 1 to version 2.
func MigrateStore(ctx sdk.Context, storeService store.KVStoreService, cdc codec.BinaryCodec) error {
	store := storeService.OpenKVStore(ctx)
	currentParamsBytes, err := store.Get(types.ParamsKey)
	if err != nil {
		return err
	}
	var currentParams types.Params
	if err = cdc.Unmarshal(currentParamsBytes, &currentParams); err != nil {
		return err
	}

	currParams := types.NewParams(
		currentParams.TrustedAddresses,
		currentParams.TrustedCounterParties,
		currentParams.KeyshareChannelId,
		currentParams.MinGasPrice,
		currentParams.IsSourceChain,
		&types.DefaultKeysharePrice,
	)

	bz, err := cdc.Marshal(&currParams)
	if err != nil {
		return err
	}

	return store.Set(types.ParamsKey, bz)
}
