package keeper_test

import (
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/keyshare/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestGeneralKeyShareQuerySingle(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNGeneralKeyshares(&keeper, ctx, 2)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryGeneralKeyshareRequest
		response *types.QueryGeneralKeyshareResponse
		err      error
	}{
		{
			desc: "First",
			request: &types.QueryGeneralKeyshareRequest{
				Validator: msgs[0].Validator,
				IdType:    msgs[0].IdType,
				IdValue:   msgs[0].IdValue,
			},
			response: &types.QueryGeneralKeyshareResponse{GeneralKeyshare: msgs[0]},
		},
		{
			desc: "Second",
			request: &types.QueryGeneralKeyshareRequest{
				Validator: msgs[1].Validator,
				IdType:    msgs[1].IdType,
				IdValue:   msgs[1].IdValue,
			},
			response: &types.QueryGeneralKeyshareResponse{GeneralKeyshare: msgs[1]},
		},
		{
			desc: "KeyNotFound",
			request: &types.QueryGeneralKeyshareRequest{
				Validator: strconv.Itoa(100000),
				IdType:    strconv.Itoa(100000),
				IdValue:   strconv.Itoa(100000),
			},
			err: status.Error(codes.NotFound, "not found"),
		},
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.GeneralKeyshare(wctx, tc.request)
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

func TestGeneralKeyShareQueryAllNoPagination(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNGeneralKeyshares(&keeper, ctx, 10)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryGeneralKeyshareAllRequest
		response *types.QueryGeneralKeyshareAllResponse
		err      error
	}{
		{
			desc: "QueryAllGeneralKeyShare",
			request: &types.QueryGeneralKeyshareAllRequest{
				Pagination: &query.PageRequest{
					Key:        nil,
					Offset:     0,
					Limit:      0,
					CountTotal: false,
					Reverse:    false,
				},
			},
			response: &types.QueryGeneralKeyshareAllResponse{
				GeneralKeyshare: msgs,
				Pagination: &query.PageResponse{
					NextKey: nil,
					Total:   10,
				},
			},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.GeneralKeyshareAll(wctx, tc.request)
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

func TestGeneralKeyShareQueryPaginated(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNGeneralKeyshares(&keeper, ctx, 5)

	request := func(
		next []byte,
		offset,
		limit uint64,
		total bool,
	) *types.QueryGeneralKeyshareAllRequest {
		return &types.QueryGeneralKeyshareAllRequest{
			Pagination: &query.PageRequest{
				Key:        next,
				Offset:     offset,
				Limit:      limit,
				CountTotal: total,
			},
		}
	}
	t.Run("ByOffset", func(t *testing.T) {
		step := 2
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.GeneralKeyshareAll(wctx, request(nil, uint64(i), uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.GeneralKeyshare), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.GeneralKeyshare),
			)
		}
	})
	t.Run("ByKey", func(t *testing.T) {
		step := 2
		var next []byte
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.GeneralKeyshareAll(wctx, request(next, 0, uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.GeneralKeyshare), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.GeneralKeyshare),
			)
			next = resp.Pagination.NextKey
		}
	})
	t.Run("Total", func(t *testing.T) {
		resp, err := keeper.GeneralKeyshareAll(wctx, request(nil, 0, 0, true))
		require.NoError(t, err)
		require.Equal(t, len(msgs), int(resp.Pagination.Total))
		require.ElementsMatch(t,
			nullify.Fill(msgs),
			nullify.Fill(resp.GeneralKeyshare),
		)
	})
	t.Run("InvalidRequest", func(t *testing.T) {
		_, err := keeper.GeneralKeyshareAll(wctx, nil)
		require.ErrorIs(t, err, status.Error(codes.InvalidArgument, "invalid request"))
	})
}
