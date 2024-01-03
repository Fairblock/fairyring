package keeper

import (
	"context"
	"fairyring/x/conditionalenc/types"
	pricefeedtypes "fairyring/x/pricefeed/types"
	"fmt"
	"regexp"
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"
)



func (k msgServer) SubmitEncryptedTx(goCtx context.Context, msg *types.MsgSubmitEncryptedTx) (*types.MsgSubmitEncryptedTxResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)


    // err := verifyNonce(msg.Condition, k, ctx)
	// if err != nil {
	// 	return nil, err
	// }
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

func verifyNonce(condition string, k msgServer, ctx sdk.Context) error {
	re, err := regexp.Compile(`(\d+)([a-zA-Z]+)(\d+)`)
	if err != nil {
		fmt.Println("Error compiling regex:", err)
		return err
	}

	// Find matches
	matches := re.FindStringSubmatch(condition)
	if matches != nil && len(matches) > 3 {
		price, err := strconv.Atoi(matches[3])
		if err != nil {
			return err
		}
		nonce := k.pricefeedKeeper.GetRepeatedPrice(ctx,pricefeedtypes.Price{Symbol: matches[2], Price: uint64(price)})
		if strconv.Itoa(int(nonce)) != matches[1]{
			return fmt.Errorf("wrong nonce")
		}
		return nil
	} else {
		return fmt.Errorf("no match")
	}
}