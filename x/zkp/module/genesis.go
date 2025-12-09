package zkp

import (
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/Fairblock/fairyring/x/zkp/keeper"
	"github.com/Fairblock/fairyring/x/zkp/types"
)

// InitGenesis initializes the module's state from a provided genesis state.
func InitGenesis(ctx sdk.Context, k keeper.Keeper, genState types.GenesisState) {
	// this line is used by starport scaffolding # genesis/module/init
	k.Logger().Info("Starting genesis state initialization for module", "module", types.ModuleName)
	k.Logger().Info("Genesis state initialization completed for module", "module", types.ModuleName)
}

// ExportGenesis returns the module's exported genesis
func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	genesis := types.DefaultGenesis()
	// this line is used by starport scaffolding # genesis/module/export

	return genesis
}

