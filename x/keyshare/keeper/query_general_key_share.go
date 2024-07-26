package keeper

import (
	"context"
	"github.com/cosmos/cosmos-sdk/runtime"

	"cosmossdk.io/store/prefix"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) GeneralKeyShareAll(goCtx context.Context, req *types.QueryAllGeneralKeyShareRequest) (*types.QueryAllGeneralKeyShareResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var generalKeyShares []types.GeneralKeyShare
	ctx := sdk.UnwrapSDKContext(goCtx)

	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	generalKeyShareStore := prefix.NewStore(store, types.KeyPrefix(types.GeneralKeyShareKeyPrefix))

	pageRes, err := query.Paginate(generalKeyShareStore, req.Pagination, func(key []byte, value []byte) error {
		var generalKeyShare types.GeneralKeyShare
		if err := k.cdc.Unmarshal(value, &generalKeyShare); err != nil {
			return err
		}

		generalKeyShares = append(generalKeyShares, generalKeyShare)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllGeneralKeyShareResponse{GeneralKeyShare: generalKeyShares, Pagination: pageRes}, nil
}

func (k Keeper) GeneralKeyShare(goCtx context.Context, req *types.QueryGetGeneralKeyShareRequest) (*types.QueryGetGeneralKeyShareResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(goCtx)

	val, found := k.GetGeneralKeyShare(
		ctx,
		req.Validator,
		req.IdType,
		req.IdValue,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryGetGeneralKeyShareResponse{GeneralKeyShare: val}, nil
}
