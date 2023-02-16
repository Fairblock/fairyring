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

func (k Keeper) PubKeyIDAll(goCtx context.Context, req *types.QueryAllPubKeyIDRequest) (*types.QueryAllPubKeyIDResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var pubKeyIDs []types.PubKeyID
	ctx := sdk.UnwrapSDKContext(goCtx)

	store := ctx.KVStore(k.storeKey)
	pubKeyIDStore := prefix.NewStore(store, types.KeyPrefix(types.PubKeyIDKeyPrefix))

	pageRes, err := query.Paginate(pubKeyIDStore, req.Pagination, func(key []byte, value []byte) error {
		var pubKeyID types.PubKeyID
		if err := k.cdc.Unmarshal(value, &pubKeyID); err != nil {
			return err
		}

		pubKeyIDs = append(pubKeyIDs, pubKeyID)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllPubKeyIDResponse{PubKeyID: pubKeyIDs, Pagination: pageRes}, nil
}

func (k Keeper) PubKeyID(goCtx context.Context, req *types.QueryGetPubKeyIDRequest) (*types.QueryGetPubKeyIDResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(goCtx)

	val, found := k.GetPubKeyID(
		ctx,
		req.Height,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryGetPubKeyIDResponse{PubKeyID: val}, nil
}
