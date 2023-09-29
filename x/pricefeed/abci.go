package pricefeed

import (
	sdk "github.com/cosmos/cosmos-sdk/types"

	"fairyring/x/pricefeed/keeper"
)

// HandleBeginBlock is a handler function for the BeginBlock ABCI request.
func HandleBeginBlock(ctx sdk.Context, k keeper.Keeper) {
	// fetches price data from the BandChain
	// at the start of a new block.
	k.RequestBandChainDataBySymbolRequests(ctx)
}
