package keeper

import (
	"context"
	"encoding/hex"
	"fmt"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"strconv"
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

	// This is to prevent the validator be slashed immediately after registering
	k.SetLastSubmittedHeight(ctx, msg.Creator, strconv.FormatInt(ctx.BlockHeight(), 10))

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.RegisteredValidatorEventType,
			sdk.NewAttribute(types.RegisteredValidatorEventCreator, msg.Creator),
		),
	)

	return &types.MsgRegisterValidatorResponse{
		Creator: msg.Creator,
	}, nil
}
