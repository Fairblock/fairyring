package auction

import (
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/Fairblock/fairyring/x/auction/keeper"
	"github.com/Fairblock/fairyring/x/auction/types"
)

// InitGenesis initializes the module's state from a provided genesis state.
func InitGenesis(ctx sdk.Context, k keeper.Keeper, genState types.GenesisState) {
	for _, a := range genState.AuctionDetailList {
		if len(a.AuctionDetail) < 1 {
			continue
		}
		k.SetAuctionDetailList(ctx, a.AuctionDetail[0].ResolveAt, a)
	}

	for _, b := range genState.RegisteredBidders {
		k.SetRegisteredBidder(ctx, b)
	}

	// this line is used by starport scaffolding # genesis/module/init
	if err := k.SetParams(ctx, genState.Params); err != nil {
		panic(err)
	}
}

// ExportGenesis returns the module's exported genesis.
func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	genesis := types.DefaultGenesis()
	genesis.Params = k.GetParams(ctx)
	genesis.RegisteredBidders = k.GetAllRegisteredBidders(ctx)
	genesis.AuctionDetailList = k.GetAllAuctionDetailList(ctx)
	// this line is used by starport scaffolding # genesis/module/export

	return genesis
}
