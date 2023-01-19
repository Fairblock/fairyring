package keeper

import (
	"context"

	"fairyring/x/fairblock/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) SubmitEncryptedTx(goCtx context.Context, msg *types.MsgSubmitEncryptedTx) (*types.MsgSubmitEncryptedTxResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	encryptedTx := types.EncryptedTx{
		TargetHeight: msg.TargetBlockHeight,
		Data:         msg.Data,
		Creator:      msg.Creator,
	}

	k.AppendEncryptedTx(ctx, encryptedTx)

	// Emit event after appended ?

	return &types.MsgSubmitEncryptedTxResponse{}, nil
}
