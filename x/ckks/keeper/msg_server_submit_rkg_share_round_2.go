package keeper

import (
	"context"
	"encoding/hex"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	log "github.com/sirupsen/logrus"
)

func (k msgServer) SubmitRkgShareRound2(goCtx context.Context, msg *types.MsgSubmitRkgShareRound2) (*types.MsgSubmitRkgShareRound2Response, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Store the share
	k.StoreRKGShareRound2(ctx, msg.Creator, []byte(msg.ShareData))
	log.Info("here --------------------------------------------------------------- :", msg.GetCreator())
	// Check if threshold is met
	if k.IsThresholdMet(ctx, "RKG-R2") {
		rk_r2, err := k.AggregateRKGSharesRound2(ctx)
		if err != nil {
			return nil, types.ErrAggregation.Wrap("RKG aggregation failed")
		}
		rk_r2_str := hex.EncodeToString(rk_r2)
		//	log.Info("-------------------------------------------------------- RK-R2 = ", rk_r2_str)
		ctx.EventManager().EmitEvent(
			sdk.NewEvent("aggregated-rkg",
				sdk.NewAttribute("rk", rk_r2_str),
			),
		)

	}
	return &types.MsgSubmitRkgShareRound2Response{}, nil
}
