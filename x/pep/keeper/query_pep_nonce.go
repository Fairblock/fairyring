package keeper

import (
	"context"
	"github.com/cosmos/cosmos-sdk/runtime"

	"github.com/Fairblock/fairyring/x/pep/types"

	"cosmossdk.io/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// PepNonceAll returns the list of all Nonce
func (k Keeper) PepNonceAll(c context.Context, req *types.QueryAllPepNonceRequest) (*types.QueryAllPepNonceResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var pepNonces []types.PepNonce
	ctx := sdk.UnwrapSDKContext(c)

	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	pepNonceStore := prefix.NewStore(storeAdapter, types.KeyPrefix(types.PepNonceKeyPrefix))

	pageRes, err := query.Paginate(pepNonceStore, req.Pagination, func(key []byte, value []byte) error {
		var pepNonce types.PepNonce
		if err := k.cdc.Unmarshal(value, &pepNonce); err != nil {
			return err
		}

		pepNonces = append(pepNonces, pepNonce)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllPepNonceResponse{PepNonce: pepNonces, Pagination: pageRes}, nil
}

// PepNonce returns a single Nonce by address
func (k Keeper) PepNonce(c context.Context, req *types.QueryGetPepNonceRequest) (*types.QueryGetPepNonceResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(c)

	val, found := k.GetPepNonce(
		ctx,
		req.Address,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryGetPepNonceResponse{PepNonce: val}, nil
}
