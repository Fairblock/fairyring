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

func (k Keeper) GeneralIdentity(
	c context.Context,
	req *types.QueryGeneralIdentityRequest,
) (*types.QueryGeneralIdentityResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(c)

	entry, found := k.GetEntryWithTxList(ctx, req.Identity)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryGeneralIdentityResponse{RequestDetails: &entry}, nil
}

func (k Keeper) GeneralIdentityAll(
	c context.Context,
	req *types.QueryGeneralIdentityAllRequest,
) (*types.QueryGeneralIdentityAllResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(c)

	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.GenEncTxKeyPrefix))
	entryStore := prefix.NewStore(store, types.KeyPrefix(types.GenEncTxEntryKeyPrefix))

	var keyshares []*types.IdentityExecutionEntry

	pageRes, err := query.Paginate(entryStore, req.Pagination, func(key []byte, value []byte) error {
		var keyshare types.IdentityExecutionEntry
		if err := k.cdc.Unmarshal(value, &keyshare); err != nil {
			return err
		}

		keyshare = identityEntryWithTxList(keyshare, k.getGeneralEncryptedTxsByIdentity(ctx, keyshare.Identity))
		keyshares = append(keyshares, &keyshare)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryGeneralIdentityAllResponse{
		RequestDetailsList: keyshares,
		Pagination:         pageRes,
	}, nil
}
