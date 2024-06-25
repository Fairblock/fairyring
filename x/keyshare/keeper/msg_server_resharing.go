package keeper

import (
	"context"
	"encoding/json"
	"strconv"

	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/sirupsen/logrus"
)


func (k msgServer) Resharing(goCtx context.Context,  msg *types.MsgResharing) (*types.MsgResharingResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

    // TODO: Handling the message
    _ = ctx
	old, _ := json.Marshal(msg.OldGroup)
	new, _ := json.Marshal(msg.NewGroup)
	timeout, err := strconv.ParseUint(msg.Timeout, 10, 64)
	if err != nil {
		logrus.Error("start keygen error:", err)
	}
	k.InitTimeout(ctx, 1, timeout, uint64(ctx.BlockHeight()),msg.Creator)
	logrus.Info("reshare: ***********************************", string(old), string(new), msg.Timeout)
	event := sdk.NewEvent(
		"reshare",
		sdk.NewAttribute("start", "start"),
		sdk.NewAttribute("old", string(old)),
		sdk.NewAttribute("new", string(new)),
		sdk.NewAttribute("timeout", msg.Timeout),
	)
	ctx.EventManager().EmitEvent(event)

	return &types.MsgResharingResponse{}, nil
}
