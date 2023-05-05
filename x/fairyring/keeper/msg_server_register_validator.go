package keeper

import (
	"context"
	"encoding/hex"
	"fairyring/x/fairyring/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// RegisterValidator adds a new validator to the validator set
func (k msgServer) RegisterValidator(goCtx context.Context, msg *types.MsgRegisterValidator) (*types.MsgRegisterValidatorResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	_, found := k.GetValidatorSet(ctx, msg.Creator)

	if found {
		return nil, types.ErrValidatorAlreadyRegistered.Wrap(msg.Creator)
	}

	isStaking := false
	var senderConsAddr string
	
	allStakingValidators := k.stakingKeeper.GetAllValidators(ctx)
	for _, eachV := range allStakingValidators {
		valAddr, _ := sdk.ValAddressFromBech32(eachV.OperatorAddress)
		valAccAddr := sdk.AccAddress(valAddr)
		consAddr, _ := eachV.GetConsAddr()

		if valAccAddr.String() == msg.Creator {
			isStaking = true
			consByte := consAddr.Bytes()
			consHex := hex.EncodeToString(consByte)
			senderConsAddr = consHex
			break
		}
	}

	if !isStaking {
		return nil, types.ErrAccountNotStaking.Wrap(msg.Creator)
	}

	validator := types.ValidatorSet{
		Index:     msg.Creator,
		Validator: msg.Creator,
		ConsAddr:  senderConsAddr,
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
