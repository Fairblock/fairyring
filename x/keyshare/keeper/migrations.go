package keeper

import (
	v2 "github.com/Fairblock/fairyring/x/keyshare/migrations/v2"
	sdk "github.com/cosmos/cosmos-sdk/types"
	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
)

// Migrator is a struct for handling in-place store migrations.
type Migrator struct {
	keeper         Keeper
	legacySubspace paramtypes.Subspace
}

// NewMigrator returns a new Migrator.
func NewMigrator(keeper Keeper, legacySubspace paramtypes.Subspace) Migrator {
	return Migrator{keeper: keeper, legacySubspace: legacySubspace}
}

// Migrate1to2 migrates from version 1 to 2.
func (m Migrator) Migrate1to2(ctx sdk.Context) error {
	return v2.MigrateStore(ctx, m.keeper.storeService, m.legacySubspace, m.keeper.cdc)
}
