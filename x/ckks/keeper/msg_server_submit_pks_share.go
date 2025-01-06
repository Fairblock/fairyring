package keeper

import (
	"context"
	"encoding/hex"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) SubmitPksShare(goCtx context.Context, msg *types.MsgSubmitPksShare) (*types.MsgSubmitPksShareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	k.StorePKSShare(ctx, msg.Creator, []byte(msg.ShareData))
	// Check if threshold is met
	if k.IsThresholdMet(ctx, "PKS") {

		pk, err := k.AggregatePKSShares(ctx)
		if err != nil {
			return nil, types.ErrAggregation.Wrap("PKS aggregation failed")
		}
		pkStr := hex.EncodeToString(pk)
		ctx.EventManager().EmitEvent(
			sdk.NewEvent("pks-aggregated",
				sdk.NewAttribute("ks", pkStr),
			),
		)
		
	}


	return &types.MsgSubmitPksShareResponse{}, nil
}
