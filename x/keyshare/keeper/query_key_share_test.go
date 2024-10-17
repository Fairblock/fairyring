package keeper_test

import (
	"math/rand"
	"strconv"
	"testing"

	"github.com/Fairblock/fairyring/testutil/sample"

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

func TestKeyShareQuerySingle(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNKeyShares(&keeper, ctx, 2)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryKeyShareRequest
		response *types.QueryKeyShareResponse
		err      error
	}{
		{
			desc: "First",
			request: &types.QueryKeyShareRequest{
				Validator:   msgs[0].Validator,
				BlockHeight: msgs[0].BlockHeight,
			},
			response: &types.QueryKeyShareResponse{KeyShare: msgs[0]},
		},
		{
			desc: "Second",
			request: &types.QueryKeyShareRequest{
				Validator:   msgs[1].Validator,
				BlockHeight: msgs[1].BlockHeight,
			},
			response: &types.QueryKeyShareResponse{KeyShare: msgs[1]},
		},
		{
			desc: "KeyNotFound",
			request: &types.QueryKeyShareRequest{
				Validator:   sample.AccAddress(),
				BlockHeight: rand.Uint64(),
			},
			err: status.Error(codes.NotFound, "not found"),
		},
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.KeyShare(wctx, tc.request)
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

func TestKeyShareQueryAllNoPagination(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNKeyShares(&keeper, ctx, 10)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryKeyShareAllRequest
		response *types.QueryKeyShareAllResponse
		err      error
	}{
		{
			desc: "QueryAllKeyShare",
			request: &types.QueryKeyShareAllRequest{
				Pagination: &query.PageRequest{
					Key:        nil,
					Offset:     0,
					Limit:      0,
					CountTotal: false,
					Reverse:    false,
				},
			},
			response: &types.QueryKeyShareAllResponse{
				KeyShare: msgs,
				Pagination: &query.PageResponse{
					NextKey: nil,
					Total:   10,
				},
			},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.KeyShareAll(wctx, tc.request)
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

func TestKeyShareQueryPaginated(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNKeyShares(&keeper, ctx, 5)

	request := func(
		next []byte,
		offset,
		limit uint64,
		total bool,
	) *types.QueryKeyShareAllRequest {
		return &types.QueryKeyShareAllRequest{
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
			resp, err := keeper.KeyShareAll(wctx, request(nil, uint64(i), uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.KeyShare), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.KeyShare),
			)
		}
	})
	t.Run("ByKey", func(t *testing.T) {
		step := 2
		var next []byte
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.KeyShareAll(wctx, request(next, 0, uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.KeyShare), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.KeyShare),
			)
			next = resp.Pagination.NextKey
		}
	})
	t.Run("Total", func(t *testing.T) {
		resp, err := keeper.KeyShareAll(wctx, request(nil, 0, 0, true))
		require.NoError(t, err)
		require.Equal(t, len(msgs), int(resp.Pagination.Total))
		require.ElementsMatch(t,
			nullify.Fill(msgs),
			nullify.Fill(resp.KeyShare),
		)
	})
	t.Run("InvalidRequest", func(t *testing.T) {
		_, err := keeper.KeyShareAll(wctx, nil)
		require.ErrorIs(t, err, status.Error(codes.InvalidArgument, "invalid request"))
	})
}
