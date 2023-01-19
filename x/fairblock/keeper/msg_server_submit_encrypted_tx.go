package keeper

import (
	"context"

	"fairyring/x/fairblock/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) SubmitEncryptedTx(goCtx context.Context, msg *types.MsgSubmitEncryptedTx) (*types.MsgSubmitEncryptedTxResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message
	_ = ctx

	return &types.MsgSubmitEncryptedTxResponse{}, nil
}
