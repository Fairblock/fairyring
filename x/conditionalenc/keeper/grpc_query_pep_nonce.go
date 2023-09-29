package keeper

import (
	"context"

	"fairyring/x/conditionalenc/types"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// ConditionalencNonceAll returns the list of all Nonce
func (k Keeper) ConditionalencNonceAll(c context.Context, req *types.QueryAllConditionalencNonceRequest) (*types.QueryAllConditionalencNonceResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var ConditionalencNonces []types.ConditionalencNonce
	ctx := sdk.UnwrapSDKContext(c)

	store := ctx.KVStore(k.storeKey)
	ConditionalencNonceStore := prefix.NewStore(store, types.KeyPrefix(types.ConditionalencNonceKeyPrefix))

	pageRes, err := query.Paginate(ConditionalencNonceStore, req.Pagination, func(key []byte, value []byte) error {
		var ConditionalencNonce types.ConditionalencNonce
		if err := k.cdc.Unmarshal(value, &ConditionalencNonce); err != nil {
			return err
		}

		ConditionalencNonces = append(ConditionalencNonces, ConditionalencNonce)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllConditionalencNonceResponse{ConditionalencNonce: ConditionalencNonces, Pagination: pageRes}, nil
}

// ConditionalencNonce returns a single Nonce by address
func (k Keeper) ConditionalencNonce(c context.Context, req *types.QueryGetConditionalencNonceRequest) (*types.QueryGetConditionalencNonceResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(c)

	val, found := k.GetConditionalencNonce(
		ctx,
		req.Address,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryGetConditionalencNonceResponse{ConditionalencNonce: val}, nil
}
