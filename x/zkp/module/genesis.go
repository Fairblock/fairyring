package zkp

import (
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/Fairblock/fairyring/x/zkp/keeper"
	"github.com/Fairblock/fairyring/x/zkp/types"
)

func InitGenesis(ctx sdk.Context, k keeper.Keeper, genState types.GenesisState) {
	k.Logger().Info("Starting genesis state initialization for module", "module", types.ModuleName)
	for _, addr := range genState.TrustedContracts {
		k.StoreTrustedContract(ctx, addr)
	}
	k.Logger().Info("Genesis state initialization completed for module", "module", types.ModuleName)
}

func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	genesis := types.DefaultGenesis()
	genesis.TrustedContracts = k.GetAllTrustedContracts(ctx)
	return genesis
}

