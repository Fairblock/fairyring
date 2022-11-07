package keeper

import (
	"context"

	"fairyring/x/fairyring/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) SendKeyshare(goCtx context.Context, msg *types.MsgSendKeyshare) (*types.MsgSendKeyshareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message
	_ = ctx

	return &types.MsgSendKeyshareResponse{}, nil
}
