package keeper

import (
	"context"
	"encoding/hex"
	"fairyring/x/fairyring/types"
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) RegisterValidator(goCtx context.Context, msg *types.MsgRegisterValidator) (*types.MsgRegisterValidatorResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message

	_, found := k.GetValidatorSet(ctx, msg.Creator)

	if found {
		return nil, types.ErrValidatorAlreadyRegistered.Wrap(msg.Creator)
	}

	isStaking := false
	var senderConsAddr string
	allStakingValidators := k.stakingKeeper.GetAllValidators(ctx)
	for _, eachV := range allStakingValidators {
		pub, _ := eachV.ConsPubKey()
		consAddr, _ := eachV.GetConsAddr()
		addr := sdk.AccAddress(pub.Address())

		k.Logger(ctx).Info(fmt.Sprintf("!! Each Valid Info : %s %s %s", addr.String(), consAddr, eachV.OperatorAddress))

		if addr.String() == msg.Creator {
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
