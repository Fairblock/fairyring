package keeper

import (
	distIBE "DistributedIBE"
	"context"
	"encoding/hex"
	"fairyring/x/fairyring/types"
	"fmt"
	"github.com/drand/kyber"
	bls "github.com/drand/kyber-bls12381"
	"github.com/drand/kyber/pairing"
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func parseKeyShareCommitment(suite pairing.Suite, keyShareHex string, commitmentHex string) (kyber.Point, kyber.Point, error) {
	newByteKey, err := hex.DecodeString(keyShareHex)
	if err != nil {
		return nil, nil, types.ErrDecodingKeyShare.Wrap(err.Error())
	}

	newSharePoint := suite.G2().Point()
	err = newSharePoint.UnmarshalBinary(newByteKey)
	if err != nil {
		return nil, nil, types.ErrUnmarshallingKeyShare.Wrap(err.Error())
	}

	newByteCommitment, err := hex.DecodeString(commitmentHex)
	if err != nil {
		return nil, nil, types.ErrDecodingCommitment.Wrap(err.Error())
	}

	newCommitmentPoint := suite.G1().Point()
	err = newCommitmentPoint.UnmarshalBinary(newByteCommitment)
	if err != nil {
		return nil, nil, types.ErrUnmarshallingCommitment.Wrap(err.Error())
	}

	return newSharePoint, newCommitmentPoint, nil
}

func (k msgServer) SendKeyshare(goCtx context.Context, msg *types.MsgSendKeyshare) (*types.MsgSendKeyshareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// check if validator is registered
	_, found := k.GetValidatorSet(ctx, msg.Creator)

	if !found {
		return nil, types.ErrValidatorNotRegistered.Wrap(msg.Creator)
	}

	//if msg.BlockHeight < uint64(ctx.BlockHeight()) {
	//	return nil, types.ErrInvalidBlockHeight
	//}

	suite := bls.NewBLS12381Suite()

	newPoint, newCommitmentPoint, err := parseKeyShareCommitment(suite, msg.Message, msg.Commitment)
	if err != nil {
		return nil, err
	}

	validatorList := k.GetAllValidatorSet(ctx)

	listOfShares := []distIBE.ExtractedKey{
		{
			Sk:    newPoint,
			Index: uint32(msg.KeyShareIndex),
		},
	}
	listOfCommitment := []distIBE.Commitment{
		{
			Sp:    newCommitmentPoint,
			Index: uint32(msg.KeyShareIndex),
		},
	}

	for _, eachValidator := range validatorList {
		eachKeyShare, found := k.GetKeyShare(ctx, eachValidator.Validator, msg.BlockHeight)
		if !found {
			continue
		}

		kp, commitmentKp, err := parseKeyShareCommitment(suite, eachKeyShare.KeyShare, eachKeyShare.Commitment)
		if err != nil {
			k.Logger(ctx).Error(err.Error())
			continue
		}

		listOfShares = append(
			listOfShares,
			distIBE.ExtractedKey{
				Sk:    kp,
				Index: uint32(eachKeyShare.KeyShareIndex),
			},
		)
		listOfCommitment = append(
			listOfCommitment,
			distIBE.Commitment{
				Sp:    commitmentKp,
				Index: uint32(eachKeyShare.KeyShareIndex),
			},
		)
	}

	keyShare := types.KeyShare{
		Validator:           msg.Creator,
		BlockHeight:         msg.BlockHeight,
		KeyShare:            msg.Message,
		Commitment:          msg.Commitment,
		KeyShareIndex:       msg.KeyShareIndex,
		ReceivedTimestamp:   uint64(ctx.BlockTime().Unix()),
		ReceivedBlockHeight: uint64(ctx.BlockHeight()),
	}

	k.SetKeyShare(ctx, keyShare)

	if len(listOfCommitment) > 0 && len(listOfShares) > 0 {
		SK, _ := distIBE.AggregateSK(suite, listOfShares, listOfCommitment, []byte(types.IBEId))
		k.Logger(ctx).Info(fmt.Sprintf("Aggregated Decryption Key: %s", SK.String()))
	}

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.SendKeyshareEventType,
			sdk.NewAttribute(types.SendKeyshareEventValidator, msg.Creator),
			sdk.NewAttribute(types.SendKeyshareEventKeyshareBlockHeight, strconv.FormatUint(msg.BlockHeight, 10)),
			sdk.NewAttribute(types.SendKeyshareEventReceivedBlockHeight, strconv.FormatInt(ctx.BlockHeight(), 10)),
			sdk.NewAttribute(types.SendKeyshareEventMessage, msg.Message),
			sdk.NewAttribute(types.SendKeyshareEventCommitment, msg.Commitment),
			sdk.NewAttribute(types.SendKeyshareEventIndex, strconv.FormatUint(msg.KeyShareIndex, 10)),
		))

	return &types.MsgSendKeyshareResponse{
		Creator:             msg.Creator,
		Keyshare:            msg.Message,
		Commitment:          msg.Commitment,
		KeyshareIndex:       msg.KeyShareIndex,
		ReceivedBlockHeight: uint64(ctx.BlockHeight()),
		BlockHeight:         msg.BlockHeight,
	}, nil
}
