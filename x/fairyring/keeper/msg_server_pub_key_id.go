package keeper

import (
	"context"

	"fairyring/x/fairyring/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// CreateLatestPubKey updates the public key
func (k msgServer) CreateLatestPubKey(goCtx context.Context, msg *types.MsgCreateLatestPubKey) (*types.MsgCreateLatestPubKeyResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// check if validator is registered
	_, found := k.GetValidatorSet(ctx, msg.Creator)

	if !found {
		return nil, types.ErrValidatorNotRegistered.Wrap(msg.Creator)
	}

	_, found = k.GetQueuedPubKey(ctx)
	if found {
		return nil, types.ErrQueuedKeyAlreadyExists.Wrap(msg.Creator)
	}

	var queuedPubKey = types.QueuedPubKey{
		Creator:   msg.Creator,
		PublicKey: msg.PublicKey,
	}

	k.SetQueuedPubKey(
		ctx,
		queuedPubKey,
	)
	return &types.MsgCreateLatestPubKeyResponse{}, nil
}
