package keeper

import (
	"context"
	"encoding/hex"

	"github.com/Fairblock/fairyring/x/ckks/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) GetPublicKey(goCtx context.Context, req *types.QueryGetPublicKeyRequest) (*types.QueryGetPublicKeyResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	pkBytes := k.GetAggregatedPKGKey(ctx)

	return &types.QueryGetPublicKeyResponse{Pk: hex.EncodeToString(pkBytes)}, nil
}
