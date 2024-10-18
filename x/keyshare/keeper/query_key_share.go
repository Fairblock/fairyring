package keeper

import (
	"context"

	"github.com/cosmos/cosmos-sdk/runtime"

	"github.com/Fairblock/fairyring/x/keyshare/types"

	"cosmossdk.io/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// KeyShareAll returns the list of all keyshares submitted
func (k Keeper) KeyshareAll(
	c context.Context,
	req *types.QueryKeyshareAllRequest,
) (*types.QueryKeyshareAllResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var keyShares []types.Keyshare
	ctx := sdk.UnwrapSDKContext(c)

	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	keyShareStore := prefix.NewStore(store, types.KeyPrefix(types.KeyShareKeyPrefix))

	pageRes, err := query.Paginate(keyShareStore, req.Pagination, func(key []byte, value []byte) error {
		var keyShare types.Keyshare
		if err := k.cdc.Unmarshal(value, &keyShare); err != nil {
			return err
		}

		keyShares = append(keyShares, keyShare)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryKeyshareAllResponse{Keyshare: keyShares, Pagination: pageRes}, nil
}

// KeyShare returns a single keyshare submitted by a particular validator for a particular block height
func (k Keeper) Keyshare(
	c context.Context,
	req *types.QueryKeyshareRequest,
) (*types.QueryKeyshareResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(c)

	val, found := k.GetKeyShare(
		ctx,
		req.Validator,
		req.BlockHeight,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryKeyshareResponse{Keyshare: val}, nil
}
