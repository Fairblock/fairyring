package keeper

import (
	"context"
	"encoding/hex"
	"fmt"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/sirupsen/logrus"
	_ "github.com/sirupsen/logrus"

)

func (k msgServer) SubmitPksShare(goCtx context.Context, msg *types.MsgSubmitPksShare) (*types.MsgSubmitPksShareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Prevent repeated shares
	if k.GetPKSShare(ctx, msg.Handle, msg.Creator) != nil {
		return &types.MsgSubmitPksShareResponse{}, nil
	}
	// Prevent regeneration of pks
	if k.GetAggregatedPKSKey(ctx, msg.Handle) != nil {
		return &types.MsgSubmitPksShareResponse{}, nil
	}
	shareByte, _ := hex.DecodeString(msg.ShareData)
	k.StorePKSShare(ctx, msg.Handle, msg.Creator, shareByte)
	// Check if threshold is met
	prefixKey := fmt.Sprintf("PKS:%s:", msg.Handle)
	if k.IsThresholdMet(ctx, prefixKey) {

		ct, err := k.AggregatePKSShares(ctx, msg.Handle)
		if err != nil {
			return nil, types.ErrAggregation.Wrap("PKS aggregation failed")
		}
	
			ct_bytes, _ := ct.MarshalBinary()
			ct_string := hex.EncodeToString(ct_bytes)
			logrus.Info("re-enc res: ", ct_string)
			ctx.EventManager().EmitEvent(
				sdk.NewEvent("ReEncryptionResult",
					sdk.NewAttribute("ct", ct_string),
					sdk.NewAttribute("handle", msg.Handle),
				),
			)
		}

	
	return &types.MsgSubmitPksShareResponse{}, nil
}
