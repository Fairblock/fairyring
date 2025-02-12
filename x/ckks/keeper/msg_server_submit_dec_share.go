package keeper

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"math/big"
	"strconv"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/sirupsen/logrus"

	"github.com/tuneinsight/lattigo/v6/core/rlwe"
	"github.com/tuneinsight/lattigo/v6/multiparty"
	"github.com/tuneinsight/lattigo/v6/multiparty/mpckks"
	"github.com/tuneinsight/lattigo/v6/schemes/ckks"
)

func (k msgServer) SubmitDecShare(goCtx context.Context, msg *types.MsgSubmitDecShare) (*types.MsgSubmitDecShareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	shareBytes, err := hex.DecodeString(msg.ShareDataPublic)
	if err != nil {
		return nil, fmt.Errorf("invalid share data encoding: %v", err)
	}

	var publicShare multiparty.KeySwitchShare
	if err := publicShare.UnmarshalBinary(shareBytes); err != nil {
		return nil, fmt.Errorf("failed to unmarshal public share: %v", err)
	}

	k.SetDecSharePublic(ctx, msg.Handle, msg.Creator, publicShare)
	k.SetDecShareSecret(ctx, msg.Handle, msg.Creator, msg.ShareDataSecret)

	newCount := k.IncrementDecShareCount(ctx, msg.Handle)
	threshold := k.GetThreshold(ctx)

	if newCount == uint64(k.GetThreshold(ctx)) {
		if err := k.AggregateAndFinalize(ctx, msg.Handle); err != nil {
			return nil, fmt.Errorf("failed to aggregate and finalize: %v", err)
		}
	}

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(
			"decryption_share_submitted",
			sdk.NewAttribute("handle", msg.Handle),
			sdk.NewAttribute("creator", msg.Creator),
			sdk.NewAttribute("current_count", fmt.Sprintf("%d", newCount)),
			sdk.NewAttribute("threshold", fmt.Sprintf("%d", threshold)),
		),
	)

	return &types.MsgSubmitDecShareResponse{}, nil
}

func (k msgServer) AggregateAndFinalize(ctx sdk.Context, handle string) error {

	ctString, _ := k.GetCiphertext(ctx, handle)
	ctBytes, err := hex.DecodeString(ctString)
	if err != nil {
		return err
	}
	var ct rlwe.Ciphertext
	if err = ct.UnmarshalBinary(ctBytes); err != nil {
		return err
	}

	e2s, err := mpckks.NewEncToShareProtocol(k.params, k.params.Xe())
	if err != nil {
		return fmt.Errorf("failed to create EncToShare protocol: %v", err)
	}

	shares := k.GetShares(ctx, (handle + "public/"))
	if len(shares) == 0 {
		return fmt.Errorf("no shares found for handle %s", handle)
	}

	aggregatedShare := e2s.AllocateShare(ct.Level())
	firstShare := true

	for _, share := range shares {
		if firstShare {
			aggregatedShare.UnmarshalBinary(share)
			firstShare = false
			continue
		}
		var s multiparty.KeySwitchShare
		s.UnmarshalBinary(share)
		e2s.AggregateShares(aggregatedShare, s, &aggregatedShare)
	}

	combinedShare := mpckks.NewAdditiveShare(k.params, ct.LogSlots())

	secretShares := k.GetShares(ctx, (handle + "secret/"))

	for _, share := range secretShares {
		s, _ := Deserialize(string(share))

		for j := range combinedShare.Value {
			combinedShare.Value[j].Add(
				combinedShare.Value[j],
				s.Value[j],
			)
		}
	}

	e2s.GetShare(&combinedShare, aggregatedShare, &ct, &combinedShare)

	ptOut := ckks.NewPlaintext(k.params, ct.Level())
	ptOut.IsNTT = false
	ptOut.Scale = ct.Scale

	ringQ := k.params.RingQ()
	ringQ.AtLevel(ptOut.Level()).SetCoefficientsBigint(combinedShare.Value, ptOut.Value)
	decoded := make([]complex128, 1)
	encoder := ckks.NewEncoder(k.params)
	encoder.Decode(ptOut, decoded)
	plaintext := real(decoded[0])
	var plaintext_str string = strconv.FormatFloat(plaintext, 'f', -2, 64)
	logrus.Info("decryption result: ", plaintext_str)

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(
			"DecryptionResult",
			sdk.NewAttribute("plaintext", plaintext_str),
			sdk.NewAttribute("handle", handle),
		),
	)

	return nil
}

func Deserialize(serialized string) (multiparty.AdditiveShareBigint, error) {

	var stringValues []string
	if err := json.Unmarshal([]byte(serialized), &stringValues); err != nil {
		return multiparty.AdditiveShareBigint{}, err
	}
	var share multiparty.AdditiveShareBigint

	share.Value = make([]*big.Int, len(stringValues))
	for i, str := range stringValues {
		v := new(big.Int)
		v.SetString(str, 10)
		share.Value[i] = v
	}
	return share, nil
}
