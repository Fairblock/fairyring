package keeper

import (
	"context"
	"strconv"

	"cosmossdk.io/math"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) SubmitEncryptedKeyshare(goCtx context.Context, msg *types.MsgSubmitEncryptedKeyshare) (*types.MsgSubmitEncryptedKeyshareResponse, error) {
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

	keyShareReq, found := k.GetPrivateKeyShareRequest(ctx, msg.Identity)
	if !found {
		return nil, types.ErrKeyShareRequestNotFound.Wrapf(", got id value: %s", msg.Identity)
	}

	valEncKeyshare := types.ValidatorEncryptedKeyShare{
		Validator:           msg.Creator,
		Requester:           msg.Requester,
		KeyShare:            msg.EncryptedKeyshare,
		KeyShareIndex:       msg.KeyShareIndex,
		ReceivedTimestamp:   msg.ReceivedTimestamp,
		ReceivedBlockHeight: msg.ReceivedBlockHeight,
		Identity:            msg.Identity,
	}

	// Save the new general key share to state
	k.SetPrivateKeyShare(ctx, valEncKeyshare)
	k.SetLastSubmittedHeight(ctx, msg.Creator, strconv.FormatInt(ctx.BlockHeight(), 10))

	validatorList := k.GetAllValidatorSet(ctx)

	// Get all the general key shares for the provided id value & id type
	var stateEncryptedKeyShares []types.ValidatorEncryptedKeyShare

	for _, eachValidator := range validatorList {
		eachEncKeyShare, found := k.GetPrivateKeyShare(ctx, eachValidator.Validator, msg.Identity, msg.Requester)
		if !found {
			continue
		}
		stateEncryptedKeyShares = append(stateEncryptedKeyShares, eachEncKeyShare)
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
			sdk.NewAttribute(types.SendGeneralKeyshareEventMessage, msg.EncryptedKeyshare),
			sdk.NewAttribute(types.SendGeneralKeyshareEventIndex, strconv.FormatUint(msg.KeyShareIndex, 10)),
			sdk.NewAttribute(types.SendGeneralKeyshareEventIdValue, msg.Identity),
		),
	)

	// If there is not enough keyshares to aggregate OR there is already an aggregated key
	// Only continue the code if there is enough keyshare to aggregate & no aggregated key for current height
	if int64(len(stateEncryptedKeyShares)) < expectedThreshold {
		return &types.MsgSubmitEncryptedKeyshareResponse{}, nil
	}

	if len(keyShareReq.EncryptedKeyshares) != 0 {
		return &types.MsgSubmitEncryptedKeyshareResponse{}, nil
	}

	for _, eachKeyShare := range stateEncryptedKeyShares {

	}

	return &types.MsgSubmitEncryptedKeyshareResponse{}, nil
}
