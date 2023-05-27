package keeper

import (
	"bytes"
	"encoding/hex"
	"errors"
	"fairyring/x/pep/types"
	"fmt"
	"strconv"

	enc "DistributedIBE/encryption"

	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmostxTypes "github.com/cosmos/cosmos-sdk/types/tx"
	bls "github.com/drand/kyber-bls12381"
	coretypes "github.com/tendermint/tendermint/rpc/core/types"
)

// ProcessUnconfirmedTxs attempts to decode TXs in the mempool and
// execute the MsgCreateAggregatedKeyShare messages directly from the mempool.
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
			if message.TypeUrl == "/fairyring.pep.MsgCreateAggregatedKeyShare" {
				var msg types.MsgCreateAggregatedKeyShare
				err := msg.Unmarshal(message.Value)
				if err != nil {
					k.Logger(ctx).Error("[ProcessUnconfirmedTxs] Error Parsing Message")
					k.Logger(ctx).Error(err.Error())
					continue
				}

				if err := k.processMessage(ctx, msg); err != nil {
					k.Logger(ctx).Error("[ProcessUnconfirmedTxs] Error processing message")
					k.Logger(ctx).Error(err.Error())
				}
			}
		}
	}
	return nil
}

// processMessage executes a MsgCreateAggregatedKeyShare message. It decrypts the message,
// checks for its authenticity and updates the last registered height of FairyRing
func (k Keeper) processMessage(ctx sdk.Context, msg types.MsgCreateAggregatedKeyShare) error {
	var dummyData = "test data"
	var encryptedDataBytes bytes.Buffer
	var dummyDataBuffer bytes.Buffer
	dummyDataBuffer.Write([]byte(dummyData))
	var decryptedDataBytes bytes.Buffer

	ak, found := k.GetActivePubKey(ctx)
	if !found {
		k.Logger(ctx).Error("Active key not found")
		return errors.New("active key not found")
	}

	keyByte, _ := hex.DecodeString(msg.Data)
	publicKeyByte, _ := hex.DecodeString(ak.PublicKey)

	suite := bls.NewBLS12381Suite()
	publicKeyPoint := suite.G1().Point()
	if err := publicKeyPoint.UnmarshalBinary(publicKeyByte); err != nil {
		return err
	}

	skPoint := suite.G2().Point()
	if err := skPoint.UnmarshalBinary(keyByte); err != nil {
		return err
	}

	processHeightStr := strconv.FormatUint(msg.Height, 10)
	if err := enc.Encrypt(publicKeyPoint, []byte(processHeightStr), &encryptedDataBytes, &dummyDataBuffer); err != nil {
		return err
	}

	err := enc.Decrypt(publicKeyPoint, skPoint, &decryptedDataBytes, &encryptedDataBytes)
	if err != nil {
		k.Logger(ctx).Error("Decryption error when verifying aggregated keyshare")
		k.Logger(ctx).Error(err.Error())
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.KeyShareVerificationType,
				sdk.NewAttribute(types.KeyShareVerificationCreator, msg.Creator),
				sdk.NewAttribute(types.KeyShareVerificationHeight, strconv.FormatUint(msg.Height, 10)),
				sdk.NewAttribute(types.KeyShareVerificationReason, err.Error()),
			),
		)
		return err
	}

	if decryptedDataBytes.String() != dummyData {
		k.Logger(ctx).Error("Decrypted data does not match original data")
		k.Logger(ctx).Error(err.Error())
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.KeyShareVerificationType,
				sdk.NewAttribute(types.KeyShareVerificationCreator, msg.Creator),
				sdk.NewAttribute(types.KeyShareVerificationHeight, strconv.FormatUint(msg.Height, 10)),
				sdk.NewAttribute(types.KeyShareVerificationReason, "decrypted data does not match original data"),
			),
		)
		return err
	}

	k.SetAggregatedKeyShare(ctx, types.AggregatedKeyShare{
		Height:    msg.Height,
		Data:      msg.Data,
		Creator:   msg.Creator,
		PublicKey: ak.PublicKey,
	})

	latestHeight, err := strconv.ParseUint(k.GetLatestHeight(ctx), 10, 64)
	if err != nil {
		latestHeight = 0
	}

	if latestHeight < msg.Height {
		k.SetLatestHeight(ctx, strconv.FormatUint(msg.Height, 10))
	}

	k.Logger(ctx).Info(fmt.Sprintf("[ProcessUnconfirmedTxs] Aggregated Key Added, height: %d", msg.Height))

	return nil
}
