package keeper

import (
	"context"
	"encoding/hex"
	"fairyring/x/keyshare/types"
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// RegisterValidator adds a new validator to the validator set
func (k msgServer) RegisterValidator(goCtx context.Context, msg *types.MsgRegisterValidator) (*types.MsgRegisterValidatorResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	_, found := k.GetValidatorSet(ctx, msg.Creator)

	if found {
		return nil, types.ErrValidatorAlreadyRegistered.Wrap(msg.Creator)
	}

	accAddr, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return nil, err
	}

	stakingValidator, found := k.stakingKeeper.GetValidator(ctx, sdk.ValAddress(accAddr))
	if !found {
		return nil, types.ErrAccountNotStaking.Wrap(msg.Creator)
	}

	bonded := stakingValidator.GetBondedTokens().Uint64()
	minBonded := k.MinimumBonded(ctx)
	if bonded < minBonded {
		return nil, types.ErrInsufficientBondedAmount.Wrap(
			fmt.Sprintf("Expected minimum bonded: %d, Got: %d", minBonded, bonded),
		)
	}

	consAddr, _ := stakingValidator.GetConsAddr()
	consByte := consAddr.Bytes()
	consHex := hex.EncodeToString(consByte)

	validator := types.ValidatorSet{
		Index:     msg.Creator,
		Validator: msg.Creator,
		ConsAddr:  consHex,
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
