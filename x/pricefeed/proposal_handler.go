package pricefeed

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types/v1beta1"

	"fairyring/x/pricefeed/keeper"
	"fairyring/x/pricefeed/types"
)

// NewParamChangeProposalHandler creates a new governance Handler for a ParamChangeProposal
func NewUpdateSymbolRequestProposalHandler(k keeper.Keeper) govtypes.Handler {
	return func(ctx sdk.Context, content govtypes.Content) error {
		switch c := content.(type) {
		case *types.UpdateSymbolRequestProposal:
			// If the Content is of type UpdateSymbolRequestProposal, call the handleUpdateSymbolRequestProposal function.
			return handleUpdateSymbolRequestProposal(ctx, k, c)

		default:
			return sdkerrors.Wrapf(sdkerrors.ErrUnknownRequest, "unrecognized UpdateSymbolRequest proposal content type: %T", c)
		}
	}
}

// handleUpdateSymbolRequestProposal is a function that handles the update symbol request proposal.
func handleUpdateSymbolRequestProposal(ctx sdk.Context, k keeper.Keeper, p *types.UpdateSymbolRequestProposal) error {
	// Set the symbol requests in the keeper with the new symbol requests specified in the proposal.
	k.HandleSymbolRequests(ctx, p.SymbolRequests)
	return nil
}
