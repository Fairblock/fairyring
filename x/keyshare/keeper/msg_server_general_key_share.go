package keeper

import (
	"context"
	"encoding/hex"
	"fmt"

	distIBE "github.com/FairBlock/DistributedIBE"
	//"github.com/sirupsen/logrus"
	//"github.com/sirupsen/logrus"

	//clienttypes "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	"strconv"

	bls "github.com/drand/kyber-bls12381"

	// "time"
	conditionalenctypes "fairyring/x/conditionalenc/types"
	"fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

const (
	PrivateGovIdentity = "private-gov-identity"
)

var SupportedIDTypes = []string{PrivateGovIdentity}

func (k msgServer) CreateGeneralKeyShare(goCtx context.Context, msg *types.MsgCreateGeneralKeyShare) (*types.MsgCreateGeneralKeyShareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// check if validator is registered
	validatorInfo, found := k.GetValidatorSet(ctx, msg.Creator)
//logrus.Info("****************************************************************************************************************88", found)
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



	



	// Setup
	suite := bls.NewBLS12381Suite()

	commitments, found := k.GetActiveCommitments(ctx)
	if !found {
		return nil, types.ErrCommitmentsNotFound
	}

	commitmentsLen := uint64(len(commitments.Commitments))
	if msg.KeyShareIndex > commitmentsLen {
		return nil, types.ErrInvalidKeyShareIndex.Wrap(fmt.Sprintf("Expect Index within: %d, got: %d", commitmentsLen, msg.KeyShareIndex))
	}

	// Parse the keyshare & commitment then verify it
	_, _, err := parseKeyShareCommitment(suite, msg.KeyShare, commitments.Commitments[msg.KeyShareIndex-1], uint32(msg.KeyShareIndex), msg.IdValue)
	if err != nil {
		k.Logger(ctx).Error(fmt.Sprintf("Error in parsing & verifying general keyshare & commitment: %s", err.Error()))
		k.Logger(ctx).Error(fmt.Sprintf("General KeyShare is: %v | Commitment is: %v | Index: %d", msg.KeyShare, commitments.Commitments, msg.KeyShareIndex))
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

		return &types.MsgCreateGeneralKeyShareResponse{
			Creator:             msg.Creator,
			IdType:              msg.IdType,
			IdValue:             msg.IdValue,
			KeyShare:            msg.KeyShare,
			KeyShareIndex:       msg.KeyShareIndex,
			ReceivedBlockHeight: uint64(ctx.BlockHeight()),
			Success:             false,
			ErrorMessage:        "Invalid General KeyShare",
		}, nil
	}

	generalKeyShare := types.GeneralKeyShare{
		Validator:           msg.Creator,
		IdType:              msg.IdType,
		IdValue:             msg.IdValue,
		KeyShare:            msg.KeyShare,
		KeyShareIndex:       msg.KeyShareIndex,
		ReceivedTimestamp:   uint64(ctx.BlockTime().Unix()),
		ReceivedBlockHeight: uint64(ctx.BlockHeight()),
	}

	// Save the new general key share to state
	k.SetGeneralKeyShare(ctx, generalKeyShare)
	k.SetLastSubmittedHeight(ctx, msg.Creator, strconv.FormatInt(ctx.BlockHeight(), 10))

	validatorList := k.GetAllValidatorSet(ctx)

	// Get all the general key shares for the provided id value & id type
	var stateGeneralKeyShares []types.GeneralKeyShare
	
	for _, eachValidator := range validatorList {
		eachGeneralKeyShare, found := k.GetGeneralKeyShare(ctx, eachValidator.Validator, msg.IdType, msg.IdValue)
		if !found {
			continue
		}
		stateGeneralKeyShares = append(stateGeneralKeyShares, eachGeneralKeyShare)
	}

	expectedThreshold := sdk.NewDecFromInt(
		sdk.NewInt(types.KeyAggregationThresholdNumerator)).Quo(
		sdk.NewDecFromInt(sdk.NewInt(types.KeyAggregationThresholdDenominator))).MulInt64(
		int64(len(validatorList))).Ceil().TruncateInt64()
		//logrus.Info("****************************************************************************************************************", expectedThreshold,len(stateGeneralKeyShares))
	// Emit KeyShare Submitted Event
	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.SendGeneralKeyshareEventType,
			sdk.NewAttribute(types.SendGeneralKeyshareEventValidator, msg.Creator),
			sdk.NewAttribute(types.SendGeneralKeyshareEventReceivedBlockHeight, strconv.FormatInt(ctx.BlockHeight(), 10)),
			sdk.NewAttribute(types.SendGeneralKeyshareEventMessage, msg.KeyShare),
			sdk.NewAttribute(types.SendGeneralKeyshareEventIndex, strconv.FormatUint(msg.KeyShareIndex, 10)),
			sdk.NewAttribute(types.SendGeneralKeyshareEventIDType, msg.IdType),
			sdk.NewAttribute(types.SendGeneralKeyshareEventIdValue, msg.IdValue),
		),
	)
	
	
	// If there is not enough keyshares to aggregate OR there is already an aggregated key
	// Only continue the code if there is enough keyshare to aggregate & no aggregated key for current height
	if int64(len(stateGeneralKeyShares)) < expectedThreshold {
		return &types.MsgCreateGeneralKeyShareResponse{
			Creator:             msg.Creator,
			IdType:              msg.IdType,
			IdValue:             msg.IdValue,
			KeyShare:            msg.KeyShare,
			KeyShareIndex:       msg.KeyShareIndex,
			ReceivedBlockHeight: uint64(ctx.BlockHeight()),
			Success:             true,
		}, nil
	}
	//logrus.Info("****************************************************************************************************************ok")
	// Get the active public key for aggregating
	activePubKey, found := k.pepKeeper.GetActivePubKey(ctx)

	if !found {
		return nil, types.ErrPubKeyNotFound
	}

	// Parse & append all the keyshare for aggregation
	var listOfShares []distIBE.ExtractedKey
	var listOfCommitment []distIBE.Commitment

	for _, eachKeyShare := range stateGeneralKeyShares {
		if eachKeyShare.KeyShareIndex > commitmentsLen {
			k.Logger(ctx).Error(fmt.Sprintf("KeyShareIndex: %d should not higher or equals to commitments length: %d", eachKeyShare.KeyShareIndex, commitmentsLen))
			continue
		}
		keyShare, commitment, err := parseKeyShareCommitment(suite, eachKeyShare.KeyShare, commitments.Commitments[eachKeyShare.KeyShareIndex-1], uint32(eachKeyShare.KeyShareIndex), msg.IdValue)
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
	SK, _ := distIBE.AggregateSK(suite, listOfShares, listOfCommitment, []byte(msg.IdValue))
	skByte, err := SK.MarshalBinary()
	if err != nil {
		return nil, err
	}
	skHex := hex.EncodeToString(skByte)
	k.conditionalEncKeeper.SetAggregatedConditionalKeyShare(ctx,conditionalenctypes.AggregatedConditionalKeyShare{
		Condition: msg.IdValue,
		Data: skHex,
		Creator: msg.Creator,
	})
	k.Logger(ctx).Info(fmt.Sprintf("Aggregated General Decryption Key for ID Type %s, ID: %s | %s", msg.IdType, msg.IdValue, skHex))

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.GeneralKeyShareAggregatedEventType,
			sdk.NewAttribute(types.GeneralKeyShareAggregatedEventIDType, msg.IdType),
			sdk.NewAttribute(types.GeneralKeyShareAggregatedEventIDValue, msg.IdValue),
			sdk.NewAttribute(types.GeneralKeyShareAggregatedEventData, skHex),
			sdk.NewAttribute(types.GeneralKeyShareAggregatedEventPubKey, activePubKey.PublicKey),
		),
	)



	return &types.MsgCreateGeneralKeyShareResponse{
		Creator:             msg.Creator,
		IdType:              msg.IdType,
		IdValue:             msg.IdValue,
		KeyShare:            msg.KeyShare,
		KeyShareIndex:       msg.KeyShareIndex,
		ReceivedBlockHeight: uint64(ctx.BlockHeight()),
		Success:             true,
	}, nil
}
