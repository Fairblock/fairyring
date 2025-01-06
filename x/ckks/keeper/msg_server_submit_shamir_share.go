package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) SubmitShamirShare(goCtx context.Context, msg *types.MsgSubmitShamirShare) (*types.MsgSubmitShamirShareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.ShamirSharesSubmitted,
			sdk.NewAttribute(types.ShamirShares, msg.ShareList),
		),
	)

	return &types.MsgSubmitShamirShareResponse{}, nil
}
