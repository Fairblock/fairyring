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

func (k Keeper) AuthorizedAddressAll(
	goCtx context.Context,
	req *types.QueryAuthorizedAddressAllRequest,
) (*types.QueryAuthorizedAddressAllResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var authorizedAddresss []types.AuthorizedAddress
	ctx := sdk.UnwrapSDKContext(goCtx)

	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	authorizedAddressStore := prefix.NewStore(store, types.KeyPrefix(types.AuthorizedAddressKeyPrefix))

	pageRes, err := query.Paginate(authorizedAddressStore, req.Pagination, func(key []byte, value []byte) error {
		var authorizedAddress types.AuthorizedAddress
		if err := k.cdc.Unmarshal(value, &authorizedAddress); err != nil {
			return err
		}

		authorizedAddresss = append(authorizedAddresss, authorizedAddress)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAuthorizedAddressAllResponse{
		AuthorizedAddress: authorizedAddresss,
		Pagination:        pageRes,
	}, nil
}

func (k Keeper) AuthorizedAddress(
	goCtx context.Context,
	req *types.QueryAuthorizedAddressRequest,
) (*types.QueryAuthorizedAddressResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(goCtx)

	val, found := k.GetAuthorizedAddress(
		ctx,
		req.Target,
	)
	if !found {
		return nil, types.ErrAuthorizedAddrNotFound
	}

	return &types.QueryAuthorizedAddressResponse{AuthorizedAddress: val}, nil
}
