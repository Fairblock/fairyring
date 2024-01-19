package keeper

import (
	"context"
	"fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) GetAggrKeyshare(goCtx context.Context, msg *types.MsgGetAggrKeyshare) (*types.MsgGetAggrKeyshareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	var rsp types.MsgGetAggrKeyshareResponse

	keyshareReq, found := k.GetKeyShareRequest(ctx, msg.Identity)
	if !found {
		return &rsp, types.ErrRequestNotFound
	}

	if keyshareReq.AggrKeyshare == "" {

		k.Logger(ctx).Info("Got OnRecvGetAggrKeysharePacket")

		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.StartSendGeneralKeyShareEventType,
				sdk.NewAttribute(types.StartSendGeneralKeyShareEventIdentity, msg.Identity),
			),
		)
	}

	return &rsp, nil
}
