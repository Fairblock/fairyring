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

func (k Keeper) FairblockNonceAll(c context.Context, req *types.QueryAllFairblockNonceRequest) (*types.QueryAllFairblockNonceResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var fairblockNonces []types.FairblockNonce
	ctx := sdk.UnwrapSDKContext(c)

	store := ctx.KVStore(k.storeKey)
	fairblockNonceStore := prefix.NewStore(store, types.KeyPrefix(types.FairblockNonceKeyPrefix))

	pageRes, err := query.Paginate(fairblockNonceStore, req.Pagination, func(key []byte, value []byte) error {
		var fairblockNonce types.FairblockNonce
		if err := k.cdc.Unmarshal(value, &fairblockNonce); err != nil {
			return err
		}

		fairblockNonces = append(fairblockNonces, fairblockNonce)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllFairblockNonceResponse{FairblockNonce: fairblockNonces, Pagination: pageRes}, nil
}

func (k Keeper) FairblockNonce(c context.Context, req *types.QueryGetFairblockNonceRequest) (*types.QueryGetFairblockNonceResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(c)

	val, found := k.GetFairblockNonce(
		ctx,
		req.Address,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryGetFairblockNonceResponse{FairblockNonce: val}, nil
}
