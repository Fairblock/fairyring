package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) KeySwitchRequest(goCtx context.Context, msg *types.MsgKeySwitchRequest) (*types.MsgKeySwitchRequestResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	    // Store the ciphertext using the handle as the key
		k.SetCiphertext(ctx, msg.Handle, msg.Ct)

		// If Decryption is true, store the secret key and map the handle to a decryption flag
		if msg.Decryption {
			k.SetDecryptionInfo(ctx, msg.Handle, msg.NewSk)
		}
	
	ctx.EventManager().EmitEvent(
		sdk.NewEvent("start-submit-keyswitch-share",
			sdk.NewAttribute("ct", msg.Ct),
			sdk.NewAttribute("new-pk", msg.NewPk),
			sdk.NewAttribute("handle", msg.Handle),

		),
	)

	return &types.MsgKeySwitchRequestResponse{}, nil
}
