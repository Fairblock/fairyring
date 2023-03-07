package keeper

import (
	"context"

	"fairyring/x/fairyring/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) AggregatedKeyShareAll(goCtx context.Context, req *types.QueryAllAggregatedKeyShareRequest) (*types.QueryAllAggregatedKeyShareResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var aggregatedKeyShares []types.AggregatedKeyShare
	ctx := sdk.UnwrapSDKContext(goCtx)

	store := ctx.KVStore(k.storeKey)
	aggregatedKeyShareStore := prefix.NewStore(store, types.KeyPrefix(types.AggregatedKeyShareKeyPrefix))

	pageRes, err := query.Paginate(aggregatedKeyShareStore, req.Pagination, func(key []byte, value []byte) error {
		var aggregatedKeyShare types.AggregatedKeyShare
		if err := k.cdc.Unmarshal(value, &aggregatedKeyShare); err != nil {
			return err
		}

		aggregatedKeyShares = append(aggregatedKeyShares, aggregatedKeyShare)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllAggregatedKeyShareResponse{AggregatedKeyShare: aggregatedKeyShares, Pagination: pageRes}, nil
}

func (k Keeper) AggregatedKeyShare(goCtx context.Context, req *types.QueryGetAggregatedKeyShareRequest) (*types.QueryGetAggregatedKeyShareResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(goCtx)

	val, found := k.GetAggregatedKeyShare(
		ctx,
		req.Height,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryGetAggregatedKeyShareResponse{AggregatedKeyShare: val}, nil
}
