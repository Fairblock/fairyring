package keeper

import (
	"context"
	"encoding/json"
	peptypes "github.com/Fairblock/fairyring/x/pep/types"
	"strconv"

	"github.com/Fairblock/fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// OverrideLatestPubKey updates the public key
func (k msgServer) OverrideLatestPubKey(goCtx context.Context, msg *types.MsgOverrideLatestPubKey) (*types.MsgOverrideLatestPubKeyResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	params := k.GetParams(ctx)

	trustedAddresses := params.TrustedAddresses
	if !contains(trustedAddresses, msg.Creator) {
		return nil, types.ErrAddressNotTrusted.Wrap(msg.Creator)
	}

	commitments := types.Commitments{
		Commitments: msg.Commitments,
	}

	// Only use this expiry height when there is no active pub key
	// and trying to override active pub key
	expHeight := params.KeyExpiry + uint64(ctx.BlockHeight())

	ak, found := k.GetActivePubKey(ctx)

	// Throw error If no active pub key and trying to override queued pub key
	if !found && msg.IsQueuedPubKey {
		return nil, types.ErrPubKeyNotFound
	}

	// If overriding active pub key & there is active pub key,
	// set the overriding active pub key expiry height to be current active pub key
	if found && !msg.IsQueuedPubKey {
		expHeight = ak.Expiry
	}

	// If overriding queued pub key & there is queued pub key,
	// set the overriding queued pub key expiry height to be current queued pub key
	qk, found := k.GetQueuedPubKey(ctx)
	if found && msg.IsQueuedPubKey {
		expHeight = qk.Expiry
	}

	// If no queued pub key & trying to override queued pub key
	// Set the expiry height to be current active pub key expiry + params expiry
	// to prevent there is no pub key in between round
	if !found && msg.IsQueuedPubKey {
		expHeight = ak.Expiry + params.KeyExpiry
	}

	encryptedKeyShares, err := json.Marshal(msg.EncryptedKeyShares)
	if err != nil {
		return nil, err
	}

	if msg.IsQueuedPubKey {
		k.SetQueuedCommitments(
			ctx,
			commitments,
		)
		k.SetQueuedPubKey(
			ctx,
			types.QueuedPubKey{
				Creator:            msg.Creator,
				PublicKey:          msg.PublicKey,
				Expiry:             expHeight,
				NumberOfValidators: msg.NumberOfValidators,
				EncryptedKeyShares: msg.EncryptedKeyShares,
			},
		)

		k.pepKeeper.SetQueuedPubKey(
			ctx,
			peptypes.QueuedPubKey{
				Creator:   msg.Creator,
				PublicKey: msg.PublicKey,
				Expiry:    expHeight,
			},
		)
	} else {
		k.SetActiveCommitments(
			ctx,
			commitments,
		)

		k.SetActivePubKey(
			ctx,
			types.ActivePubKey{
				Creator:            msg.Creator,
				PublicKey:          msg.PublicKey,
				Expiry:             expHeight,
				NumberOfValidators: msg.NumberOfValidators,
				EncryptedKeyShares: msg.EncryptedKeyShares,
			},
		)

		k.pepKeeper.SetActivePubKey(
			ctx,
			peptypes.ActivePubKey{
				Creator:   msg.Creator,
				PublicKey: msg.PublicKey,
				Expiry:    expHeight,
			},
		)
	}

	ak, found = k.GetActivePubKey(ctx)
	// Shouldn't be happening
	if !found {
		return nil, types.ErrPubKeyNotFound.Wrap("before emitting event")
	}

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.PubKeyOverrodeEventType,
			sdk.NewAttribute(types.PubKeyOverrodeEventActivePubkeyExpiryHeight, strconv.FormatUint(ak.Expiry, 10)),
			sdk.NewAttribute(types.PubKeyOverrodeEventExpiryHeight, strconv.FormatUint(expHeight, 10)),
			sdk.NewAttribute(types.PubKeyOverrodeEventCreator, msg.Creator),
			sdk.NewAttribute(types.PubKeyOverrodeEventPubkey, msg.PublicKey),
			sdk.NewAttribute(types.PubKeyOverrodeEventNumberOfValidators, strconv.FormatUint(msg.NumberOfValidators, 10)),
			sdk.NewAttribute(types.PubKeyOverrodeEventEncryptedShares, string(encryptedKeyShares)),
			sdk.NewAttribute(types.PubKeyOverrodeEventIsPendingPubKey, strconv.FormatBool(msg.IsQueuedPubKey)),
		),
	)

	return &types.MsgOverrideLatestPubKeyResponse{}, nil
}
