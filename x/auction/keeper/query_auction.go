package keeper

import (
	"context"
	"cosmossdk.io/store/prefix"
	"github.com/Fairblock/fairyring/x/auction/types"
	common "github.com/Fairblock/fairyring/x/common/types"
	"github.com/cosmos/cosmos-sdk/runtime"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) AuctionAll(
	c context.Context,
	req *types.QueryAuctionAllRequest,
) (*types.QueryAuctionAllResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	auctions := make([]*common.AuctionDetail, 0)
	ctx := sdk.UnwrapSDKContext(c)

	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	auctionStore := prefix.NewStore(store, types.KeyPrefix(types.AuctionDetailListKeyPrefix))

	pageRes, err := query.Paginate(auctionStore, req.Pagination, func(key []byte, value []byte) error {
		var auctionDetailList common.AuctionDetailList
		if err := k.cdc.Unmarshal(value, &auctionDetailList); err != nil {
			return err
		}
		for _, v := range auctionDetailList.AuctionDetail {
			auctions = append(auctions, &v)
		}
		return nil
	})
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAuctionAllResponse{
		AuctionDetails: auctions,
		Pagination:     pageRes,
	}, nil
}

func (k Keeper) Auction(
	c context.Context,
	req *types.QueryAuctionRequest,
) (*types.QueryAuctionResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(c)
	height, id, err := types.DecodeAuctionIdentity(req.Identity)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	auction, found := k.GetAuctionDetail(ctx, height, id)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryAuctionResponse{AuctionDetail: &auction}, nil
}
