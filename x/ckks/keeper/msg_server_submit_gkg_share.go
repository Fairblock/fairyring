package keeper

import (
	"context"
	"encoding/hex"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	_ "github.com/sirupsen/logrus"
)

func (k msgServer) SubmitGkgShare(goCtx context.Context, msg *types.MsgSubmitGkgShare) (*types.MsgSubmitGkgShareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	// Store the share
	k.StoreGKGShare(ctx, msg.Creator, []byte(msg.ShareData))

	// Check if threshold is met
	if k.IsThresholdMet(ctx, "GKG") {
		gk, err := k.AggregateGKGShares(ctx)
		if err != nil {
			return nil, types.ErrAggregation.Wrap("GKG aggregation failed")
		}
		
		gk_str := hex.EncodeToString(gk)
		
		ctx.EventManager().EmitEvent(
			sdk.NewEvent("aggregated-gkg",
				sdk.NewAttribute("gk", gk_str),
			),
		)
	}
	return &types.MsgSubmitGkgShareResponse{}, nil
}
