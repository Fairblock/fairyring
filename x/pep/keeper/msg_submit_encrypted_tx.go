package keeper

import (
	"context"
	"fmt"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/telemetry"
	"strconv"

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

	var maxHeight uint64
	queuedKey, found := k.GetQueuedPubKey(ctx)
	if !found || (queuedKey.Expiry == 0 && len(queuedKey.PublicKey) == 0) {
		activeKey, foundActiveKey := k.GetActivePubKey(ctx)
		if !foundActiveKey {
			ctx.EventManager().EmitEvent(
				sdk.NewEvent(types.EncryptedTxRevertedEventType,
					sdk.NewAttribute(types.EncryptedTxRevertedEventCreator, msg.Creator),
					sdk.NewAttribute(types.EncryptedTxRevertedEventHeight, strconv.FormatUint(msg.TargetBlockHeight, 10)),
					sdk.NewAttribute(types.EncryptedTxRevertedEventReason, "Active Public key not found"),
					sdk.NewAttribute(types.EncryptedTxRevertedEventIndex, "0"),
				),
			)
			return nil, types.ErrActivePubKeyNotFound
		}
		maxHeight = activeKey.Expiry
	} else {
		maxHeight = queuedKey.Expiry
	}

	if msg.TargetBlockHeight > maxHeight {
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.EncryptedTxRevertedEventType,
				sdk.NewAttribute(types.EncryptedTxRevertedEventCreator, msg.Creator),
				sdk.NewAttribute(types.EncryptedTxRevertedEventHeight, strconv.FormatUint(msg.TargetBlockHeight, 10)),
				sdk.NewAttribute(types.EncryptedTxRevertedEventReason, "Target block height is higher than queued public key expiry height"),
				sdk.NewAttribute(types.EncryptedTxRevertedEventIndex, "0"),
			),
		)
		return nil, types.ErrInvalidTargetBlockHeight
	}

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
		k.Logger().Info(fmt.Sprintf("Error on sending coins: %v", err.Error()))
		return nil, err
	}

	encryptedTx := types.EncryptedTx{
		TargetHeight:           msg.TargetBlockHeight,
		Data:                   msg.Data,
		Creator:                msg.Creator,
		ChargedGas:             &minGas,
		ProcessedAtChainHeight: 0,
		Expired:                false,
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

	defer telemetry.IncrCounter(1, types.KeyTotalEncryptedTxSubmitted)

	return &types.MsgSubmitEncryptedTxResponse{}, nil
}
