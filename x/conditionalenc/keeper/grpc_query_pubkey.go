package keeper

import (
	"context"
	"fairyring/x/conditionalenc/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// PubKey returns the lates public keys
func (k Keeper) PubKey(goCtx context.Context, req *types.QueryPubKeyRequest) (*types.QueryPubKeyResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var activePubKey types.ActivePubKey
	var queuedPubKey types.QueuedPubKey

	store := ctx.KVStore(k.storeKey)
	b := store.Get(types.KeyPrefix(types.ActivePubKeyPrefix))
	if b == nil {
		return nil, status.Error(codes.Internal, "Active Public Key does not exists")
	}
	k.cdc.MustUnmarshal(b, &activePubKey)

	b = store.Get(types.KeyPrefix(types.QueuedPubKeyPrefix))
	if b != nil {
		k.cdc.MustUnmarshal(b, &queuedPubKey)
	}

	return &types.QueryPubKeyResponse{ActivePubKey: activePubKey, QueuedPubKey: queuedPubKey}, nil
}
