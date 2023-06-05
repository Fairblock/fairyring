package keyshare

import (
	"github.com/FairBlock/fairyring/x/keyshare/keeper"
	"github.com/FairBlock/fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// InitGenesis initializes the module's state from a provided genesis state.
func InitGenesis(ctx sdk.Context, k keeper.Keeper, genState types.GenesisState) {
	// Set all the validatorSet
	for _, elem := range genState.ValidatorSetList {
		k.SetValidatorSet(ctx, elem)
	}
	// Set all the keyShare
	for _, elem := range genState.KeyShareList {
		k.SetKeyShare(ctx, elem)
	}
	// Set all the aggregatedKeyShare
	for _, elem := range genState.AggregatedKeyShareList {
		k.SetAggregatedKeyShare(ctx, elem)
	}
	// Set actuve public key
	k.SetActivePubKey(ctx, genState.ActivePubKey)
	// Set queued public key
	k.SetQueuedPubKey(ctx, genState.QueuedPubKey)

	// this line is used by starport scaffolding # genesis/module/init
	k.SetParams(ctx, genState.Params)
}

// ExportGenesis returns the module's exported genesis
func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	genesis := types.DefaultGenesis()
	genesis.Params = k.GetParams(ctx)

	genesis.ValidatorSetList = k.GetAllValidatorSet(ctx)
	genesis.KeyShareList = k.GetAllKeyShare(ctx)
	genesis.AggregatedKeyShareList = k.GetAllAggregatedKeyShare(ctx)

	akey, found := k.GetActivePubKey(ctx)
	if found {
		genesis.ActivePubKey = akey
	}
	qkey, found := k.GetQueuedPubKey(ctx)
	if found {
		genesis.QueuedPubKey = qkey
	}

	// this line is used by starport scaffolding # genesis/module/export

	return genesis
}
