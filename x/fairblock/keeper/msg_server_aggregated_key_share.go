package keeper

import (
	"context"
	"fairyring/x/fairblock/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) CreateAggregatedKeyShare(goCtx context.Context, msg *types.MsgCreateAggregatedKeyShare) (*types.MsgCreateAggregatedKeyShareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

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
