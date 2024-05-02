package keeper

import (
	"context"

	"cosmossdk.io/store/prefix"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) AuthorizedAddressAll(goCtx context.Context, req *types.QueryAllAuthorizedAddressRequest) (*types.QueryAllAuthorizedAddressResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var authorizedAddresss []types.AuthorizedAddress
	ctx := sdk.UnwrapSDKContext(goCtx)

	store := ctx.KVStore(k.storeKey)
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

	return &types.QueryAllAuthorizedAddressResponse{AuthorizedAddress: authorizedAddresss, Pagination: pageRes}, nil
}

func (k Keeper) AuthorizedAddress(goCtx context.Context, req *types.QueryGetAuthorizedAddressRequest) (*types.QueryGetAuthorizedAddressResponse, error) {
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

	return &types.QueryGetAuthorizedAddressResponse{AuthorizedAddress: val}, nil
}
