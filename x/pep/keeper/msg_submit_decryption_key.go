package keeper

import (
	"bytes"
	"context"
	"encoding/hex"
	"errors"
	"fmt"
	"strconv"

	"github.com/Fairblock/fairyring/x/pep/types"

	enc "github.com/FairBlock/DistributedIBE/encryption"
	sdk "github.com/cosmos/cosmos-sdk/types"
	bls "github.com/drand/kyber-bls12381"
)

func (k msgServer) SubmitDecryptionKey(
	goCtx context.Context,
	msg *types.MsgSubmitDecryptionKey,
) (*types.MsgSubmitDecryptionKeyResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	params := k.GetParams(ctx)
	if params.IsSourceChain {
		return nil, errors.New("submission of external decryption keyshare not permitted on source chain")
	}

	var trusted = false

	for _, trustedAddr := range k.TrustedAddresses(ctx) {
		if trustedAddr == msg.Creator {
			trusted = true
			break
		}
	}

	if !trusted {
		return nil, errors.New("msg not from trusted source")
	}

	var dummyData = "test data"
	var encryptedDataBytes bytes.Buffer
	var dummyDataBuffer bytes.Buffer
	dummyDataBuffer.Write([]byte(dummyData))
	var decryptedDataBytes bytes.Buffer

	ak, found := k.GetActivePubkey(ctx)
	if !found {
		k.Logger().Error("Active key not found")
		return nil, errors.New("active key not found")
	}

	if len(ak.PublicKey) == 0 {
		k.Logger().Error("Active key not found")
		return nil, errors.New("active key not found")
	}

	keyByte, _ := hex.DecodeString(msg.Data)
	publicKeyByte, _ := hex.DecodeString(ak.PublicKey)

	suite := bls.NewBLS12381Suite()
	publicKeyPoint := suite.G1().Point()
	if err := publicKeyPoint.UnmarshalBinary(publicKeyByte); err != nil {
		return nil, err
	}

	skPoint := suite.G2().Point()
	if err := skPoint.UnmarshalBinary(keyByte); err != nil {
		return nil, err
	}

	processHeightStr := strconv.FormatUint(msg.Height, 10)
	if err := enc.Encrypt(publicKeyPoint, []byte(processHeightStr), &encryptedDataBytes, &dummyDataBuffer); err != nil {
		return nil, err
	}

	err := enc.Decrypt(publicKeyPoint, skPoint, &decryptedDataBytes, &encryptedDataBytes)
	if err != nil {
		k.Logger().Error("error when verifying decryption key")
		k.Logger().Error(err.Error())
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.DecryptionKeyVerificationType,
				sdk.NewAttribute(types.DecryptionKeyVerificationCreator, msg.Creator),
				sdk.NewAttribute(types.DecryptionKeyVerificationHeight, strconv.FormatUint(msg.Height, 10)),
				sdk.NewAttribute(types.DecryptionKeyVerificationReason, err.Error()),
			),
		)
		return nil, err
	}

	if decryptedDataBytes.String() != dummyData {
		k.Logger().Error("Decrypted data does not match original data")
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.DecryptionKeyVerificationType,
				sdk.NewAttribute(types.DecryptionKeyVerificationCreator, msg.Creator),
				sdk.NewAttribute(types.DecryptionKeyVerificationHeight, strconv.FormatUint(msg.Height, 10)),
				sdk.NewAttribute(types.DecryptionKeyVerificationReason, "decrypted data does not match original data"),
			),
		)
		return nil, err
	}

	k.SetDecryptionKey(ctx, types.DecryptionKey{
		Height:  msg.Height,
		Data:    msg.Data,
		Creator: msg.Creator,
	})

	latestHeight, err := strconv.ParseUint(k.GetLatestHeight(ctx), 10, 64)
	if err != nil {
		latestHeight = 0
	}

	if latestHeight < msg.Height {
		k.SetLatestHeight(ctx, strconv.FormatUint(msg.Height, 10))
	}

	k.Logger().Info(fmt.Sprintf("[ProcessUnconfirmedTxs] Decryption Key Added, height: %d", msg.Height))

	return &types.MsgSubmitDecryptionKeyResponse{}, nil
}
