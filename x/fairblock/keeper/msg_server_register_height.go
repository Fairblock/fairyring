package keeper

import (
	"context"

	"fairyring/x/fairblock/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) RegisterHeight(goCtx context.Context, msg *types.MsgRegisterHeight) (*types.MsgRegisterHeightResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	k.SetLatestHeight(ctx, msg.GetHeight())

	return &types.MsgRegisterHeightResponse{}, nil
}
