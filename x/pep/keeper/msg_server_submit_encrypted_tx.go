package keeper

import (
	"context"
	"strconv"

	"fairyring/x/pep/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) SubmitEncryptedTx(goCtx context.Context, msg *types.MsgSubmitEncryptedTx) (*types.MsgSubmitEncryptedTxResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	strHeight := k.GetLatestHeight(ctx)
	height, err := strconv.ParseUint(strHeight, 10, 64)

	if err != nil {
		height = uint64(ctx.BlockHeight())
	}

	if msg.TargetBlockHeight <= height {
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.EncryptedTxRevertedEventType,
				sdk.NewAttribute(types.EncryptedTxRevertedEventCreator, msg.Creator),
				sdk.NewAttribute(types.EncryptedTxRevertedEventHeight, strconv.FormatUint(msg.TargetBlockHeight, 10)),
				sdk.NewAttribute(types.EncryptedTxRevertedEventReason, "Incorrect block height"),
				sdk.NewAttribute(types.EncryptedTxRevertedEventIndex, "0"),
			),
		)

		return nil, types.ErrInvalidTargetBlockHeight
	}

	targetHeightEncryptedTxs := k.GetEncryptedTxAllFromHeight(ctx, msg.TargetBlockHeight)
	currentEncryptedTxCount := uint64(len(targetHeightEncryptedTxs.EncryptedTx))
	maximumEncryptedTx := k.MaximumEncryptedTx(ctx)

	if currentEncryptedTxCount >= maximumEncryptedTx {
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.EncryptedTxRevertedEventType,
				sdk.NewAttribute(types.EncryptedTxRevertedEventCreator, msg.Creator),
				sdk.NewAttribute(types.EncryptedTxRevertedEventHeight, strconv.FormatUint(msg.TargetBlockHeight, 10)),
				sdk.NewAttribute(types.EncryptedTxRevertedEventReason, "Exceeded maximum number of encrypted tx in target block height"),
				sdk.NewAttribute(types.EncryptedTxRevertedEventIndex, "0"),
			),
		)
		return nil, types.ErrExceededMaximumEncryptedTx
	}

	encryptedTx := types.EncryptedTx{
		TargetHeight: msg.TargetBlockHeight,
		Data:         msg.Data,
		Creator:      msg.Creator,
	}

	txIndex := k.AppendEncryptedTx(ctx, encryptedTx)

	// Emit event after appended ?
	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.SubmittedEncryptedTxEventType,
			sdk.NewAttribute(types.SubmittedEncryptedTxEventCreator, msg.Creator),
			sdk.NewAttribute(types.SubmittedEncryptedTxEventTargetHeight, strconv.FormatUint(msg.TargetBlockHeight, 10)),
			sdk.NewAttribute(types.SubmittedEncryptedTxEventData, msg.Data),
			sdk.NewAttribute(types.SubmittedEncryptedTxEventIndex, strconv.FormatUint(txIndex, 10)),
		),
	)

	return &types.MsgSubmitEncryptedTxResponse{}, nil
}
