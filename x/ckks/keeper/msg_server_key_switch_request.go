package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/sirupsen/logrus"
)

func (k msgServer) KeySwitchRequest(goCtx context.Context, msg *types.MsgKeySwitchRequest) (*types.MsgKeySwitchRequestResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	    // Store the ciphertext using the handle as the key
		k.SetCiphertext(ctx, msg.Handle, msg.Ct)

		
		if msg.Decryption {
			logrus.Info("req sk: ",msg.NewSk)
			k.SetDecryptionInfo(ctx, msg.Handle, msg.NewSk)
		}
	
	ctx.EventManager().EmitEvent(
		sdk.NewEvent("start-submit-keyswitch-share",
			sdk.NewAttribute("ct", msg.Ct),
			sdk.NewAttribute("handle", msg.Handle),
			sdk.NewAttribute("new-pk", msg.NewPk),

		),
	)

	return &types.MsgKeySwitchRequestResponse{}, nil
}
