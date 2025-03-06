package keeper

import (
	"context"
	"cosmossdk.io/store/prefix"
	"github.com/Fairblock/fairyring/x/auction/types"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/cosmos/cosmos-sdk/runtime"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) RegisteredBidders(c context.Context, req *types.QueryRegisteredBiddersRequest) (*types.QueryRegisteredBiddersResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	bidders := make([]*commontypes.Bidder, 0)
	ctx := sdk.UnwrapSDKContext(c)

	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	bidderStore := prefix.NewStore(store, types.KeyPrefix(types.BidderKeyPrefix))

	pageRes, err := query.Paginate(bidderStore, req.Pagination, func(key []byte, value []byte) error {
		var bidder commontypes.Bidder
		if err := k.cdc.Unmarshal(value, &bidder); err != nil {
			return err
		}
		bidders = append(bidders, &bidder)
		return nil
	})
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryRegisteredBiddersResponse{
		Bidders:    bidders,
		Pagination: pageRes,
	}, nil
}
