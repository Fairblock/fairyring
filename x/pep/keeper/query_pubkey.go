package keeper

import (
	"context"

	"cosmossdk.io/store/prefix"
	"github.com/cosmos/cosmos-sdk/runtime"

	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/Fairblock/fairyring/x/pep/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Pubkey returns the lates public keys
func (k Keeper) Pubkey(
	goCtx context.Context,
	req *types.QueryPubkeyRequest,
) (*types.QueryPubkeyResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var activePubkey commontypes.ActivePublicKey
	var queuedPubkey commontypes.QueuedPublicKey

	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	b := store.Get(types.KeyPrefix(types.ActivePubkeyPrefix))
	if b == nil {
		return nil, status.Error(codes.Internal, "Active Public Key does not exists")
	}
	k.cdc.MustUnmarshal(b, &activePubkey)

	b = store.Get(types.KeyPrefix(types.QueuedPubkeyPrefix))
	if b != nil {
		k.cdc.MustUnmarshal(b, &queuedPubkey)
	}

	return &types.QueryPubkeyResponse{ActivePubkey: activePubkey, QueuedPubkey: queuedPubkey}, nil
}
