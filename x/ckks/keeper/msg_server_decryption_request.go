package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) DecryptionRequest(goCtx context.Context, msg *types.MsgDecryptionRequest) (*types.MsgDecryptionRequestResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Store the ciphertext using the handle as the key
	k.SetCiphertext(ctx, msg.Handle, msg.Ct)

	ctx.EventManager().EmitEvent(
		sdk.NewEvent("start-submit-decryption-share",
			sdk.NewAttribute("ct", msg.Ct),
			sdk.NewAttribute("handle", msg.Handle),
		),
	)

	return &types.MsgDecryptionRequestResponse{}, nil
}
