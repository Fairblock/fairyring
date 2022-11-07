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

func (k Keeper) ValidatorSetAll(c context.Context, req *types.QueryAllValidatorSetRequest) (*types.QueryAllValidatorSetResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var validatorSets []types.ValidatorSet
	ctx := sdk.UnwrapSDKContext(c)

	store := ctx.KVStore(k.storeKey)
	validatorSetStore := prefix.NewStore(store, types.KeyPrefix(types.ValidatorSetKeyPrefix))

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
