package keeper

import (
	"context"

	"fairyring/x/fairblock/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) EncryptedTxAll(c context.Context, req *types.QueryAllEncryptedTxRequest) (*types.QueryAllEncryptedTxResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var encryptedTxs []types.EncryptedTx
	ctx := sdk.UnwrapSDKContext(c)

	store := ctx.KVStore(k.storeKey)
	encryptedTxStore := prefix.NewStore(store, types.KeyPrefix(types.EncryptedTxKeyPrefix))

	pageRes, err := query.Paginate(encryptedTxStore, req.Pagination, func(key []byte, value []byte) error {
		var encryptedTx types.EncryptedTx
		if err := k.cdc.Unmarshal(value, &encryptedTx); err != nil {
			return err
		}

		encryptedTxs = append(encryptedTxs, encryptedTx)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllEncryptedTxResponse{EncryptedTx: encryptedTxs, Pagination: pageRes}, nil
}

func (k Keeper) EncryptedTx(c context.Context, req *types.QueryGetEncryptedTxRequest) (*types.QueryGetEncryptedTxResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(c)

	val, found := k.GetEncryptedTx(
		ctx,
		req.TargetHeight,
		req.Index,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryGetEncryptedTxResponse{EncryptedTx: val}, nil
}
