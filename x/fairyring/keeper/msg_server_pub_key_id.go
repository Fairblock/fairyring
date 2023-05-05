package keeper

import (
	"context"
	"strconv"

	"fairyring/x/fairyring/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// CreateLatestPubKey updates the public key
func (k msgServer) CreateLatestPubKey(goCtx context.Context, msg *types.MsgCreateLatestPubKey) (*types.MsgCreateLatestPubKeyResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	params := k.GetParams(ctx)

	// check if validator is registered
	_, found := k.GetValidatorSet(ctx, msg.Creator)

	if !found {
		return nil, types.ErrValidatorNotRegistered.Wrap(msg.Creator)
	}

	_, found = k.GetQueuedPubKey(ctx)
	if found {
		return nil, types.ErrQueuedKeyAlreadyExists.Wrap(msg.Creator)
	}

	expHeight := params.KeyExpiry + uint64(ctx.BlockHeight())
	ak, found := k.GetActivePubKey(ctx)
	if found {
		expHeight = ak.Expiry + params.KeyExpiry
	}
	var queuedPubKey = types.QueuedPubKey{
		Creator:   msg.Creator,
		PublicKey: msg.PublicKey,
		Expiry:    expHeight,
	}

	k.SetQueuedPubKey(
		ctx,
		queuedPubKey,
	)

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.QueuedPubKeyCreatedEventType,
			sdk.NewAttribute(types.QueuedPubKeyCreatedEventActivePubkeyExpiryHeight, strconv.FormatUint(ak.Expiry, 10)),
			sdk.NewAttribute(types.QueuedPubKeyCreatedEventExpiryHeight, strconv.FormatUint(expHeight, 10)),
			sdk.NewAttribute(types.QueuedPubKeyCreatedEventCreator, msg.Creator),
			sdk.NewAttribute(types.QueuedPubKeyCreatedEventPubkey, msg.PublicKey),
		),
	)

	return &types.MsgCreateLatestPubKeyResponse{}, nil
}
