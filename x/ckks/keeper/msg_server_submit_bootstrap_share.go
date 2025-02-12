package keeper

import (
	"context"
	"encoding/hex"
	"fmt"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/sirupsen/logrus"
)

func (k msgServer) SubmitBootstrapShare(goCtx context.Context, msg *types.MsgSubmitBootstrapShare) (*types.MsgSubmitBootstrapShareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)


	if k.GetBootstrapShare(ctx, msg.Handle, msg.Creator) != nil {
	
		return &types.MsgSubmitBootstrapShareResponse{}, nil
	}

	
	if k.GetAggregatedBootstrapCiphertext(ctx, msg.Handle) != nil {
		return &types.MsgSubmitBootstrapShareResponse{}, nil
	}

	
	shareBytes, err := hex.DecodeString(msg.ShareData)
	if err != nil {
		return nil, types.ErrAggregation.Wrapf("Invalid hex in shareData: %v", err)
	}

	
	k.StoreBootstrapShare(ctx, msg.Handle, msg.Creator, shareBytes)

	
	prefixKey := fmt.Sprintf("BOOTSTRAP:%s:", msg.Handle)
	if k.IsThresholdMet(ctx, prefixKey) {
		
		ct, err := k.AggregateBootstrapShares(ctx, msg.Handle)
		if err != nil {
			logrus.Info("+++++++++++++++++++++++++++++ error: ",err)
			return nil, types.ErrAggregation.Wrap("bootstrapping aggregation failed")
		}

	
		ctBytes, _ := ct.MarshalBinary()
		ctString := hex.EncodeToString(ctBytes)

		ctx.EventManager().EmitEvent(
			sdk.NewEvent("BootstrappingResult",
				sdk.NewAttribute("ct", ctString),
				sdk.NewAttribute("handle", msg.Handle),
			),
		)
	}

	return &types.MsgSubmitBootstrapShareResponse{}, nil
}
