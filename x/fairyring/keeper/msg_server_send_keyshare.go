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

func parseKeyShareCommitment(
	suite pairing.Suite,
	keyShareHex string,
	commitmentHex string,
	index uint32,
	id string,
) (*distIBE.ExtractedKey, *distIBE.Commitment, error) {
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

	newExtractedKey := distIBE.ExtractedKey{
		Sk:    newSharePoint,
		Index: index,
	}

	newCommitment := distIBE.Commitment{
		Sp:    newCommitmentPoint,
		Index: index,
	}

	hG2, ok := suite.G2().Point().(kyber.HashablePoint)
	if !ok {
		return nil, nil, types.ErrUnableToVerifyShare
	}

	Qid := hG2.Hash([]byte(id))

	if !distIBE.VerifyShare(suite, newCommitment, newExtractedKey, Qid) {
		return nil, nil, types.ErrInvalidShare
	}

	return &newExtractedKey, &newCommitment, nil
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

	pubKeyID, found := k.GetPubKeyID(ctx, msg.BlockHeight)
	if !found {
		return nil, types.ErrPubKeyIDNotFound
	}

	// Setup
	suite := bls.NewBLS12381Suite()

	// Parse the keyshare & commitment then verify it
	_, _, err := parseKeyShareCommitment(suite, msg.Message, msg.Commitment, uint32(msg.KeyShareIndex), pubKeyID.IbeID)
	if err != nil {
		return nil, err
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

	// Save the new keyshare to state
	k.SetKeyShare(ctx, keyShare)

	validatorList := k.GetAllValidatorSet(ctx)

	// Get all the keyshares for the provided block height in state
	var stateKeyShares []types.KeyShare

	for _, eachValidator := range validatorList {
		eachKeyShare, found := k.GetKeyShare(ctx, eachValidator.Validator, msg.BlockHeight)
		if !found {
			continue
		}
		stateKeyShares = append(stateKeyShares, eachKeyShare)
	}

	// See if there is enough keyshares to aggregate
	if len(stateKeyShares) < types.KeyAggregationThreshold {
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

	// Parse & append all the keyshare for aggregation
	var listOfShares []distIBE.ExtractedKey
	var listOfCommitment []distIBE.Commitment

	for _, eachKeyShare := range stateKeyShares {
		keyShare, commitment, err := parseKeyShareCommitment(suite, eachKeyShare.KeyShare, eachKeyShare.Commitment, uint32(eachKeyShare.KeyShareIndex), pubKeyID.IbeID)
		if err != nil {
			k.Logger(ctx).Error(err.Error())
			continue
		}

		listOfShares = append(
			listOfShares,
			*keyShare,
		)
		listOfCommitment = append(
			listOfCommitment,
			*commitment,
		)
	}

	// Aggregate key
	SK, _ := distIBE.AggregateSK(suite, listOfShares, listOfCommitment, []byte(pubKeyID.IbeID))
	skByte, err := SK.MarshalBinary()
	if err != nil {
		return nil, err
	}
	skHex := hex.EncodeToString(skByte)

	_, found = k.GetAggregatedKeyShare(ctx, msg.BlockHeight)

	k.SetAggregatedKeyShare(ctx, types.AggregatedKeyShare{
		Height: msg.BlockHeight,
		Data:   skHex,
	})

	if !found {
		k.SetAggregatedKeyShareLength(ctx, k.GetAggregatedKeyShareLength(ctx)+1)
	}

	k.Logger(ctx).Info(fmt.Sprintf("Aggregated Decryption Key for Block %d: %s", msg.BlockHeight, skHex))

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.KeyShareAggregatedEventType,
			sdk.NewAttribute(types.KeyShareAggregatedEventBlockHeight, strconv.FormatUint(msg.BlockHeight, 10)),
			sdk.NewAttribute(types.KeyShareAggregatedEventData, skHex),
			sdk.NewAttribute(types.KeyShareAggregatedEventPubKey, pubKeyID.PublicKey),
		),
	)

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.SendKeyshareEventType,
			sdk.NewAttribute(types.SendKeyshareEventValidator, msg.Creator),
			sdk.NewAttribute(types.SendKeyshareEventKeyshareBlockHeight, strconv.FormatUint(msg.BlockHeight, 10)),
			sdk.NewAttribute(types.SendKeyshareEventReceivedBlockHeight, strconv.FormatInt(ctx.BlockHeight(), 10)),
			sdk.NewAttribute(types.SendKeyshareEventMessage, msg.Message),
			sdk.NewAttribute(types.SendKeyshareEventCommitment, msg.Commitment),
			sdk.NewAttribute(types.SendKeyshareEventIndex, strconv.FormatUint(msg.KeyShareIndex, 10)),
		),
	)

	return &types.MsgSendKeyshareResponse{
		Creator:             msg.Creator,
		Keyshare:            msg.Message,
		Commitment:          msg.Commitment,
		KeyshareIndex:       msg.KeyShareIndex,
		ReceivedBlockHeight: uint64(ctx.BlockHeight()),
		BlockHeight:         msg.BlockHeight,
	}, nil
}
