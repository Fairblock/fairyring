package keeper

import (
	"context"
	"encoding/hex"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	_ "github.com/sirupsen/logrus"
)

func (k msgServer) SubmitRkgShareRound1(goCtx context.Context, msg *types.MsgSubmitRkgShareRound1) (*types.MsgSubmitRkgShareRound1Response, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	// Store the share
	k.StoreRKGShareRound1(ctx, msg.Creator, []byte(msg.ShareData))

	// Check if threshold is met
	if k.IsThresholdMet(ctx, "RKG-R1") {
		rk_r1, err := k.AggregateRKGSharesRound1(ctx)
		if err != nil {
			return nil, types.ErrAggregation.Wrap("RKG aggregation failed")
		}
		rk_r1_str := hex.EncodeToString(rk_r1)
		// logrus.Info("-------------------------------------------------------- RK-R1 = ", rk_r1_str)
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.SendRKGRound2EventType,
				sdk.NewAttribute(types.RKR1Combined, rk_r1_str),
			),
		)
	}
	return &types.MsgSubmitRkgShareRound1Response{}, nil
}
