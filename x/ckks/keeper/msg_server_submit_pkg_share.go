package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) SubmitPkgShare(goCtx context.Context, msg *types.MsgSubmitPkgShare) (*types.MsgSubmitPkgShareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

    // Store the share
    k.StorePKGShare(ctx, msg.Creator, []byte(msg.ShareData))

    // Check if threshold is met
    if k.IsThresholdMet(ctx, "PKG") {
        pk ,err := k.AggregatePKGShares(ctx)
		if err != nil {
            return nil, types.ErrAggregation.Wrap("PKG aggregation failed")
        }
		k.logger.Info("-------------------------------------------------------- PK = ", pk)
    }
	
    return &types.MsgSubmitPkgShareResponse{}, nil

}
