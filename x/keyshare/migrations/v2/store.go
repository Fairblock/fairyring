package v2

import (
	"cosmossdk.io/core/store"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// MigrateStore migrates the x/bank module state from the consensus version 3 to
// version 4. Specifically, it takes the parameters that are currently stored
// and managed by the x/params module and stores them directly into the x/bank
// module state.
func MigrateStore(ctx sdk.Context, storeService store.KVStoreService, cdc codec.BinaryCodec) error {
	// SendEnabled is migrated to the x/bank module store, so delete from the params
	currParams := types.NewParams(
		463000,
		[]string{"fairy1r6q07ne3deq64ezcjwkedcfe6669f0ewpwnxy9"},
		types.DefaultMinimumBonded,
		types.DefaultSlashFractionNoKeyShare,
		types.DefaultSlashFractionWrongKeyShare,
		types.DefaultMaxIdledBlock)

	bz, err := cdc.Marshal(&currParams)
	if err != nil {
		return err
	}

	store := storeService.OpenKVStore(ctx)
	return store.Set(types.ParamsKey, bz)
}
