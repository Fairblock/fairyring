package keyshare

import (
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
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
	// Set all the generalKeyShare
	for _, elem := range genState.GeneralKeyShareList {
		k.SetGeneralKeyShare(ctx, elem)
	}

	k.SetRequestCount(ctx, genState.RequestCount)

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
	if err := k.SetParams(ctx, genState.Params); err != nil {
		panic(err)
	}
}

// ExportGenesis returns the module's exported genesis.
func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	genesis := types.DefaultGenesis()
	genesis.Params = k.GetParams(ctx)

	genesis.PortId = k.GetPort(ctx)
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
	genesis.GeneralKeyShareList = k.GetAllGeneralKeyShare(ctx)
	// this line is used by starport scaffolding # genesis/module/export

	genesis.RequestCount, _ = strconv.ParseUint(k.GetRequestCount(ctx), 10, 64)

	// this line is used by starport scaffolding # genesis/module/export

	return genesis
}
