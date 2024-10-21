package keeper

import (
	"context"
	"encoding/hex"
	"fmt"
	"strconv"

	"cosmossdk.io/math"
	distIBE "github.com/FairBlock/DistributedIBE"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	peptypes "github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/telemetry"
	"github.com/hashicorp/go-metrics"

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
	if msg.KeyshareIndex > commitmentsLen {
		return nil, types.ErrInvalidKeyshareIndex.Wrap(fmt.Sprintf("Expect Index within: %d, got: %d", commitmentsLen, msg.KeyshareIndex))
	}

	// Parse the keyshare & commitment then verify it
	_, _, err := parseKeyshareCommitment(suite, msg.Message, commitments.Commitments[msg.KeyshareIndex-1], uint32(msg.KeyshareIndex), ibeID)
	if err != nil {
		defer telemetry.IncrCounter(1, types.KeyTotalInvalidKeyshareSubmitted)
		k.Logger().Error(fmt.Sprintf("Error in parsing & verifying keyshare & commitment: %s", err.Error()))
		k.Logger().Error(fmt.Sprintf("KeyShare is: %v | Commitment is: %v | Index: %d", msg.Message, commitments.Commitments, msg.KeyshareIndex))
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

		k.slashingKeeper.Slash(
			ctx, consAddr,
			k.SlashFractionWrongKeyshare(ctx),
			types.SlashPower,
			ctx.BlockHeight()-1,
		)

		return &types.MsgSendKeyshareResponse{
			Creator:             msg.Creator,
			Keyshare:            msg.Message,
			KeyshareIndex:       msg.KeyshareIndex,
			ReceivedBlockHeight: uint64(ctx.BlockHeight()),
			BlockHeight:         msg.BlockHeight,
			Success:             false,
			ErrorMessage:        "Invalid KeyShare",
		}, nil
	}

	keyshare := types.Keyshare{
		Validator:           msg.Creator,
		BlockHeight:         msg.BlockHeight,
		Keyshare:            msg.Message,
		KeyshareIndex:       msg.KeyshareIndex,
		ReceivedTimestamp:   uint64(ctx.BlockTime().Unix()),
		ReceivedBlockHeight: uint64(ctx.BlockHeight()),
	}

	// Save the new keyshare to state
	k.SetKeyshare(ctx, keyshare)

	k.SetLastSubmittedHeight(ctx, msg.Creator, strconv.FormatUint(msg.BlockHeight, 10))

	validatorList := k.GetAllValidatorSet(ctx)

	// Get all the keyshares for the provided block height in state
	var stateKeyshares []types.Keyshare

	for _, eachValidator := range validatorList {
		eachKeyshare, found := k.GetKeyshare(ctx, eachValidator.Validator, msg.BlockHeight)
		if !found {
			continue
		}
		stateKeyshares = append(stateKeyshares, eachKeyshare)
	}

	// Get the active public key for aggregating
	activePubkey, found := k.GetActivePubkey(ctx)

	if !found {
		return nil, types.ErrPubkeyNotFound
	}

	expectedThreshold := math.LegacyNewDecFromInt(
		math.NewInt(types.KeyAggregationThresholdNumerator)).Quo(
		math.LegacyNewDecFromInt(math.NewInt(types.KeyAggregationThresholdDenominator))).MulInt64(
		int64(activePubkey.NumberOfValidators)).Ceil().TruncateInt64()

	// Emit KeyShare Submitted Event
	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.SendKeyshareEventType,
			sdk.NewAttribute(types.SendKeyshareEventValidator, msg.Creator),
			sdk.NewAttribute(types.SendKeyshareEventKeyshareBlockHeight, strconv.FormatUint(msg.BlockHeight, 10)),
			sdk.NewAttribute(types.SendKeyshareEventReceivedBlockHeight, strconv.FormatInt(ctx.BlockHeight(), 10)),
			sdk.NewAttribute(types.SendKeyshareEventMessage, msg.Message),
			sdk.NewAttribute(types.SendKeyshareEventIndex, strconv.FormatUint(msg.KeyshareIndex, 10)),
		),
	)

	// Check if decryption key already exists
	decryptionKeyData, found := k.GetDecryptionKey(ctx, msg.BlockHeight)

	// If there is not enough keyshares to aggregate OR there is already a decryption key
	// Only continue the code if there is enough keyshare to aggregate &
	// no decryption key for current height
	if int64(len(stateKeyshares)) < expectedThreshold || found {
		defer telemetry.IncrCounterWithLabels(
			[]string{types.KeyTotalValidKeyshareSubmitted},
			1,
			[]metrics.Label{telemetry.NewLabel("aggrkey", decryptionKeyData.Data)},
		)
		return &types.MsgSendKeyshareResponse{
			Creator:             msg.Creator,
			Keyshare:            msg.Message,
			KeyshareIndex:       msg.KeyshareIndex,
			ReceivedBlockHeight: uint64(ctx.BlockHeight()),
			BlockHeight:         msg.BlockHeight,
			Success:             true,
		}, nil
	}

	// Parse & append all the keyshare for aggregation
	var listOfShares []distIBE.ExtractedKey
	var listOfCommitment []distIBE.Commitment

	for _, eachKeyshare := range stateKeyshares {
		if eachKeyshare.KeyshareIndex > commitmentsLen {
			k.Logger().Error(fmt.Sprintf("KeyshareIndex: %d should not higher or equals to commitments length: %d", eachKeyshare.KeyshareIndex, commitmentsLen))
			continue
		}
		keyshare, commitment, err := parseKeyshareCommitment(suite, eachKeyshare.Keyshare, commitments.Commitments[eachKeyshare.KeyshareIndex-1], uint32(eachKeyshare.KeyshareIndex), ibeID)
		if err != nil {
			k.Logger().Error(err.Error())
			continue
		}

		listOfShares = append(
			listOfShares,
			*keyshare,
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

	k.SetDecryptionKey(ctx, types.DecryptionKey{
		Height: msg.BlockHeight,
		Data:   skHex,
	})

	k.SetDecryptionKeyLength(ctx, k.GetDecryptionKeyLength(ctx)+1)

	k.Logger().Info(fmt.Sprintf("Aggregated Decryption Key for Block %d: %s", msg.BlockHeight, skHex))

	defer telemetry.IncrCounterWithLabels([]string{types.KeyTotalValidKeyshareSubmitted}, 1, []metrics.Label{telemetry.NewLabel("aggrkey", skHex)})

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.KeyshareAggregatedEventType,
			sdk.NewAttribute(types.KeyshareAggregatedEventBlockHeight, strconv.FormatUint(msg.BlockHeight, 10)),
			sdk.NewAttribute(types.KeyshareAggregatedEventData, skHex),
			sdk.NewAttribute(types.KeyshareAggregatedEventPubkey, activePubkey.PublicKey),
		),
	)

	k.pepKeeper.SetDecryptionKey(
		ctx,
		peptypes.DecryptionKey{
			Height: msg.BlockHeight,
			Data:   skHex,
		},
	)

	latestHeight, err := strconv.ParseUint(k.pepKeeper.GetLatestHeight(ctx), 10, 64)
	if err != nil {
		latestHeight = 0
	}

	if latestHeight < msg.BlockHeight {
		k.pepKeeper.SetLatestHeight(ctx, strconv.FormatUint(msg.BlockHeight, 10))
	}

	k.Logger().Info(fmt.Sprintf("[ProcessUnconfirmedTxs] Decryption Key Added, height: %d", msg.BlockHeight))

	return &types.MsgSendKeyshareResponse{
		Creator:             msg.Creator,
		Keyshare:            msg.Message,
		KeyshareIndex:       msg.KeyshareIndex,
		ReceivedBlockHeight: uint64(ctx.BlockHeight()),
		BlockHeight:         msg.BlockHeight,
		Success:             true,
	}, nil
}

// parseKeyshareCommitment parses a keyshare and extracts the keys and commitment
func parseKeyshareCommitment(
	suite pairing.Suite,
	keyshareHex string,
	commitmentHex string,
	index uint32,
	id string,
) (*distIBE.ExtractedKey, *distIBE.Commitment, error) {
	newByteKey, err := hex.DecodeString(keyshareHex)
	if err != nil {
		return nil, nil, types.ErrDecodingKeyshare.Wrap(err.Error())
	}

	newSharePoint := suite.G2().Point()
	err = newSharePoint.UnmarshalBinary(newByteKey)
	if err != nil {
		return nil, nil, types.ErrUnmarshallingKeyshare.Wrap(err.Error())
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
