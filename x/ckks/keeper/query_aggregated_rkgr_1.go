package keeper

import (
	"context"
	"encoding/hex"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) AggregatedRkgr1(goCtx context.Context, req *types.QueryAggregatedRkgr1Request) (*types.QueryAggregatedRkgr1Response, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)
	combined1, found := k.GetAggregatedRKGR1Key(ctx)
	hexCombined := hex.EncodeToString(combined1)
	if found {
		return &types.QueryAggregatedRkgr1Response{AggregatedRkR1: hexCombined}, nil
	}

	return &types.QueryAggregatedRkgr1Response{}, nil
}
