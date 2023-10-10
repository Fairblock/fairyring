package conditionalenc

import (
	"fairyring/x/conditionalenc/keeper"
	"fairyring/x/conditionalenc/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// InitGenesis initializes the module's state from a provided genesis state.
func InitGenesis(ctx sdk.Context, k keeper.Keeper, genState types.GenesisState) {
	// Set all the encryptedTx
	for _, elem := range genState.EncryptedTxArray {
		if len(elem.EncryptedTx) < 1 {
			continue
		}
		k.SetEncryptedTx(ctx, elem.EncryptedTx[0].TargetCondition, elem)
	}
	// Set all the ConditionalencNonce
	for _, elem := range genState.ConditionalencNonceList {
		k.SetConditionalencNonce(ctx, elem)
	}
	// Set all the aggregatedConditionalKeyShare
	for _, elem := range genState.AggregatedConditionalKeyShareList {
		k.SetAggregatedConditionalKeyShare(ctx, elem)
	}
	// Set actuve public key
	k.SetActivePubKey(ctx, genState.ActivePubKey)
	// Set queued public key
	k.SetQueuedPubKey(ctx, genState.QueuedPubKey)
	// this line is used by starport scaffolding # genesis/module/init

	var portID string
	if genState.PortId == "" {
		portID = types.PortID
	}

	k.SetPort(ctx, portID)
	// Only try to bind to port if it is not already bound, since we may already own
	// port capability from capability InitGenesis
	if !k.IsBound(ctx, portID) {
		// module binds to the port on InitChain
		// and claims the returned capability
		err := k.BindPort(ctx, portID)
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

	genesis.EncryptedTxArray = k.GetAllEncryptedArray(ctx)
	genesis.ConditionalencNonceList = k.GetAllConditionalencNonce(ctx)
	genesis.AggregatedConditionalKeyShareList = k.GetAllAggregatedConditionalKeyShare(ctx)
	// this line is used by starport scaffolding # genesis/module/export
	akey, found := k.GetActivePubKey(ctx)
	if found {
		genesis.ActivePubKey = akey
	}
	qkey, found := k.GetQueuedPubKey(ctx)
	if found {
		genesis.QueuedPubKey = qkey
	}

	return genesis
}
