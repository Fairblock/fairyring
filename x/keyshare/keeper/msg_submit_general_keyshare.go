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

func (k msgServer) SubmitGeneralKeyshare(
	goCtx context.Context,
	msg *types.MsgSubmitGeneralKeyshare,
) (*types.MsgSubmitGeneralKeyshareResponse, error) {
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
		keyshareReq, found := k.GetDecryptionKeyRequest(ctx, msg.IdValue)
		if !found {
			return nil, types.ErrKeyshareRequestNotFound.Wrapf(", got id value: %s", msg.IdValue)
		}
		if keyshareReq.DecryptionKey != "" {
			return &types.MsgSubmitGeneralKeyshareResponse{
				Creator:             msg.Creator,
				IdType:              msg.IdType,
				IdValue:             msg.IdValue,
				Keyshare:            msg.Keyshare,
				KeyshareIndex:       msg.KeyshareIndex,
				ReceivedBlockHeight: uint64(ctx.BlockHeight()),
				Success:             true,
			}, nil
		}
	}

	// Setup
	suite := bls.NewBLS12381Suite()

	commitments, found := k.GetActiveCommitments(ctx)
	if !found {
		return nil, types.ErrCommitmentsNotFound
	}

	commitmentsLen := uint64(len(commitments.Commitments))
	if msg.KeyshareIndex > commitmentsLen {
		return nil, types.ErrInvalidKeyshareIndex.Wrap(fmt.Sprintf("Expect Index within: %d, got: %d", commitmentsLen, msg.KeyshareIndex))
	}

	// Parse the keyshare & commitment then verify it
	_, _, err := parseKeyshareCommitment(suite, msg.Keyshare, commitments.Commitments[msg.KeyshareIndex-1], uint32(msg.KeyshareIndex), msg.IdValue)
	if err != nil {
		k.Logger().Error(fmt.Sprintf("Error in parsing & verifying general keyshare & commitment: %s", err.Error()))
		k.Logger().Error(fmt.Sprintf("General Keyshare is: %v | Commitment is: %v | Index: %d", msg.Keyshare, commitments.Commitments, msg.KeyshareIndex))
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

		return &types.MsgSubmitGeneralKeyshareResponse{
			Creator:             msg.Creator,
			IdType:              msg.IdType,
			IdValue:             msg.IdValue,
			Keyshare:            msg.Keyshare,
			KeyshareIndex:       msg.KeyshareIndex,
			ReceivedBlockHeight: uint64(ctx.BlockHeight()),
			Success:             false,
			ErrorMessage:        "Invalid General Keyshare",
		}, nil
	}

	generalKeyshare := types.GeneralKeyshare{
		Validator:           msg.Creator,
		IdType:              msg.IdType,
		IdValue:             msg.IdValue,
		Keyshare:            msg.Keyshare,
		KeyshareIndex:       msg.KeyshareIndex,
		ReceivedTimestamp:   uint64(ctx.BlockTime().Unix()),
		ReceivedBlockHeight: uint64(ctx.BlockHeight()),
	}

	// Save the new general key share to state
	k.SetGeneralKeyshare(ctx, generalKeyshare)
	k.SetLastSubmittedHeight(ctx, msg.Creator, strconv.FormatInt(ctx.BlockHeight(), 10))

	validatorList := k.GetAllValidatorSet(ctx)

	// Get all the general key shares for the provided id value & id type
	var stateGeneralKeyshares []types.GeneralKeyshare

	for _, eachValidator := range validatorList {
		eachGeneralKeyshare, found := k.GetGeneralKeyshare(
			ctx,
			eachValidator.Validator,
			msg.IdType,
			msg.IdValue,
		)
		if !found {
			continue
		}
		stateGeneralKeyshares = append(stateGeneralKeyshares, eachGeneralKeyshare)
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

	// Emit Keyshare Submitted Event
	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.SendGeneralKeyshareEventType,
			sdk.NewAttribute(types.SendGeneralKeyshareEventValidator, msg.Creator),
			sdk.NewAttribute(types.SendGeneralKeyshareEventReceivedBlockHeight, strconv.FormatInt(ctx.BlockHeight(), 10)),
			sdk.NewAttribute(types.SendGeneralKeyshareEventMessage, msg.Keyshare),
			sdk.NewAttribute(types.SendGeneralKeyshareEventIndex, strconv.FormatUint(msg.KeyshareIndex, 10)),
			sdk.NewAttribute(types.SendGeneralKeyshareEventIDType, msg.IdType),
			sdk.NewAttribute(types.SendGeneralKeyshareEventIdValue, msg.IdValue),
		),
	)

	// If there is not enough keyshares to aggregate OR there is already an aggregated key
	// Only continue the code if there is enough keyshare to aggregate & no aggregated key for current height
	if int64(len(stateGeneralKeyshares)) < expectedThreshold {
		return &types.MsgSubmitGeneralKeyshareResponse{
			Creator:             msg.Creator,
			IdType:              msg.IdType,
			IdValue:             msg.IdValue,
			Keyshare:            msg.Keyshare,
			KeyshareIndex:       msg.KeyshareIndex,
			ReceivedBlockHeight: uint64(ctx.BlockHeight()),
			Success:             true,
		}, nil
	}

	// Check if target general keyshare already aggregated a key
	switch msg.IdType {
	case PrivateGovIdentity:
		keyshareReq, found := k.GetDecryptionKeyRequest(ctx, msg.IdValue)
		if !found {
			return nil, types.ErrKeyshareRequestNotFound.Wrapf(", got id value: %s", msg.IdValue)
		}

		if keyshareReq.DecryptionKey != "" {
			return &types.MsgSubmitGeneralKeyshareResponse{
				Creator:             msg.Creator,
				IdType:              msg.IdType,
				IdValue:             msg.IdValue,
				Keyshare:            msg.Keyshare,
				KeyshareIndex:       msg.KeyshareIndex,
				ReceivedBlockHeight: uint64(ctx.BlockHeight()),
				Success:             true,
			}, nil
		}
	}

	// Parse & append all the keyshare for aggregation
	var listOfShares []distIBE.ExtractedKey
	var listOfCommitment []distIBE.Commitment

	for _, eachKeyshare := range stateGeneralKeyshares {
		if eachKeyshare.KeyshareIndex > commitmentsLen {
			k.Logger().Error(fmt.Sprintf("KeyshareIndex: %d should not higher or equals to commitments length: %d", eachKeyshare.KeyshareIndex, commitmentsLen))
			continue
		}
		keyshare, commitment, err := parseKeyshareCommitment(suite, eachKeyshare.Keyshare, commitments.Commitments[eachKeyshare.KeyshareIndex-1], uint32(eachKeyshare.KeyshareIndex), msg.IdValue)
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
	SK, _ := distIBE.AggregateSK(suite, listOfShares, listOfCommitment, []byte(msg.IdValue))
	skByte, err := SK.MarshalBinary()
	if err != nil {
		return nil, err
	}
	skHex := hex.EncodeToString(skByte)

	k.Logger().Info(fmt.Sprintf("Aggregated General Decryption Key for ID Type %s, ID: %s | %s", msg.IdType, msg.IdValue, skHex))

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.GeneralKeyshareAggregatedEventType,
			sdk.NewAttribute(types.GeneralKeyshareAggregatedEventIDType, msg.IdType),
			sdk.NewAttribute(types.GeneralKeyshareAggregatedEventIDValue, msg.IdValue),
			sdk.NewAttribute(types.GeneralKeyshareAggregatedEventData, skHex),
			sdk.NewAttribute(types.GeneralKeyshareAggregatedEventPubkey, activePubkey.PublicKey),
		),
	)

	switch msg.IdType {
	case PrivateGovIdentity:
		val := types.MsgSubmitGeneralKeyshareResponse{
			Creator:             msg.Creator,
			IdType:              msg.IdType,
			IdValue:             msg.IdValue,
			Keyshare:            msg.Keyshare,
			KeyshareIndex:       msg.KeyshareIndex,
			ReceivedBlockHeight: uint64(ctx.BlockHeight()),
		}
		decryptionKeyReq, found := k.GetDecryptionKeyRequest(ctx, msg.IdValue)
		if !found {
			return nil, types.ErrKeyshareRequestNotFound.Wrapf(", got id value: %s", msg.IdValue)
		}
		if decryptionKeyReq.DecryptionKey != "" {
			return nil, types.ErrDecryptionKeyAlreadyExists.Wrapf(", identity: %s, decryption key: %s", msg.IdValue, decryptionKeyReq.DecryptionKey)
		}
		decryptionKeyReq.DecryptionKey = skHex
		k.SetDecryptionKeyRequest(ctx, decryptionKeyReq)
		timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()

		if decryptionKeyReq.IbcInfo != nil {
			if decryptionKeyReq.IbcInfo.ChannelId != "" {
				_, err := k.TransmitDecryptionKeyDataPacket(
					ctx,
					types.DecryptionKeyDataPacketData{
						Identity:      decryptionKeyReq.Identity,
						Pubkey:        decryptionKeyReq.Pubkey,
						DecryptionKey: decryptionKeyReq.DecryptionKey,
						AggrHeight:    strconv.FormatInt(ctx.BlockHeight(), 10),
						ProposalId:    decryptionKeyReq.ProposalId,
						RequestId:     decryptionKeyReq.RequestId,
						Retries:       0,
					},
					decryptionKeyReq.IbcInfo.PortId,
					decryptionKeyReq.IbcInfo.ChannelId,
					clienttypes.ZeroHeight(),
					uint64(timeoutTimestamp),
				)
				if err != nil {
					return nil, err
				}
			}
		} else {
			if decryptionKeyReq.ProposalId != "" {
				id, err := strconv.ParseUint(decryptionKeyReq.ProposalId, 10, 64)
				if err != nil {
					val.Success = false
					return &val, err
				}

				proposal, found := k.govKeeper.GetProposal(ctx, id)
				if !found {
					val.Success = false
					return &val, errors.New("proposal not found")
				}

				proposal.DecryptionKey = decryptionKeyReq.DecryptionKey
				k.govKeeper.SetProposal(ctx, proposal)
			} else {
				val, _ := k.pepKeeper.GetEntry(ctx, decryptionKeyReq.RequestId)
				val.DecryptionKey = decryptionKeyReq.DecryptionKey
				k.pepKeeper.SetExecutionQueueEntry(ctx, val)
				k.pepKeeper.SetEntry(ctx, val)
			}
		}
	}

	return &types.MsgSubmitGeneralKeyshareResponse{
		Creator:             msg.Creator,
		IdType:              msg.IdType,
		IdValue:             msg.IdValue,
		Keyshare:            msg.Keyshare,
		KeyshareIndex:       msg.KeyshareIndex,
		ReceivedBlockHeight: uint64(ctx.BlockHeight()),
		Success:             true,
	}, nil
}
