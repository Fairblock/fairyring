package keeper

import (
	"context"
	"github.com/Fairblock/fairyring/x/auction/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) DeregisterBidder(goCtx context.Context, msg *types.MsgDeregisterBidder) (*types.MsgDeregisterBidderResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Check if the sender is a registered bidder
	bidder, found := k.GetRegisteredBidder(ctx, msg.Creator)
	if !found {
		return nil, types.ErrTargetNotRegisteredBidder
	}

	// Parse the sender address
	bidderAddr, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return nil, err
	}

	// Send the delegated tokens from module back to sender
	refundCoin := sdk.NewCoins(*bidder.Delegated)
	if err := k.bankKeeper.SendCoinsFromModuleToAccount(ctx, types.ModuleName, bidderAddr, refundCoin); err != nil {
		return nil, err
	}

	// Remove sender from registered bidders
	k.RemoveRegisteredBidder(ctx, msg.Creator)

	return &types.MsgDeregisterBidderResponse{Refunded: bidder.Delegated}, nil
}
