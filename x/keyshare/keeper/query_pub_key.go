package keeper

import (
	"context"

	"cosmossdk.io/store/prefix"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// PubKey returns the lates public keys
func (k Keeper) Pubkey(goCtx context.Context, req *types.QueryPubkeyRequest) (*types.QueryPubkeyResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var activePubKey types.ActivePubKey
	var queuedPubKey types.QueuedPubKey

	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	b := store.Get(types.KeyPrefix(types.ActivePubKeyPrefix))
	if b == nil {
		return nil, status.Error(codes.Internal, "Active Public Key does not exists")
	}
	k.cdc.MustUnmarshal(b, &activePubKey)

	b = store.Get(types.KeyPrefix(types.QueuedPubKeyPrefix))
	if b != nil {
		k.cdc.MustUnmarshal(b, &queuedPubKey)
	}

	return &types.QueryPubkeyResponse{ActivePubkey: activePubKey, QueuedPubkey: queuedPubKey}, nil
}
