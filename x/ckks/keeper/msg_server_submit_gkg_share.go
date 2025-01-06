package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) SubmitGkgShare(goCtx context.Context, msg *types.MsgSubmitGkgShare) (*types.MsgSubmitGkgShareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
 // Store the share
 k.StoreGKGShare(ctx, msg.Creator, []byte(msg.ShareData))

 // Check if threshold is met
 if k.IsThresholdMet(ctx, "GKG") {
	 gk ,err := k.AggregateGKGShares(ctx)
	 if err != nil {
		 return nil, types.ErrAggregation.Wrap("GKG aggregation failed")
	 }
	 k.logger.Info("-------------------------------------------------------- GK = ", gk)
 }
	return &types.MsgSubmitGkgShareResponse{}, nil
}
