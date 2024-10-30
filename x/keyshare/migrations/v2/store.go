package v2

import (
	"cosmossdk.io/core/store"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// MigrateStore migrates the x/keyshare module state from the consensus version 1 to version 2.
func MigrateStore(ctx sdk.Context, storeService store.KVStoreService, cdc codec.BinaryCodec) error {
	currParams := types.NewParams(
		463000,
		[]string{"fairy1r6q07ne3deq64ezcjwkedcfe6669f0ewpwnxy9"},
		types.DefaultMinimumBonded,
		types.DefaultSlashFractionNoKeyshare,
		types.DefaultSlashFractionWrongKeyshare,
		types.DefaultMaxIdledBlock,
		types.DefaultAvgBlockTime,
	)

	bz, err := cdc.Marshal(&currParams)
	if err != nil {
		return err
	}

	store := storeService.OpenKVStore(ctx)
	return store.Set(types.ParamsKey, bz)
}
