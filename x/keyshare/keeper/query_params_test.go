package keeper_test

import (
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func TestParamsQuery(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	params := types.DefaultParams()
	keeper.SetParams(ctx, params)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryParamsRequest
		response *types.QueryParamsResponse
		err      error
	}{
		{
			desc:    "QueryParams",
			request: &types.QueryParamsRequest{},
			response: &types.QueryParamsResponse{
				Params: params,
			},
		},
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.Params(wctx, tc.request)
			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
				require.Equal(t,
					nullify.Fill(tc.response),
					nullify.Fill(response),
				)
			}
		})
	}
}
