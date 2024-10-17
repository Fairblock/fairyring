package keeper_test

import (
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

func TestValidatorSetQuerySingle(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNValidatorSet(&keeper, ctx, 2)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryValidatorSetRequest
		response *types.QueryValidatorSetResponse
		err      error
	}{
		{
			desc: "First",
			request: &types.QueryValidatorSetRequest{
				Index: msgs[0].Index,
			},
			response: &types.QueryValidatorSetResponse{ValidatorSet: msgs[0]},
		},
		{
			desc: "Second",
			request: &types.QueryValidatorSetRequest{
				Index: msgs[1].Index,
			},
			response: &types.QueryValidatorSetResponse{ValidatorSet: msgs[1]},
		},
		{
			desc: "KeyNotFound",
			request: &types.QueryValidatorSetRequest{
				Index: sample.AccAddress(),
			},
			err: status.Error(codes.NotFound, "not found"),
		},
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.ValidatorSet(wctx, tc.request)
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

func TestValidatorSetQueryAllNoPagination(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNValidatorSet(&keeper, ctx, 10)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryValidatorSetAllRequest
		response *types.QueryValidatorSetAllResponse
		err      error
	}{
		{
			desc: "QueryAllValidatorSet",
			request: &types.QueryValidatorSetAllRequest{
				Pagination: &query.PageRequest{
					Key:        nil,
					Offset:     0,
					Limit:      0,
					CountTotal: false,
					Reverse:    false,
				},
			},
			response: &types.QueryValidatorSetAllResponse{
				ValidatorSet: msgs,
				Pagination: &query.PageResponse{
					NextKey: nil,
					Total:   10,
				},
			},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.ValidatorSetAll(wctx, tc.request)
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

func TestValidatorSetQueryPaginated(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNValidatorSet(&keeper, ctx, 5)

	request := func(
		next []byte,
		offset,
		limit uint64,
		total bool,
	) *types.QueryValidatorSetAllRequest {
		return &types.QueryValidatorSetAllRequest{
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
			resp, err := keeper.ValidatorSetAll(wctx, request(nil, uint64(i), uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.ValidatorSet), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.ValidatorSet),
			)
		}
	})
	t.Run("ByKey", func(t *testing.T) {
		step := 2
		var next []byte
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.ValidatorSetAll(wctx, request(next, 0, uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.ValidatorSet), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.ValidatorSet),
			)
			next = resp.Pagination.NextKey
		}
	})
	t.Run("Total", func(t *testing.T) {
		resp, err := keeper.ValidatorSetAll(wctx, request(nil, 0, 0, true))
		require.NoError(t, err)
		require.Equal(t, len(msgs), int(resp.Pagination.Total))
		require.ElementsMatch(t,
			nullify.Fill(msgs),
			nullify.Fill(resp.ValidatorSet),
		)
	})
	t.Run("InvalidRequest", func(t *testing.T) {
		_, err := keeper.ValidatorSetAll(wctx, nil)
		require.ErrorIs(t, err, status.Error(codes.InvalidArgument, "invalid request"))
	})
}
