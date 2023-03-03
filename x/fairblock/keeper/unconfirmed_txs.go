package keeper

import (
	"bytes"
	"encoding/binary"
	"encoding/hex"
	"fairyring/x/fairblock/types"
	"fmt"
	"strconv"

	enc "DistributedIBE/encryption"

	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmostxTypes "github.com/cosmos/cosmos-sdk/types/tx"
	bls "github.com/drand/kyber-bls12381"
	coretypes "github.com/tendermint/tendermint/rpc/core/types"
)

func (k Keeper) ProcessUnconfirmedTxs(ctx sdk.Context, utxs *coretypes.ResultUnconfirmedTxs) error {
	for _, utx := range utxs.Txs {
		var decodedTx cosmostxTypes.Tx
		err := decodedTx.Unmarshal(utx)
		if err != nil {
			k.Logger(ctx).Error("[ProcessUnconfirmedTxs] Error Parsing Unconfirmed Tx")
			k.Logger(ctx).Error(err.Error())
			continue
		}

		for _, message := range decodedTx.Body.Messages {
			if message.TypeUrl == "/fairyring.fairblock.MsgCreateAggregatedKeyShare" {
				var msg types.MsgCreateAggregatedKeyShare
				err := msg.Unmarshal(message.Value)
				if err != nil {
					k.Logger(ctx).Error("[ProcessUnconfirmedTxs] Error Parsing Message")
					k.Logger(ctx).Error(err.Error())
					continue
				}

				k.processMessage(ctx, msg)
			}
		}
	}
	return nil
}

func (k Keeper) processMessage(ctx sdk.Context, msg types.MsgCreateAggregatedKeyShare) {
	dummyTX := types.EncryptedTx{
		TargetHeight: msg.Height,
		Data:         msg.Data,
		Creator:      msg.Creator,
	}

	fmt.Println(dummyTX)

	var dummData = "test data"
	var encryptedDataBytes bytes.Buffer
	var dummyDataBuffer bytes.Buffer
	dummyDataBuffer.Write([]byte(dummData))
	var decryptedDataBytes bytes.Buffer

	keyByte, _ := hex.DecodeString(msg.Data)
	publicKeyByte, _ := hex.DecodeString(msg.PublicKey)

	suite := bls.NewBLS12381Suite()
	publicKeyPoint := suite.G1().Point()
	publicKeyPoint.UnmarshalBinary(publicKeyByte)
	skPoint := suite.G2().Point()
	skPoint.UnmarshalBinary(keyByte)

	id := make([]byte, 8)
	binary.LittleEndian.PutUint64(id, msg.Height)
	enc.Encrypt(publicKeyPoint, id, &encryptedDataBytes, &dummyDataBuffer)

	err := enc.Decrypt(publicKeyPoint, skPoint, &decryptedDataBytes, &encryptedDataBytes)
	if err != nil {
		k.Logger(ctx).Error("Error verifying aggregated keyshare")
		k.Logger(ctx).Error(err.Error())
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.KeyShareVerificationType,
				sdk.NewAttribute(types.KeyShareVerificationCreator, msg.Creator),
				sdk.NewAttribute(types.KeyShareVerificationHeight, strconv.FormatUint(msg.Height, 10)),
				sdk.NewAttribute(types.KeyShareVerificationReason, err.Error()),
			),
		)
		return
	}

	if decryptedDataBytes.String() != dummData {
		k.Logger(ctx).Error("Error verifying aggregated keyshare")
		k.Logger(ctx).Error(err.Error())
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.KeyShareVerificationType,
				sdk.NewAttribute(types.KeyShareVerificationCreator, msg.Creator),
				sdk.NewAttribute(types.KeyShareVerificationHeight, strconv.FormatUint(msg.Height, 10)),
				sdk.NewAttribute(types.KeyShareVerificationReason, "decrypted data does not match encrypted data"),
			),
		)
		return
	}

	k.SetAggregatedKeyShare(ctx, types.AggregatedKeyShare{
		Height:  msg.Height,
		Data:    msg.Data,
		Creator: msg.Creator,
	})

	latestHeight, err := strconv.ParseUint(k.GetLatestHeight(ctx), 10, 64)
	if err != nil { // latest height is empty, set it to 0
		latestHeight = 0
	}

	if latestHeight < msg.Height {
		k.SetLatestHeight(ctx, strconv.FormatUint(msg.Height, 10))
	}

	k.Logger(ctx).Info(fmt.Sprintf("[ProcessUnconfirmedTxs] Aggregated Key Added, height: %d", msg.Height))
}
