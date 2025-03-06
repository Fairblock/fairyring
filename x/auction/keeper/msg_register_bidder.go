package keeper

import (
	"context"
	"github.com/Fairblock/fairyring/x/auction/types"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) RegisterBidder(goCtx context.Context, msg *types.MsgRegisterBidder) (*types.MsgRegisterBidderResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	params := k.Keeper.GetParams(ctx)

	// Parse bidder address for bank module
	bidderAddr, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return nil, err
	}

	// Check if bidder has enough tokens to delegate
	enoughToken := false
	senderCoins := k.bankKeeper.SpendableCoins(ctx, bidderAddr)
	for _, c := range senderCoins {
		if c.Denom == params.MinimumDelegationAmount.Denom &&
			c.Amount.GTE(params.MinimumDelegationAmount.Amount) {
			enoughToken = true
			break
		}
	}

	if !enoughToken {
		return nil, types.ErrInsufficientFunds.Wrapf("got %s, but %s is required", senderCoins.String(), params.MinimumDelegationAmount.String())
	}

	// Send coin from bidder to the module
	coinsBid := sdk.NewCoins(*params.MinimumDelegationAmount)
	if err := k.bankKeeper.SendCoinsFromAccountToModule(ctx, bidderAddr, types.ModuleName, coinsBid); err != nil {
		return nil, err
	}

	k.SetRegisteredBidder(ctx, commontypes.Bidder{
		Address:   msg.Creator,
		Delegated: params.MinimumDelegationAmount,
		Active:    true,
	})

	return &types.MsgRegisterBidderResponse{
		Delegated: params.MinimumDelegationAmount,
	}, nil
}
