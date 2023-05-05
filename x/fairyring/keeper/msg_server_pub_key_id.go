package keeper

import (
	"context"

	peptypes "fairyring/x/fairblock/types"
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

	_, found = k.pepKeeper.GetQueuedPubKey(ctx)
	if found {
		return nil, types.ErrQueuedKeyAlreadyExists.Wrap(msg.Creator)
	}

	expHeight := params.KeyExpiry + uint64(ctx.BlockHeight())
	ak, found := k.pepKeeper.GetActivePubKey(ctx)
	if found {
		expHeight = ak.Expiry + params.KeyExpiry
	}
	var queuedPubKey = peptypes.QueuedPubKey{
		Creator:   msg.Creator,
		PublicKey: msg.PublicKey,
		Expiry:    expHeight,
	}

	k.pepKeeper.SetQueuedPubKey(
		ctx,
		queuedPubKey,
	)
	return &types.MsgCreateLatestPubKeyResponse{}, nil
}
