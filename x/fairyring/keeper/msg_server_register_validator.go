package keeper

import (
	"context"
	"fairyring/x/fairyring/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) RegisterValidator(goCtx context.Context, msg *types.MsgRegisterValidator) (*types.MsgRegisterValidatorResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message

	_, found := k.GetValidatorSet(ctx, msg.Creator)

	if found {
		return nil, types.ErrValidatorAlreadyRegistered.Wrap(msg.Creator)
	}

	validator := types.ValidatorSet{
		Index:     msg.Creator,
		Validator: msg.Creator,
		IsActive:  true,
	}

	k.SetValidatorSet(ctx, validator)

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.RegisteredValidatorEventType,
			sdk.NewAttribute(types.RegisteredValidatorEventCreator, msg.Creator),
		),
	)

	return &types.MsgRegisterValidatorResponse{
		Creator: msg.Creator,
	}, nil
}
