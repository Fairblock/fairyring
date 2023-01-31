package fairblock

import (
	"fairyring/x/fairblock/keeper"
	"fairyring/x/fairblock/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// InitGenesis initializes the module's state from a provided genesis state.
func InitGenesis(ctx sdk.Context, k keeper.Keeper, genState types.GenesisState) {
	// Set all the encryptedTx
	for _, elem := range genState.EncryptedTxArray {
		if len(elem.EncryptedTx) < 1 {
			continue
		}
		k.SetEncryptedTx(ctx, elem.EncryptedTx[0].TargetHeight, elem)
	}
	// Set all the fairblockNonce
	for _, elem := range genState.FairblockNonceList {
		k.SetFairblockNonce(ctx, elem)
	}
	// this line is used by starport scaffolding # genesis/module/init
	k.SetPort(ctx, genState.PortId)
	// Only try to bind to port if it is not already bound, since we may already own
	// port capability from capability InitGenesis
	if !k.IsBound(ctx, genState.PortId) {
		// module binds to the port on InitChain
		// and claims the returned capability
		err := k.BindPort(ctx, genState.PortId)
		if err != nil {
			panic("could not claim port capability: " + err.Error())
		}
	}
	k.SetParams(ctx, genState.Params)
}

// ExportGenesis returns the module's exported genesis
func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	genesis := types.DefaultGenesis()
	genesis.Params = k.GetParams(ctx)

	genesis.PortId = k.GetPort(ctx)
	genesis.EncryptedTxArray = k.GetAllEncryptedArray(ctx)
	genesis.FairblockNonceList = k.GetAllFairblockNonce(ctx)
	// this line is used by starport scaffolding # genesis/module/export

	return genesis
}
