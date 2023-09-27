package keyshare

import (
	"fairyring/x/keyshare/keeper"
	"fairyring/x/keyshare/types"
	"strconv"

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

	// Set all the authorizedAddress
	for _, elem := range genState.AuthorizedAddressList {
		k.SetAuthorizedAddress(ctx, elem)
	}
	// this line is used by starport scaffolding # genesis/module/init

	var portID string
	if genState.PortId == "" {
		portID = types.PortID
	}

	k.SetRequestCount(ctx, genState.RequestCount)

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

	genesis.AuthorizedAddressList = k.GetAllAuthorizedAddress(ctx)
	// this line is used by starport scaffolding # genesis/module/export

	genesis.PortId = k.GetPort(ctx)

	genesis.RequestCount, _ = strconv.ParseUint(k.GetRequestCount(ctx), 10, 64)

	return genesis
}
