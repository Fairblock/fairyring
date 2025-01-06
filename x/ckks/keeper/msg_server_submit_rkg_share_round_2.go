package keeper

import (
	"context"
	"encoding/hex"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	
)

func (k msgServer) SubmitRkgShareRound2(goCtx context.Context, msg *types.MsgSubmitRkgShareRound2) (*types.MsgSubmitRkgShareRound2Response, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	
	k.StoreRKGShareRound2(ctx, msg.Creator, []byte(msg.ShareData))
	
	// Check if threshold is met
	if k.IsThresholdMet(ctx, "RKG-R2") {
		rk_r2, err := k.AggregateRKGSharesRound2(ctx)
		if err != nil {
			return nil, types.ErrAggregation.Wrap("RKG aggregation failed")
		}
		rk_r2_str := hex.EncodeToString(rk_r2)
		
		ctx.EventManager().EmitEvent(
			sdk.NewEvent("aggregated-rkg",
				sdk.NewAttribute("rk", rk_r2_str),
			),
		)

	}
	return &types.MsgSubmitRkgShareRound2Response{}, nil
}
