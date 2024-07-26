package keeper

import (
	"context"
	"encoding/hex"
	"errors"
	"fmt"
	"strconv"
	"time"

	"cosmossdk.io/math"

	distIBE "github.com/FairBlock/DistributedIBE"
	clienttypes "github.com/cosmos/ibc-go/v8/modules/core/02-client/types"
	bls "github.com/drand/kyber-bls12381"

	"github.com/Fairblock/fairyring/x/keyshare/types"

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

	isSupportedIDType := false
	for _, v := range SupportedIDTypes {
		if v == msg.IdType {
			isSupportedIDType = true
			break
		}
	}

	if !isSupportedIDType {
		return nil, types.ErrUnsupportedIDType.Wrapf(", supported id types: %v", SupportedIDTypes)
	}

	switch msg.IdType {
	case PrivateGovIdentity:
		keyShareReq, found := k.GetKeyShareRequest(ctx, msg.IdValue)
		if !found {
			return nil, types.ErrKeyShareRequestNotFound.Wrapf(", got id value: %s", msg.IdValue)
		}
		if keyShareReq.AggrKeyshare != "" {
			return nil, types.ErrAggKeyAlreadyExists.Wrapf(", identity: %s, Aggregated key: %s", msg.IdValue, keyShareReq.AggrKeyshare)
		}
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
		k.Logger().Error(fmt.Sprintf("Error in parsing & verifying general keyshare & commitment: %s", err.Error()))
		k.Logger().Error(fmt.Sprintf("General KeyShare is: %v | Commitment is: %v | Index: %d", msg.KeyShare, commitments.Commitments, msg.KeyShareIndex))
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

		k.SlashingKeeper().Slash(
			ctx, consAddr,
			k.SlashFractionWrongKeyshare(ctx),
			types.SlashPower,
			ctx.BlockHeight()-1,
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

	// Get the active public key for aggregating
	activePubKey, found := k.GetActivePubKey(ctx)

	if !found {
		return nil, types.ErrPubKeyNotFound
	}

	expectedThreshold := math.LegacyNewDecFromInt(
		math.NewInt(types.KeyAggregationThresholdNumerator)).Quo(
		math.LegacyNewDecFromInt(math.NewInt(types.KeyAggregationThresholdDenominator))).MulInt64(
		int64(activePubKey.NumberOfValidators)).Ceil().TruncateInt64()

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

	// Check if target general keyshare already aggregated a key
	switch msg.IdType {
	case PrivateGovIdentity:
		keyShareReq, found := k.GetKeyShareRequest(ctx, msg.IdValue)
		if !found {
			return nil, types.ErrKeyShareRequestNotFound.Wrapf(", got id value: %s", msg.IdValue)
		}

		if keyShareReq.AggrKeyshare != "" {
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
	}

	// Parse & append all the keyshare for aggregation
	var listOfShares []distIBE.ExtractedKey
	var listOfCommitment []distIBE.Commitment

	for _, eachKeyShare := range stateGeneralKeyShares {
		if eachKeyShare.KeyShareIndex > commitmentsLen {
			k.Logger().Error(fmt.Sprintf("KeyShareIndex: %d should not higher or equals to commitments length: %d", eachKeyShare.KeyShareIndex, commitmentsLen))
			continue
		}
		keyShare, commitment, err := parseKeyShareCommitment(suite, eachKeyShare.KeyShare, commitments.Commitments[eachKeyShare.KeyShareIndex-1], uint32(eachKeyShare.KeyShareIndex), msg.IdValue)
		if err != nil {
			k.Logger().Error(err.Error())
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

	k.Logger().Info(fmt.Sprintf("Aggregated General Decryption Key for ID Type %s, ID: %s | %s", msg.IdType, msg.IdValue, skHex))

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.GeneralKeyShareAggregatedEventType,
			sdk.NewAttribute(types.GeneralKeyShareAggregatedEventIDType, msg.IdType),
			sdk.NewAttribute(types.GeneralKeyShareAggregatedEventIDValue, msg.IdValue),
			sdk.NewAttribute(types.GeneralKeyShareAggregatedEventData, skHex),
			sdk.NewAttribute(types.GeneralKeyShareAggregatedEventPubKey, activePubKey.PublicKey),
		),
	)

	switch msg.IdType {
	case PrivateGovIdentity:
		val := types.MsgCreateGeneralKeyShareResponse{
			Creator:             msg.Creator,
			IdType:              msg.IdType,
			IdValue:             msg.IdValue,
			KeyShare:            msg.KeyShare,
			KeyShareIndex:       msg.KeyShareIndex,
			ReceivedBlockHeight: uint64(ctx.BlockHeight()),
		}
		keyShareReq, found := k.GetKeyShareRequest(ctx, msg.IdValue)
		if !found {
			return nil, types.ErrKeyShareRequestNotFound.Wrapf(", got id value: %s", msg.IdValue)
		}
		if keyShareReq.AggrKeyshare != "" {
			return nil, types.ErrAggKeyAlreadyExists.Wrapf(", identity: %s, Aggregated key: %s", msg.IdValue, keyShareReq.AggrKeyshare)
		}
		keyShareReq.AggrKeyshare = skHex
		k.SetKeyShareRequest(ctx, keyShareReq)
		timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()

		if keyShareReq.IbcInfo != nil {
			if keyShareReq.IbcInfo.ChannelID != "" {
				_, err = k.TransmitAggrKeyshareDataPacket(
					ctx,
					types.AggrKeyshareDataPacketData{
						Identity:     keyShareReq.Identity,
						Pubkey:       keyShareReq.Pubkey,
						AggrKeyshare: keyShareReq.AggrKeyshare,
						AggrHeight:   strconv.FormatInt(ctx.BlockHeight(), 10),
						ProposalId:   keyShareReq.ProposalId,
						RequestId:    keyShareReq.RequestId,
						Retries:      0,
					},
					keyShareReq.IbcInfo.PortID,
					keyShareReq.IbcInfo.ChannelID,
					clienttypes.ZeroHeight(),
					uint64(timeoutTimestamp),
				)
				if err != nil {
					return nil, err
				}
			}
		} else {
			if keyShareReq.ProposalId != "" {
				id, err := strconv.ParseUint(keyShareReq.ProposalId, 10, 64)
				if err != nil {
					val.Success = false
					return &val, err
				}

				proposal, found := k.govKeeper.GetProposal(ctx, id)
				if !found {
					val.Success = false
					return &val, errors.New("proposal not found")
				}

				proposal.AggrKeyshare = keyShareReq.AggrKeyshare
				k.govKeeper.SetProposal(ctx, proposal)
			} else {
				val, _ := k.pepKeeper.GetEntry(ctx, keyShareReq.RequestId)
				val.AggrKeyshare = keyShareReq.AggrKeyshare
				k.pepKeeper.SetExecutionQueueEntry(ctx, val)
				k.pepKeeper.RemoveEntry(ctx, val.RequestId)
			}
		}
	}

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
