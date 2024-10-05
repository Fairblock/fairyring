package keeper

import (
	"context"
	"cosmossdk.io/store/prefix"
	"github.com/cosmos/cosmos-sdk/runtime"
	"github.com/cosmos/cosmos-sdk/types/query"

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

	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxKeyPrefix))

	var keyshares []*types.GenEncTxExecutionQueue

	pageRes, err := query.Paginate(store, req.Pagination, func(key []byte, value []byte) error {
		var keyshare types.GenEncTxExecutionQueue
		if err := k.cdc.Unmarshal(value, &keyshare); err != nil {
			return err
		}

		keyshares = append(keyshares, &keyshare)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllKeyshareResponse{Keyshares: keyshares, Pagination: pageRes}, nil
}
