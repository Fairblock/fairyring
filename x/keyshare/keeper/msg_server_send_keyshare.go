package keeper

import (
	"context"
	"encoding/hex"
	"fairyring/x/keyshare/types"
	"fmt"
	"strconv"

	distIBE "github.com/FairBlock/DistributedIBE"

	"github.com/drand/kyber"
	bls "github.com/drand/kyber-bls12381"
	"github.com/drand/kyber/pairing"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SendKeyshare registers a new keyshare submited by a validator for a particular height

func (k msgServer) SendKeyshare(goCtx context.Context, msg *types.MsgSendKeyshare) (*types.MsgSendKeyshareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// check if validator is registered
	validatorInfo, found := k.GetValidatorSet(ctx, msg.Creator)

	if !found {
		authorizedAddrInfo, found := k.GetAuthorizedAddress(ctx, msg.Creator)
		if !found || !authorizedAddrInfo.IsAuthorized {
			return nil, types.ErrAddrIsNotValidatorOrAuthorized.Wrap(msg.Creator)
		}

		authorizedByValInfo, found := k.GetValidatorSet(ctx, authorizedAddrInfo.AuthorizedBy)
		if !found {
			return nil, types.ErrAuthorizerIsNotValidator.Wrap(authorizedAddrInfo.AuthorizedBy)
		}
		validatorInfo = authorizedByValInfo

		// If the sender is in the validator set & authorized another address to submit key share
	} else if count := k.GetAuthorizedCount(ctx, msg.Creator); count != 0 {
		return nil, types.ErrAuthorizedAnotherAddress
	}

	if uint64(ctx.BlockHeight()) > msg.BlockHeight {
		return nil, types.ErrInvalidBlockHeight.Wrapf("key share height is lower than the current block height, expected height: %d, got: %d", ctx.BlockHeight(), msg.BlockHeight)
	}

	if msg.BlockHeight > uint64(ctx.BlockHeight())+1 {
		return nil, types.ErrInvalidBlockHeight.Wrapf("key share height is higher than the current block height + 1, expected max height to be: %d, got: %d", ctx.BlockHeight()+1, msg.BlockHeight)
	}

	// Setup
	suite := bls.NewBLS12381Suite()
	ibeID := strconv.FormatUint(msg.BlockHeight, 10)

	commitments, found := k.GetActiveCommitments(ctx)
	if !found {
		return nil, types.ErrCommitmentsNotFound
	}

	commitmentsLen := uint64(len(commitments.Commitments))
	if msg.KeyShareIndex > commitmentsLen {
		return nil, types.ErrInvalidKeyShareIndex.Wrap(fmt.Sprintf("Expect Index within: %d, got: %d", commitmentsLen, msg.KeyShareIndex))
	}

	// Parse the keyshare & commitment then verify it
	_, _, err := parseKeyShareCommitment(suite, msg.Message, commitments.Commitments[msg.KeyShareIndex-1], uint32(msg.KeyShareIndex), ibeID)
	if err != nil {
		k.Logger(ctx).Error(fmt.Sprintf("Error in parsing & verifying keyshare & commitment: %s", err.Error()))
		k.Logger(ctx).Error(fmt.Sprintf("KeyShare is: %v | Commitment is: %v | Index: %d", msg.Message, commitments.Commitments, msg.KeyShareIndex))
		// Invalid Share, slash validator
		var consAddr sdk.ConsAddress

		savedConsAddrByte, err := hex.DecodeString(validatorInfo.ConsAddr)
		if err != nil {
			return nil, err
		}

		err = consAddr.Unmarshal(savedConsAddrByte)
		if err != nil {
			return nil, err
		}

		k.stakingKeeper.Slash(
			ctx, consAddr,
			ctx.BlockHeight()-1,
			types.SlashPower,
			k.SlashFractionWrongKeyshare(ctx),
		)

		return &types.MsgSendKeyshareResponse{
			Creator:             msg.Creator,
			Keyshare:            msg.Message,
			KeyshareIndex:       msg.KeyShareIndex,
			ReceivedBlockHeight: uint64(ctx.BlockHeight()),
			BlockHeight:         msg.BlockHeight,
			Success:             false,
			ErrorMessage:        "Invalid KeyShare",
		}, nil
	}

	keyShare := types.KeyShare{
		Validator:           msg.Creator,
		BlockHeight:         msg.BlockHeight,
		KeyShare:            msg.Message,
		KeyShareIndex:       msg.KeyShareIndex,
		ReceivedTimestamp:   uint64(ctx.BlockTime().Unix()),
		ReceivedBlockHeight: uint64(ctx.BlockHeight()),
	}

	// Save the new keyshare to state
	k.SetKeyShare(ctx, keyShare)

	k.SetLastSubmittedHeight(ctx, msg.Creator, strconv.FormatUint(msg.BlockHeight, 10))

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

	expectedThreshold := sdk.NewDecFromInt(
		sdk.NewInt(types.KeyAggregationThresholdNumerator)).Quo(
		sdk.NewDecFromInt(sdk.NewInt(types.KeyAggregationThresholdDenominator))).MulInt64(
		int64(len(validatorList))).Ceil().TruncateInt64()

	// Emit KeyShare Submitted Event
	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.SendKeyshareEventType,
			sdk.NewAttribute(types.SendKeyshareEventValidator, msg.Creator),
			sdk.NewAttribute(types.SendKeyshareEventKeyshareBlockHeight, strconv.FormatUint(msg.BlockHeight, 10)),
			sdk.NewAttribute(types.SendKeyshareEventReceivedBlockHeight, strconv.FormatInt(ctx.BlockHeight(), 10)),
			sdk.NewAttribute(types.SendKeyshareEventMessage, msg.Message),
			sdk.NewAttribute(types.SendKeyshareEventIndex, strconv.FormatUint(msg.KeyShareIndex, 10)),
		),
	)

	// Check if there is an aggregated key exists
	_, found = k.GetAggregatedKeyShare(ctx, msg.BlockHeight)

	// If there is not enough keyshares to aggregate OR there is already an aggregated key
	// Only continue the code if there is enough keyshare to aggregate & no aggregated key for current height
	if int64(len(stateKeyShares)) < expectedThreshold || found {
		return &types.MsgSendKeyshareResponse{
			Creator:             msg.Creator,
			Keyshare:            msg.Message,
			KeyshareIndex:       msg.KeyShareIndex,
			ReceivedBlockHeight: uint64(ctx.BlockHeight()),
			BlockHeight:         msg.BlockHeight,
			Success:             true,
		}, nil
	}

	// Get the active public key for aggregating
	activePubKey, found := k.pepKeeper.GetActivePubKey(ctx)

	if !found {
		return nil, types.ErrPubKeyNotFound
	}

	// Parse & append all the keyshare for aggregation
	var listOfShares []distIBE.ExtractedKey
	var listOfCommitment []distIBE.Commitment

	for _, eachKeyShare := range stateKeyShares {
		if eachKeyShare.KeyShareIndex > commitmentsLen {
			k.Logger(ctx).Error(fmt.Sprintf("KeyShareIndex: %d should not higher or equals to commitments length: %d", eachKeyShare.KeyShareIndex, commitmentsLen))
			continue
		}
		keyShare, commitment, err := parseKeyShareCommitment(suite, eachKeyShare.KeyShare, commitments.Commitments[eachKeyShare.KeyShareIndex-1], uint32(eachKeyShare.KeyShareIndex), ibeID)
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
	SK, _ := distIBE.AggregateSK(suite, listOfShares, listOfCommitment, []byte(ibeID))
	skByte, err := SK.MarshalBinary()
	if err != nil {
		return nil, err
	}
	skHex := hex.EncodeToString(skByte)

	k.SetAggregatedKeyShare(ctx, types.AggregatedKeyShare{
		Height: msg.BlockHeight,
		Data:   skHex,
	})

	k.SetAggregatedKeyShareLength(ctx, k.GetAggregatedKeyShareLength(ctx)+1)

	k.Logger(ctx).Info(fmt.Sprintf("Aggregated Decryption Key for Block %d: %s", msg.BlockHeight, skHex))

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.KeyShareAggregatedEventType,
			sdk.NewAttribute(types.KeyShareAggregatedEventBlockHeight, strconv.FormatUint(msg.BlockHeight, 10)),
			sdk.NewAttribute(types.KeyShareAggregatedEventData, skHex),
			sdk.NewAttribute(types.KeyShareAggregatedEventPubKey, activePubKey.PublicKey),
		),
	)

	return &types.MsgSendKeyshareResponse{
		Creator:             msg.Creator,
		Keyshare:            msg.Message,
		KeyshareIndex:       msg.KeyShareIndex,
		ReceivedBlockHeight: uint64(ctx.BlockHeight()),
		BlockHeight:         msg.BlockHeight,
		Success:             true,
	}, nil
}

// parseKeyShareCommitment parses a keyshare and extracts the keys and commitment
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
		SK:    newSharePoint,
		Index: index,
	}

	newCommitment := distIBE.Commitment{
		SP:    newCommitmentPoint,
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
