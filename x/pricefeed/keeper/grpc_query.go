package keeper

import (
	"context"
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"fairyring/x/pricefeed/types"
)

type Querier struct {
	Keeper
}

var _ types.QueryServer = Querier{}

func (k Querier) Params(c context.Context, req *types.QueryParamsRequest) (*types.QueryParamsResponse, error) {
	ctx := sdk.UnwrapSDKContext(c)
	return &types.QueryParamsResponse{
		Params: k.GetParams(ctx),
	}, nil
}

func (k Querier) SymbolRequest(
	c context.Context, req *types.QuerySymbolRequest,
) (*types.QuerySymbolRequestResponse, error) {
	ctx := sdk.UnwrapSDKContext(c)

	sr, err := k.GetSymbolRequest(ctx, req.Symbol)
	if err != nil {
		return nil, err
	}

	return &types.QuerySymbolRequestResponse{
		SymbolRequest: &sr,
	}, nil
}

func (k Querier) SymbolRequests(
	c context.Context, _ *types.QuerySymbolRequests,
) (*types.QuerySymbolRequestsResponse, error) {
	ctx := sdk.UnwrapSDKContext(c)

	srs := k.GetAllSymbolRequests(ctx)

	return &types.QuerySymbolRequestsResponse{
		SymbolRequests: srs,
	}, nil
}

func (k Querier) Price(c context.Context, req *types.QueryPrice) (*types.QueryPriceResponse, error) {
	ctx := sdk.UnwrapSDKContext(c)

	p, found := k.GetPrice(ctx, req.Symbol)
	if !found {
		return nil, sdkerrors.Wrapf(types.ErrPriceNotFound, "symbol: %s", req.Symbol)
	}

	return &types.QueryPriceResponse{
		Price: &p,
	}, nil
}

func (k Querier) CurrentNonce(goCtx context.Context, req *types.QueryCurrentNonceRequest) (*types.QueryCurrentNonceResponse, error) {
	logrus.Info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
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