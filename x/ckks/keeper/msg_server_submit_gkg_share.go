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

	// Prevent repeated shares
	if k.GetGKGShare(ctx, msg.Creator) != nil {
		return &types.MsgSubmitGkgShareResponse{}, nil
	}
	// Prevent regeneration of GKG
	if k.GetAggregatedGKGKey(ctx) != nil {
		return &types.MsgSubmitGkgShareResponse{}, nil
	}
	share, _ := hex.DecodeString(msg.ShareData)
	// Store the share
	k.StoreGKGShare(ctx, msg.Creator, share)

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
