package keeper

import (
	"context"
	"encoding/hex"
	"fmt"
	"strconv"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/sirupsen/logrus"
	_ "github.com/sirupsen/logrus"
	"github.com/tuneinsight/lattigo/v6/core/rlwe"
	"github.com/tuneinsight/lattigo/v6/schemes/ckks"
)

func (k msgServer) SubmitPksShare(goCtx context.Context, msg *types.MsgSubmitPksShare) (*types.MsgSubmitPksShareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Prevent repeated shares
	if k.GetPKSShare(ctx, msg.Handle, msg.Creator) != nil {
		return &types.MsgSubmitPksShareResponse{}, nil
	}
	// Prevent regeneration of pks
	if k.GetAggregatedPKSKey(ctx, msg.Handle) != nil {
		return &types.MsgSubmitPksShareResponse{}, nil
	}
	shareByte,_ := hex.DecodeString(msg.ShareData)
	k.StorePKSShare(ctx, msg.Handle, msg.Creator, shareByte)
	// Check if threshold is met
	prefixKey := fmt.Sprintf("PKS:%s:", msg.Handle)
	if k.IsThresholdMet(ctx, prefixKey) {

		ct, err := k.AggregatePKSShares(ctx, msg.Handle)
		if err != nil {
			return nil, types.ErrAggregation.Wrap("PKS aggregation failed")
		}
		if k.IsDecryptionHandle(ctx,msg.Handle){
			encoder := ckks.NewEncoder(k.params)
			sk_str,_ := k.GetSecretKey(ctx,msg.Handle)
			sk_byte,_ := hex.DecodeString(sk_str)
			var sk rlwe.SecretKey
			sk.UnmarshalBinary(sk_byte)
			logrus.Info("sk: ",sk_str)
			decryptor := ckks.NewDecryptor(k.params, &sk)

			// Decrypt the ciphertext
			decrypted := decryptor.DecryptNew(ct)
			decoded := make([]complex128, 1)
			encoder.Decode(decrypted, decoded)
			plaintext := real(decoded[0])
			var plaintext_str string = strconv.FormatFloat(plaintext, 'f', -2, 64)
			logrus.Info("dec res: ", plaintext)
			ctx.EventManager().EmitEvent(
				sdk.NewEvent("DecryptionResult",
					sdk.NewAttribute("plaintext", plaintext_str),
					sdk.NewAttribute("handle", msg.Handle),
				),
			)
		} else{
			ct_bytes,_ := ct.MarshalBinary()
			ct_string := hex.EncodeToString(ct_bytes)
			logrus.Info("re-enc res: ", ct_string)
			ctx.EventManager().EmitEvent(
				sdk.NewEvent("ReEncryptionResult",
					sdk.NewAttribute("ct", ct_string),
					sdk.NewAttribute("handle", msg.Handle),
				),
			)
		}
	

	}

	return &types.MsgSubmitPksShareResponse{}, nil
}
