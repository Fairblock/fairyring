package keeper

import (
	"context"

	"github.com/FairBlock/fairyring/x/pep/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) CreateAggregatedKeyShare(goCtx context.Context, msg *types.MsgCreateAggregatedKeyShare) (*types.MsgCreateAggregatedKeyShareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	var aggregatedKeyShare = types.AggregatedKeyShare{
		Creator: msg.Creator,
		Height:  msg.Height,
		Data:    msg.Data,
	}

	k.SetAggregatedKeyShare(
		ctx,
		aggregatedKeyShare,
	)
	return &types.MsgCreateAggregatedKeyShareResponse{}, nil
}
