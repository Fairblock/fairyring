package keeper

import (
	"context"

	"fairyring/x/fairblock/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) FairblockExecutedNonceAll(c context.Context, req *types.QueryAllFairblockExecutedNonceRequest) (*types.QueryAllFairblockExecutedNonceResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var fairblockExecutedNonces []types.FairblockExecutedNonce
	ctx := sdk.UnwrapSDKContext(c)

	store := ctx.KVStore(k.storeKey)
	fairblockExecutedNonceStore := prefix.NewStore(store, types.KeyPrefix(types.FairblockExecutedNonceKeyPrefix))

	pageRes, err := query.Paginate(fairblockExecutedNonceStore, req.Pagination, func(key []byte, value []byte) error {
		var fairblockExecutedNonce types.FairblockExecutedNonce
		if err := k.cdc.Unmarshal(value, &fairblockExecutedNonce); err != nil {
			return err
		}

		fairblockExecutedNonces = append(fairblockExecutedNonces, fairblockExecutedNonce)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllFairblockExecutedNonceResponse{FairblockExecutedNonce: fairblockExecutedNonces, Pagination: pageRes}, nil
}

func (k Keeper) FairblockExecutedNonce(c context.Context, req *types.QueryGetFairblockExecutedNonceRequest) (*types.QueryGetFairblockExecutedNonceResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(c)

	val, found := k.GetFairblockExecutedNonce(
		ctx,
		req.Address,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryGetFairblockExecutedNonceResponse{FairblockExecutedNonce: val}, nil
}
