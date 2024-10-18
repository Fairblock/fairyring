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
	"github.com/Fairblock/fairyring/x/pep/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestPepNonceQuerySingle(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNPepNonce(&keeper, ctx, 2)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryPepNonceRequest
		response *types.QueryPepNonceResponse
		err      error
	}{
		{
			desc: "First",
			request: &types.QueryPepNonceRequest{
				Address: msgs[0].Address,
			},
			response: &types.QueryPepNonceResponse{PepNonce: msgs[0]},
		},
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.PepNonce(wctx, tc.request)
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

func TestPepNonceQueryAll(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNPepNonce(&keeper, ctx, 5)

	all, err := keeper.PepNonceAll(wctx, &types.QueryPepNonceAllRequest{
		Pagination: &query.PageRequest{
			Key:        nil,
			Offset:     0,
			Limit:      0,
			CountTotal: false,
		}},
	)
	require.NoError(t, err)
	require.Equal(t, nullify.Fill(len(all.PepNonce)), nullify.Fill(len(msgs)))
	require.ElementsMatch(t, nullify.Fill(all.PepNonce), nullify.Fill(msgs))
}

func TestPepNonceQueryPaginated(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNPepNonce(&keeper, ctx, 5)

	request := func(
		next []byte,
		offset,
		limit uint64,
		total bool,
	) *types.QueryPepNonceAllRequest {
		return &types.QueryPepNonceAllRequest{
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
			resp, err := keeper.PepNonceAll(wctx, request(nil, uint64(i), uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.PepNonce), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.PepNonce),
			)
		}
	})
	t.Run("ByKey", func(t *testing.T) {
		step := 2
		var next []byte
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.PepNonceAll(wctx, request(next, 0, uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.PepNonce), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.PepNonce),
			)
			next = resp.Pagination.NextKey
		}
	})
	t.Run("Total", func(t *testing.T) {
		resp, err := keeper.PepNonceAll(wctx, request(nil, 0, 0, true))
		require.NoError(t, err)
		require.Equal(t, len(msgs), int(resp.Pagination.Total))
		require.ElementsMatch(t,
			nullify.Fill(msgs),
			nullify.Fill(resp.PepNonce),
		)
	})
	t.Run("InvalidRequest", func(t *testing.T) {
		_, err := keeper.PepNonceAll(wctx, nil)
		require.ErrorIs(t, err, status.Error(codes.InvalidArgument, "invalid request"))
	})
}
