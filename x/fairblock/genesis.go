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
	// Set all the fairblockExecutedNonce
	for _, elem := range genState.FairblockExecutedNonceList {
		k.SetFairblockExecutedNonce(ctx, elem)
	}
	// Set all the aggregatedKeyShare
	for _, elem := range genState.AggregatedKeyShareList {
		k.SetAggregatedKeyShare(ctx, elem)
	}
	// this line is used by starport scaffolding # genesis/module/init

	k.SetParams(ctx, genState.Params)
}

// ExportGenesis returns the module's exported genesis
func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	genesis := types.DefaultGenesis()
	genesis.Params = k.GetParams(ctx)
	
	genesis.EncryptedTxArray = k.GetAllEncryptedArray(ctx)
	genesis.FairblockNonceList = k.GetAllFairblockNonce(ctx)
	genesis.FairblockExecutedNonceList = k.GetAllFairblockExecutedNonce(ctx)
	genesis.AggregatedKeyShareList = k.GetAllAggregatedKeyShare(ctx)
	// this line is used by starport scaffolding # genesis/module/export

	return genesis
}
