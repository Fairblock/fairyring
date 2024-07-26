package keeper

import (
	"context"
	"fmt"
	"strconv"

	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/telemetry"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) SubmitGeneralEncryptedTx(goCtx context.Context, msg *types.MsgSubmitGeneralEncryptedTx) (*types.MsgSubmitEncryptedTxResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	entry, found := k.GetEntry(ctx, msg.ReqId)
	if !found {
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.EncryptedTxRevertedEventType,
				sdk.NewAttribute(types.EncryptedTxRevertedEventCreator, msg.Creator),
				sdk.NewAttribute(types.EncryptedTxRevertedEventIdentity, msg.ReqId),
				sdk.NewAttribute(types.EncryptedTxRevertedEventReason, "Incorrect Request ID"),
				sdk.NewAttribute(types.EncryptedTxRevertedEventIndex, "0"),
			),
		)
		return nil, types.ErrInvalidIdentity
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

	encryptedTx := types.GeneralEncryptedTx{
		Identity:   entry.Identity,
		Data:       msg.Data,
		Creator:    msg.Creator,
		ChargedGas: &minGas,
	}

	txIndex := k.AppendTxToEntry(ctx, msg.ReqId, encryptedTx)

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.SubmittedGeneralEncryptedTxEventType,
			sdk.NewAttribute(types.SubmittedEncryptedTxEventCreator, msg.Creator),
			sdk.NewAttribute(types.SubmittedEncryptedTxEventIdentity, msg.ReqId),
			sdk.NewAttribute(types.SubmittedEncryptedTxEventData, msg.Data),
			sdk.NewAttribute(types.SubmittedEncryptedTxEventIndex, strconv.FormatUint(txIndex, 10)),
		),
	)

	defer telemetry.IncrCounter(1, types.KeyTotalEncryptedTxSubmitted)

	return &types.MsgSubmitEncryptedTxResponse{}, nil
}
