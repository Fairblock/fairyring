package keeper

import (
	"context"

	"fairyring/x/fairblock/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

func (k msgServer) CreateAggregatedKeyShare(goCtx context.Context, msg *types.MsgCreateAggregatedKeyShare) (*types.MsgCreateAggregatedKeyShareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Check if the value already exists
	_, isFound := k.GetAggregatedKeyShare(
		ctx,
		msg.Height,
	)
	if isFound {
		return nil, sdkerrors.Wrap(sdkerrors.ErrInvalidRequest, "index already set")
	}

	var aggregatedKeyShare = types.AggregatedKeyShare{
		Creator:   msg.Creator,
		Height:    msg.Height,
		Data:      msg.Data,
		PublicKey: msg.PublicKey,
	}

	k.SetAggregatedKeyShare(
		ctx,
		aggregatedKeyShare,
	)
	return &types.MsgCreateAggregatedKeyShareResponse{}, nil
}
