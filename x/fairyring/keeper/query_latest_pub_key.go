package keeper

import (
	"context"
	"fairyring/x/fairyring/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) LatestPubKey(goCtx context.Context, req *types.QueryLatestPubKeyRequest) (*types.QueryLatestPubKeyResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var pubKey types.LatestPubKey
	ctx := sdk.UnwrapSDKContext(goCtx)

	store := ctx.KVStore(k.storeKey)
	pubKeyStore := prefix.NewStore(store, types.KeyPrefix(types.LatestPubKeyPrefix))

	b := pubKeyStore.Get(types.KeyPrefix(types.LatestPubKeyPrefix))

	if b == nil {
		return nil, status.Error(codes.Internal, "Latest Public Key does not exists")
	}

	return &types.QueryLatestPubKeyResponse{LatestPubKey: pubKey}, nil
}
