package keeper

import (
	"context"
	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) KeyshareReq(c context.Context, req *types.QueryKeyshareRequest) (*types.QueryKeyshareResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(c)

	entry, found := k.GetEntry(ctx, req.ReqId)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryKeyshareResponse{Keyshare: &entry}, nil
}

func (k Keeper) KeyshareReqAll(c context.Context, req *types.QueryAllKeyshareRequest) (*types.QueryAllKeyshareResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(c)

	entries := k.GetAllGenEncTxEntry(ctx)

	var keyshares []*types.GenEncTxExecutionQueue
	for _, entry := range entries {
		keyshares = append(keyshares, &entry)
	}

	return &types.QueryAllKeyshareResponse{Keyshares: keyshares}, nil
}
