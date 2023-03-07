package keeper

import (
	"context"

	"fairyring/x/fairyring/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

func (k msgServer) CreatePubKeyID(goCtx context.Context, msg *types.MsgCreatePubKeyID) (*types.MsgCreatePubKeyIDResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// check if validator is registered
	_, found := k.GetValidatorSet(ctx, msg.Creator)

	if !found {
		return nil, types.ErrValidatorNotRegistered.Wrap(msg.Creator)
	}

	// Check if the value already exists
	_, isFound := k.GetPubKeyID(
		ctx,
		msg.Height,
	)
	if isFound {
		return nil, sdkerrors.Wrap(sdkerrors.ErrInvalidRequest, "index already set")
	}

	var pubKeyID = types.PubKeyID{
		Creator:   msg.Creator,
		Height:    msg.Height,
		PublicKey: msg.PublicKey,
		IbeID:     msg.IbeID,
	}

	k.SetPubKeyID(
		ctx,
		pubKeyID,
	)
	return &types.MsgCreatePubKeyIDResponse{}, nil
}
