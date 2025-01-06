package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) KeySwitchRequest(goCtx context.Context, msg *types.MsgKeySwitchRequest) (*types.MsgKeySwitchRequestResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	ctx.EventManager().EmitEvent(
		sdk.NewEvent("start-submit-keyswitch-share",
			sdk.NewAttribute("ct", msg.Ct),
			sdk.NewAttribute("new-pk", msg.NewPk),
		),
	)

	return &types.MsgKeySwitchRequestResponse{}, nil
}
