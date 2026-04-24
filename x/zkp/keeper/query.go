package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/zkp/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var _ types.QueryServer = &Keeper{}

func (k Keeper) TrustedContracts(goCtx context.Context, req *types.TrustedContractsRequest) (*types.TrustedContractsResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)
	contracts := k.GetAllTrustedContracts(ctx)
	return &types.TrustedContractsResponse{ContractAddresses: contracts}, nil
}
