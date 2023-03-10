package keeper

import (
	"context"

	"fairyring/x/fairyring/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) CreateLatestPubKey(goCtx context.Context, msg *types.MsgCreateLatestPubKey) (*types.MsgCreateLatestPubKeyResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// check if validator is registered
	_, found := k.GetValidatorSet(ctx, msg.Creator)

	if !found {
		return nil, types.ErrValidatorNotRegistered.Wrap(msg.Creator)
	}

	var latestPubKey = types.LatestPubKey{
		Creator:   msg.Creator,
		PublicKey: msg.PublicKey,
	}

	k.SetLatestPubKey(
		ctx,
		latestPubKey,
	)
	return &types.MsgCreateLatestPubKeyResponse{}, nil
}
