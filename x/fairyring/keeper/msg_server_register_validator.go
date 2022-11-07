package keeper

import (
	"context"

	"fairyring/x/fairyring/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) RegisterValidator(goCtx context.Context, msg *types.MsgRegisterValidator) (*types.MsgRegisterValidatorResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message
	_ = ctx

	return &types.MsgRegisterValidatorResponse{}, nil
}
