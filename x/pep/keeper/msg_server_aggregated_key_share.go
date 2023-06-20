package keeper

import (
	"context"
	"fairyring/x/pep/types"
)

func (k msgServer) CreateAggregatedKeyShare(goCtx context.Context, msg *types.MsgCreateAggregatedKeyShare) (*types.MsgCreateAggregatedKeyShareResponse, error) {
	// No execution of this message is done here.
	// Validation and actual execution happens in the beginblock directly from the mempool

	return &types.MsgCreateAggregatedKeyShareResponse{}, nil
}
