package keeper

import (
	sdk "github.com/cosmos/cosmos-sdk/types"

	"fairyring/x/pricefeed/types"
)

// InitGenesis initializes the module's state from a provided genesis state.
func (k Keeper) InitGenesis(ctx sdk.Context, state types.GenesisState) {
	k.SetPort(ctx, state.PortId)
	// Only try to bind to port if it is not already bound, since we may already own
	// port capability from capability InitGenesis
	if !k.IsBound(ctx, state.PortId) {
		// module binds to the port on InitChain
		// and claims the returned capability
		err := k.BindPort(ctx, state.PortId)
		if err != nil {
			panic("could not claim port capability: " + err.Error())
		}
	}
	k.SetParams(ctx, state.Params)
	k.HandleSymbolRequests(ctx, state.SymbolRequests)
}

// ExportGenesis returns the module's exported genesis
func (k Keeper) ExportGenesis(ctx sdk.Context) *types.GenesisState {
	return &types.GenesisState{
		PortId:         k.GetPort(ctx),
		Params:         k.GetParams(ctx),
		SymbolRequests: k.GetAllSymbolRequests(ctx),
	}
}
