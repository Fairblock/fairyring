package pep

import (
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"
)

// InitGenesis initializes the module's state from a provided genesis state.
func InitGenesis(ctx sdk.Context, k keeper.Keeper, genState types.GenesisState) {
	// Set all the encryptedTx
	for _, elem := range genState.EncryptedTxArray {
		if len(elem.EncryptedTxs) < 1 {
			continue
		}
		k.SetEncryptedTx(ctx, elem.EncryptedTxs[0].TargetHeight, elem)
	}
	// Set all the pepNonce
	for _, elem := range genState.PepNonceList {
		k.SetPepNonce(ctx, elem)
	}
	// Set all the aggregatedKeyShare
	for _, elem := range genState.DecryptionKeyList {
		k.SetDecryptionKey(ctx, elem)
	}
	// Set actuve public key
	k.SetActivePubkey(ctx, genState.ActivePubkey)
	// Set queued public key
	k.SetQueuedPubkey(ctx, genState.QueuedPubkey)
	// Set all the requestId
	for _, elem := range genState.RequestIdList {
		k.SetRequestId(ctx, elem)
	}
	// this line is used by starport scaffolding # genesis/module/init

	// this line is used by starport scaffolding # genesis/module/init
	k.SetPort(ctx, genState.PortId)
	// Only try to bind to port if it is not already bound, since we may already own
	// port capability from capability InitGenesis
	if k.ShouldBound(ctx, genState.PortId) {
		// module binds to the port on InitChain
		// and claims the returned capability
		err := k.BindPort(ctx, genState.PortId)
		if err != nil {
			panic("could not claim port capability: " + err.Error())
		}
	}

	k.SetRequestCount(ctx, genState.RequestCount)

	if err := k.SetParams(ctx, genState.Params); err != nil {
		panic(err)
	}
}

// ExportGenesis returns the module's exported genesis.
func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	genesis := types.DefaultGenesis()
	genesis.Params = k.GetParams(ctx)

	genesis.PortId = k.GetPort(ctx)
	genesis.RequestIdList = k.GetAllRequestId(ctx)
	// this line is used by starport scaffolding # genesis/module/export

	genesis.EncryptedTxArray = k.GetAllEncryptedArray(ctx)
	genesis.PepNonceList = k.GetAllPepNonce(ctx)
	genesis.DecryptionKeyList = k.GetAllDecryptionKeys(ctx)
	// this line is used by starport scaffolding # genesis/module/export
	akey, found := k.GetActivePubkey(ctx)
	if found {
		genesis.ActivePubkey = akey
	}
	qkey, found := k.GetQueuedPubkey(ctx)
	if found {
		genesis.QueuedPubkey = qkey
	}

	genesis.RequestCount, _ = strconv.ParseUint(k.GetRequestCount(ctx), 10, 64)

	return genesis
}
