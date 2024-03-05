package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) GetGeneralKeyshare(goCtx context.Context, msg *types.MsgGetGeneralKeyshare) (*types.MsgGetGeneralKeyshareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message
	_ = ctx

	return &types.MsgGetGeneralKeyshareResponse{}, nil
}
