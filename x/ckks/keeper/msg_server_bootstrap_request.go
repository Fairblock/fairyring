package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) BootstrapRequest(goCtx context.Context, msg *types.MsgBootstrapRequest) (*types.MsgBootstrapRequestResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	k.SetCiphertext(ctx, msg.Handle, msg.Ct)

	ctx.EventManager().EmitEvent(
		sdk.NewEvent("start-submit-bootstrapping-share",
			sdk.NewAttribute("ct", msg.Ct),
			sdk.NewAttribute("handle", msg.Handle),
		),
	)
	return &types.MsgBootstrapRequestResponse{}, nil
}
