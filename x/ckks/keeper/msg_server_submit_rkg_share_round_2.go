package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) SubmitRkgShareRound2(goCtx context.Context, msg *types.MsgSubmitRkgShareRound2) (*types.MsgSubmitRkgShareRound2Response, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

		// Store the share
		k.StoreRKGShareRound2(ctx, msg.Creator, []byte(msg.ShareData))

		// Check if threshold is met
		if k.IsThresholdMet(ctx, "RKG") {
			rk_r2, err := k.AggregateRKGSharesRound2(ctx)
			if err != nil {
				return nil, types.ErrAggregation.Wrap("RKG aggregation failed")
			}
			k.logger.Info("-------------------------------------------------------- RK-R2 = ", rk_r2)
			
		}
	return &types.MsgSubmitRkgShareRound2Response{}, nil
}
