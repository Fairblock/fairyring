package pep

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	"strconv"

	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"
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
	// Set all the pepNonce
	for _, elem := range genState.PepNonceList {
		k.SetPepNonce(ctx, elem)
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

	k.SetRequestCount(ctx, genState.RequestCount)
	// this line is used by starport scaffolding # genesis/module/init
	k.SetParams(ctx, genState.Params)
}

// ExportGenesis returns the module's exported genesis.
func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	genesis := types.DefaultGenesis()
	genesis.Params = k.GetParams(ctx)

	genesis.EncryptedTxArray = k.GetAllEncryptedArray(ctx)
	genesis.PepNonceList = k.GetAllPepNonce(ctx)
	genesis.AggregatedKeyShareList = k.GetAllAggregatedKeyShare(ctx)
	// this line is used by starport scaffolding # genesis/module/export
	akey, found := k.GetActivePubKey(ctx)
	if found {
		genesis.ActivePubKey = akey
	}
	qkey, found := k.GetQueuedPubKey(ctx)
	if found {
		genesis.QueuedPubKey = qkey
	}

	genesis.RequestCount, _ = strconv.ParseUint(k.GetRequestCount(ctx), 10, 64)

	return genesis
}
