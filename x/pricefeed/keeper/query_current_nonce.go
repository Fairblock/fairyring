package keeper

import (
	"context"
	"strconv"

	"fairyring/x/pricefeed/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) CurrentNonce(goCtx context.Context, req *types.QueryCurrentNonceRequest) (*types.QueryCurrentNonceResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Process the query
	_ = ctx
	p, err := strconv.Atoi(req.Price)
	if err != nil {
		return &types.QueryCurrentNonceResponse{}, err
	}
	nonce := k.GetRepeatedPrice(ctx,types.Price{Symbol: req.Denom, Price: uint64(p)})
	return &types.QueryCurrentNonceResponse{Nonce: strconv.Itoa(int(nonce))}, nil
}
