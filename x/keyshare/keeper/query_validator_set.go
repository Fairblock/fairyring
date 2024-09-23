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

// ValidatorSetAll returns the complete list of registered validators
func (k Keeper) ValidatorSetAll(c context.Context, req *types.QueryAllValidatorSetRequest) (*types.QueryAllValidatorSetResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var validatorSets []types.ValidatorSet
	ctx := sdk.UnwrapSDKContext(c)

	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	validatorSetStore := prefix.NewStore(storeAdapter, types.KeyPrefix(types.ValidatorSetKeyPrefix))

	pageRes, err := query.Paginate(validatorSetStore, req.Pagination, func(key []byte, value []byte) error {
		var validatorSet types.ValidatorSet
		if err := k.cdc.Unmarshal(value, &validatorSet); err != nil {
			return err
		}

		validatorSets = append(validatorSets, validatorSet)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllValidatorSetResponse{ValidatorSet: validatorSets, Pagination: pageRes}, nil
}

func (k Keeper) ValidatorSet(c context.Context, req *types.QueryGetValidatorSetRequest) (*types.QueryGetValidatorSetResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(c)

	val, found := k.GetValidatorSet(
		ctx,
		req.Index,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryGetValidatorSetResponse{ValidatorSet: val}, nil
}
