package keeper

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"cosmossdk.io/math"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	clienttypes "github.com/cosmos/ibc-go/v8/modules/core/02-client/types"
)

func (k msgServer) SubmitEncryptedKeyshare(goCtx context.Context, msg *types.MsgSubmitEncryptedKeyshare) (*types.MsgSubmitEncryptedKeyshareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// check if validator is registered
	_, found := k.GetValidatorSet(ctx, msg.Creator)

	if !found {
		authorizedAddrInfo, found := k.GetAuthorizedAddress(ctx, msg.Creator)
		if !found || !authorizedAddrInfo.IsAuthorized {
			return nil, types.ErrAddrIsNotValidatorOrAuthorized.Wrap(msg.Creator)
		}

		_, found = k.GetValidatorSet(ctx, authorizedAddrInfo.AuthorizedBy)
		if !found {
			return nil, types.ErrAuthorizerIsNotValidator.Wrap(authorizedAddrInfo.AuthorizedBy)
		}

		// If the sender is in the validator set & authorized another address to submit key share
	} else if count := k.GetAuthorizedCount(ctx, msg.Creator); count != 0 {
		return nil, types.ErrAuthorizedAnotherAddress
	}

	keyShareReq, found := k.GetPrivateKeyShareRequest(ctx, msg.Identity)
	if !found {
		return nil, types.ErrKeyShareRequestNotFound.Wrapf(", got id value: %s", msg.Identity)
	}

	commitments, found := k.GetActiveCommitments(ctx)
	if !found {
		return nil, types.ErrCommitmentsNotFound
	}

	commitmentsLen := uint64(len(commitments.Commitments))
	if msg.KeyshareIndex > commitmentsLen {
		return nil, types.ErrInvalidKeyShareIndex.Wrap(fmt.Sprintf("Expect Index within: %d, got: %d", commitmentsLen, msg.KeyshareIndex))
	}

	valEncKeyshare := types.ValidatorEncryptedKeyshare{
		Validator:           msg.Creator,
		Requester:           msg.Requester,
		Keyshare:            msg.EncryptedKeyshare,
		KeyshareIndex:       msg.KeyshareIndex,
		ReceivedTimestamp:   msg.ReceivedTimestamp,
		ReceivedBlockHeight: msg.ReceivedBlockHeight,
		Identity:            msg.Identity,
	}

	// Save the new private keyshare to state
	k.SetPrivateKeyShare(ctx, valEncKeyshare)
	k.SetLastSubmittedHeight(ctx, msg.Creator, strconv.FormatInt(ctx.BlockHeight(), 10))

	validatorList := k.GetAllValidatorSet(ctx)

	// Get all the private keyshares for the provided id value & id type
	var stateEncryptedKeyShares []types.ValidatorEncryptedKeyshare

	for _, eachValidator := range validatorList {
		eachEncKeyShare, found := k.GetPrivateKeyShare(ctx, eachValidator.Validator, msg.Identity, msg.Requester)
		if !found {
			continue
		}
		stateEncryptedKeyShares = append(stateEncryptedKeyShares, eachEncKeyShare)
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
		sdk.NewEvent(types.SendEncryptedKeyshareEventType,
			sdk.NewAttribute(types.SendGeneralKeyshareEventValidator, msg.Creator),
			sdk.NewAttribute(types.SendGeneralKeyshareEventReceivedBlockHeight, strconv.FormatInt(ctx.BlockHeight(), 10)),
			sdk.NewAttribute(types.SendGeneralKeyshareEventMessage, msg.EncryptedKeyshare),
			sdk.NewAttribute(types.SendGeneralKeyshareEventIndex, strconv.FormatUint(msg.KeyshareIndex, 10)),
			sdk.NewAttribute(types.SendGeneralKeyshareEventIdValue, msg.Identity),
		),
	)

	// If there is not enough keyshares to aggregate OR there is already an aggregated key
	// Only continue the code if there is enough keyshare to aggregate & no aggregated key for current height
	if int64(len(stateEncryptedKeyShares)) < expectedThreshold {
		return &types.MsgSubmitEncryptedKeyshareResponse{}, nil
	}

	if len(keyShareReq.PrivateDecryptionKeys) != 0 {
		for _, entry := range keyShareReq.PrivateDecryptionKeys {
			if entry.Requester == msg.Requester && len(entry.PrivateKeyshares) != 0 {
				return &types.MsgSubmitEncryptedKeyshareResponse{}, nil
			}
		}
	}

	var kslist commontypes.PrivateDecryptionKey
	kslist.PrivateKeyshares = make([]*commontypes.IndexedEncryptedKeyshare, 0)
	for _, eachKeyShare := range stateEncryptedKeyShares {
		var indexedKeyshare commontypes.IndexedEncryptedKeyshare
		indexedKeyshare.EncryptedKeyshareValue = eachKeyShare.Keyshare
		indexedKeyshare.EncryptedKeyshareIndex = eachKeyShare.KeyshareIndex
		kslist.PrivateKeyshares = append(kslist.PrivateKeyshares, &indexedKeyshare)
	}
	kslist.Requester = msg.Requester

	keyShareReq.PrivateDecryptionKeys = append(keyShareReq.PrivateDecryptionKeys, &kslist)
	k.SetPrivateKeyShareRequest(ctx, keyShareReq)

	timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()

	if keyShareReq.IbcInfo != nil {
		if keyShareReq.IbcInfo.ChannelId != "" {
			_, err := k.TransmitPrivateDecryptionKeyDataPacket(
				ctx,
				types.PrivateDecryptionKeyDataPacketData{
					Identity:             keyShareReq.Identity,
					Pubkey:               keyShareReq.Pubkey,
					RequestId:            keyShareReq.RequestId,
					PrivateDecryptionKey: keyShareReq.PrivateDecryptionKeys,
				},
				keyShareReq.IbcInfo.PortId,
				keyShareReq.IbcInfo.ChannelId,
				clienttypes.ZeroHeight(),
				uint64(timeoutTimestamp),
			)
			if err != nil {
				return nil, err
			}
		}
	} else {
		entry, _ := k.pepKeeper.GetPrivateRequest(ctx, keyShareReq.RequestId)
		entry.PrivateDecryptionKeys = keyShareReq.PrivateDecryptionKeys
		k.pepKeeper.SetPrivateRequest(ctx, entry)
	}

	return &types.MsgSubmitEncryptedKeyshareResponse{}, nil
}
