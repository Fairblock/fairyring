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

func TestAggregatedKeyShareQuerySingle(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNAggregatedKeyShare(&keeper, ctx, 2)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryGetAggregatedKeyShareRequest
		response *types.QueryGetAggregatedKeyShareResponse
		err      error
	}{
		{
			desc: "First",
			request: &types.QueryGetAggregatedKeyShareRequest{
				Height: msgs[0].Height,
			},
			response: &types.QueryGetAggregatedKeyShareResponse{AggregatedKeyShare: msgs[0]},
		},
		{
			desc: "Second",
			request: &types.QueryGetAggregatedKeyShareRequest{
				Height: msgs[1].Height,
			},
			response: &types.QueryGetAggregatedKeyShareResponse{AggregatedKeyShare: msgs[1]},
		},
		{
			desc: "KeyNotFound",
			request: &types.QueryGetAggregatedKeyShareRequest{
				Height: msgs[1].Height * 2,
			},
			err: status.Error(codes.NotFound, "not found"),
		},
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.AggregatedKeyShare(wctx, tc.request)
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

func TestAggregatedKeyShareQueryAllNoPagination(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNAggregatedKeyShare(&keeper, ctx, 10)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryAllAggregatedKeyShareRequest
		response *types.QueryAllAggregatedKeyShareResponse
		err      error
	}{
		{
			desc: "QueryAll",
			request: &types.QueryAllAggregatedKeyShareRequest{
				Pagination: &query.PageRequest{
					Key:        nil,
					Offset:     0,
					Limit:      0,
					CountTotal: false,
					Reverse:    false,
				},
			},
			response: &types.QueryAllAggregatedKeyShareResponse{
				AggregatedKeyShare: msgs,
				Pagination: &query.PageResponse{
					NextKey: nil,
					Total:   10,
				},
			},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.AggregatedKeyShareAll(wctx, tc.request)
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

func TestAggregatedKeyShareQueryPaginated(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNAggregatedKeyShare(&keeper, ctx, 5)

	request := func(next []byte, offset, limit uint64, total bool) *types.QueryAllAggregatedKeyShareRequest {
		return &types.QueryAllAggregatedKeyShareRequest{
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
			resp, err := keeper.AggregatedKeyShareAll(wctx, request(nil, uint64(i), uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.AggregatedKeyShare), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.AggregatedKeyShare),
			)
		}
	})
	t.Run("ByKey", func(t *testing.T) {
		step := 2
		var next []byte
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.AggregatedKeyShareAll(wctx, request(next, 0, uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.AggregatedKeyShare), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.AggregatedKeyShare),
			)
			next = resp.Pagination.NextKey
		}
	})
	t.Run("Total", func(t *testing.T) {
		resp, err := keeper.AggregatedKeyShareAll(wctx, request(nil, 0, 0, true))
		require.NoError(t, err)
		require.Equal(t, len(msgs), int(resp.Pagination.Total))
		require.ElementsMatch(t,
			nullify.Fill(msgs),
			nullify.Fill(resp.AggregatedKeyShare),
		)
	})
	t.Run("InvalidRequest", func(t *testing.T) {
		_, err := keeper.AggregatedKeyShareAll(wctx, nil)
		require.ErrorIs(t, err, status.Error(codes.InvalidArgument, "invalid request"))
	})
}
