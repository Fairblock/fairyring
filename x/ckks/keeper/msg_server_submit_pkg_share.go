package keeper

import (
	"context"
	"encoding/hex"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"

	_ "github.com/sirupsen/logrus"
)

func (k msgServer) SubmitPkgShare(goCtx context.Context, msg *types.MsgSubmitPkgShare) (*types.MsgSubmitPkgShareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Prevent repeated shares
	if k.GetPKGShare(ctx, msg.Creator) != nil {
		return &types.MsgSubmitPkgShareResponse{}, nil
	}
	// Prevent regeneration of pkg
	if k.GetAggregatedPKGKey(ctx) != nil {
		return &types.MsgSubmitPkgShareResponse{}, nil
	}

	k.StorePKGShare(ctx, msg.Creator, []byte(msg.ShareData))

	if k.IsThresholdMet(ctx, "PKG") {

		pk, err := k.AggregatePKGShares(ctx)
		if err != nil {
			return nil, types.ErrAggregation.Wrap("PKG aggregation failed")
		}
		pkStr := hex.EncodeToString(pk)
		ctx.EventManager().EmitEvent(
			sdk.NewEvent("pk-aggregated",
				sdk.NewAttribute("value", pkStr),
			),
		)

	}

	return &types.MsgSubmitPkgShareResponse{}, nil

}