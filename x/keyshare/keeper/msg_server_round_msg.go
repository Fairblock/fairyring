package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) RoundMsg(goCtx context.Context, msg *types.MsgRoundMsg) (*types.MsgRoundMsgResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message
	_ = ctx
	event := sdk.NewEvent(
		"reshare",
		sdk.NewAttribute("message", msg.InnerMessage),
		sdk.NewAttribute("module", "dkg"),
		sdk.NewAttribute("dealer", msg.DealerIndex),
		sdk.NewAttribute("round", msg.Round),
		
	
	)
	ctx.EventManager().EmitEvent(event)
	return &types.MsgRoundMsgResponse{}, nil
}
