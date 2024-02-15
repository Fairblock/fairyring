package keeper

import (
	"context"
	"github.com/Fairblock/fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Commitments returns the list of all keyshares submitted
func (k Keeper) Commitments(c context.Context, req *types.QueryCommitmentsRequest) (*types.QueryCommitmentsResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var activeCommitments types.Commitments
	var queuedCommitments types.Commitments

	ctx := sdk.UnwrapSDKContext(c)
	store := ctx.KVStore(k.storeKey)

	activeCommitmentBytes := store.Get(types.KeyPrefix(types.ActiveCommitmentsPrefix))
	if activeCommitmentBytes == nil {
		return nil, status.Error(codes.Internal, "Active Commitments does not exists")
	}

	k.cdc.MustUnmarshal(activeCommitmentBytes, &activeCommitments)

	queuedCommitmentBytes := store.Get(types.KeyPrefix(types.QueuedCommitmentsPrefix))
	if queuedCommitmentBytes != nil {
		k.cdc.MustUnmarshal(queuedCommitmentBytes, &queuedCommitments)
	}

	return &types.QueryCommitmentsResponse{ActiveCommitments: &activeCommitments, QueuedCommitments: &queuedCommitments}, nil
}
