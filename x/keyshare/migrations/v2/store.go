package v2

import (
	"cosmossdk.io/core/store"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	paramstypes "github.com/cosmos/cosmos-sdk/x/params/types"
)

// MigrateStore migrates the x/bank module state from the consensus version 3 to
// version 4. Specifically, it takes the parameters that are currently stored
// and managed by the x/params module and stores them directly into the x/bank
// module state.
func MigrateStore(ctx sdk.Context, storeService store.KVStoreService, legacySubspace paramstypes.Subspace, cdc codec.BinaryCodec) error {
	var currParams types.Params
	legacySubspace.GetParamSet(ctx, &currParams)

	// SendEnabled is migrated to the x/bank module store, so delete from the params
	currParams = types.NewParams(currParams.KeyExpiry,
		currParams.TrustedAddresses,
		currParams.MinimumBonded,
		types.DefaultSlashFractionNoKeyShare,
		types.DefaultSlashFractionWrongKeyShare,
		currParams.MaxIdledBlock)

	bz, err := cdc.Marshal(&currParams)
	if err != nil {
		return err
	}

	store := storeService.OpenKVStore(ctx)
	return store.Set(types.ParamsKey, bz)
}
