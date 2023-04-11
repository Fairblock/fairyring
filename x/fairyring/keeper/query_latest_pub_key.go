package keeper

import (
	"context"
	"fairyring/x/fairyring/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// LatestPubKey returns the lates public key
func (k Keeper) LatestPubKey(goCtx context.Context, req *types.QueryLatestPubKeyRequest) (*types.QueryLatestPubKeyResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var pubKey types.LatestPubKey
	ctx := sdk.UnwrapSDKContext(goCtx)

	store := ctx.KVStore(k.storeKey)

	b := store.Get(types.KeyPrefix(types.LatestPubKeyPrefix))

	if b == nil {
		return nil, status.Error(codes.Internal, "Latest Public Key does not exists")
	}

	k.cdc.MustUnmarshal(b, &pubKey)

	return &types.QueryLatestPubKeyResponse{LatestPubKey: pubKey}, nil
}
