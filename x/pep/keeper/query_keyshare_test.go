package keeper_test

import (
	"github.com/Fairblock/fairyring/testutil/random"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"strconv"
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestKeyShareReqSingle(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)

	out := createNGeneralEncryptedTxEntry(&keeper, wctx, 5)

	for _, tc := range []struct {
		desc     string
		request  *types.QueryKeyshareRequest
		response *types.QueryKeyshareResponse
		err      error
		errMsg   string
	}{
		{
			desc: "First item",
			request: &types.QueryKeyshareRequest{
				ReqId: out[0].RequestId,
			},
			response: &types.QueryKeyshareResponse{
				Keyshare: &out[0],
			},
		},
		{
			desc: "Not found",
			request: &types.QueryKeyshareRequest{
				ReqId: random.RandHex(64),
			},
			err: status.Error(codes.NotFound, "not found"),
		},
		{
			desc:    "Invalid request",
			request: nil,
			err:     status.Error(codes.InvalidArgument, "invalid request"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.KeyshareReq(wctx, tc.request)
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

func TestKeyshareReqAll(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNGeneralEncryptedTxEntry(&keeper, ctx, 5)

	resp, err := keeper.KeyshareReqAll(wctx, &types.QueryAllKeyshareRequest{
		Pagination: &query.PageRequest{
			Key:        nil,
			Offset:     0,
			Limit:      0,
			CountTotal: false,
		},
	})
	require.NoError(t, err)
	require.Equal(t, len(resp.Keyshares), len(msgs))

	check := make([]types.GenEncTxExecutionQueue, len(resp.Keyshares))
	for i := range resp.Keyshares {
		check[i] = *resp.Keyshares[i]
	}

	require.ElementsMatch(t,
		nullify.Fill(msgs),
		nullify.Fill(check),
	)
}

func TestKeyshareReqPaginated(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNGeneralEncryptedTxEntry(&keeper, ctx, 5)

	request := func(next []byte, offset, limit uint64, total bool) *types.QueryAllKeyshareRequest {
		return &types.QueryAllKeyshareRequest{
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
			resp, err := keeper.KeyshareReqAll(wctx, request(nil, uint64(i), uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.Keyshares), step)

			check := make([]types.GenEncTxExecutionQueue, len(resp.Keyshares))
			for j := range resp.Keyshares {
				check[j] = *resp.Keyshares[j]
			}

			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(check),
			)
		}
	})
	t.Run("ByKey", func(t *testing.T) {
		step := 2
		var next []byte
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.KeyshareReqAll(wctx, request(next, 0, uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.Keyshares), step)

			check := make([]types.GenEncTxExecutionQueue, len(resp.Keyshares))
			for j := range resp.Keyshares {
				check[j] = *resp.Keyshares[j]
			}

			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(check),
			)
			next = resp.Pagination.NextKey
		}
	})
	t.Run("Total", func(t *testing.T) {
		resp, err := keeper.KeyshareReqAll(wctx, request(nil, 0, 0, true))
		require.NoError(t, err)
		require.Equal(t, len(msgs), int(resp.Pagination.Total))

		check := make([]types.GenEncTxExecutionQueue, len(resp.Keyshares))
		for j := range resp.Keyshares {
			check[j] = *resp.Keyshares[j]
		}

		require.ElementsMatch(t,
			nullify.Fill(msgs),
			nullify.Fill(check),
		)
	})
	t.Run("InvalidRequest", func(t *testing.T) {
		_, err := keeper.KeyshareReqAll(wctx, nil)
		require.ErrorIs(t, err, status.Error(codes.InvalidArgument, "invalid request"))
	})
}
