package keeper

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) VerifiableRandomness(goCtx context.Context, req *types.QueryVerifiableRandomnessQuery) (*types.QueryVerifiableRandomnessResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	aggrKeyArr := k.GetAllAggregatedKeyShare(ctx)

	if len(aggrKeyArr) == 0 {
		return nil, status.Error(codes.Internal, "aggregated key not found")
	}

	aggrKey := aggrKeyArr[len(aggrKeyArr)-1]
	aggrKeyBytes, err := hex.DecodeString(aggrKey.Data)
	if err != nil {
		return nil, status.Error(codes.Internal, "unable to decode aggregated key")
	}

	hash := sha256.New()
	hash.Write(aggrKeyBytes)
	hashedAggrKey := hash.Sum(nil)

	return &types.QueryVerifiableRandomnessResponse{Randomness: hex.EncodeToString(hashedAggrKey), Round: aggrKey.Height}, nil
}
