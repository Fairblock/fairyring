package keeper

import (
	"context"
	"fairyring/x/conditionalenc/types"
	"fmt"
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) SubmitEncryptedTx(goCtx context.Context, msg *types.MsgSubmitEncryptedTx) (*types.MsgSubmitEncryptedTxResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)


	

	senderAddr, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return nil, types.ErrInvalidMsgCreator
	}

	minGas := k.MinGasPrice(ctx)

	err = k.bankKeeper.SendCoinsFromAccountToModule(
		ctx,
		senderAddr,
		types.ModuleName,
		sdk.NewCoins(minGas),
	)

	if err != nil {
		k.Logger(ctx).Info(fmt.Sprintf("Error on sending coins: %v", err.Error()))
		return nil, err
	}

	encryptedTx := types.EncryptedTx{
		TargetCondition: msg.Condition,
		Data:            msg.Data,
		Creator:         msg.Creator,
		ChargedGas:      &minGas,
	}

	txIndex := k.AppendEncryptedTx(ctx, encryptedTx)

	// Emit event after appended ?
	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.SubmittedEncryptedTxEventType,
			sdk.NewAttribute(types.SubmittedEncryptedTxEventCreator, msg.Creator),
			sdk.NewAttribute(types.SubmittedEncryptedTxEventTargetCondition, msg.Condition),
			sdk.NewAttribute(types.SubmittedEncryptedTxEventData, msg.Data),
			sdk.NewAttribute(types.SubmittedEncryptedTxEventIndex, strconv.FormatUint(txIndex, 10)),
		),
	)

	return &types.MsgSubmitEncryptedTxResponse{}, nil
}
