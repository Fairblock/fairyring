package keeper_test

import (
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	keepertest "fairyring/testutil/keeper"
	"fairyring/testutil/nullify"
	"fairyring/x/fairblock/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestEncryptedTxQuerySingle(t *testing.T) {
	keeper, ctx := keepertest.FairblockKeeper(t)
	wctx := sdk.WrapSDKContext(ctx)
	msgs := createNEncryptedTx(keeper, ctx, 2)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryGetEncryptedTxRequest
		response *types.QueryGetEncryptedTxResponse
		err      error
	}{
		{
			desc: "First",
			request: &types.QueryGetEncryptedTxRequest{
				TargetHeight: msgs[0].EncryptedTx[0].TargetHeight,
				Index:        msgs[0].EncryptedTx[0].Index,
			},
			response: &types.QueryGetEncryptedTxResponse{EncryptedTx: msgs[0].EncryptedTx[0]},
		},
		{
			desc: "Second",
			request: &types.QueryGetEncryptedTxRequest{
				TargetHeight: msgs[1].EncryptedTx[0].TargetHeight,
				Index:        msgs[1].EncryptedTx[0].Index,
			},
			response: &types.QueryGetEncryptedTxResponse{EncryptedTx: msgs[1].EncryptedTx[0]},
		},
		{
			desc: "KeyNotFound",
			request: &types.QueryGetEncryptedTxRequest{
				TargetHeight: 100000,
				Index:        100000,
			},
			err: status.Error(codes.NotFound, "not found"),
		},
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.EncryptedTx(wctx, tc.request)
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

func TestEncryptedTxQueryPaginated(t *testing.T) {
	keeper, ctx := keepertest.FairblockKeeper(t)
	wctx := sdk.WrapSDKContext(ctx)
	msgs := createNEncryptedTx(keeper, ctx, 5)

	request := func(next []byte, offset, limit uint64, total bool) *types.QueryAllEncryptedTxRequest {
		return &types.QueryAllEncryptedTxRequest{
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
			resp, err := keeper.EncryptedTxAll(wctx, request(nil, uint64(i), uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.EncryptedTxArray), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.EncryptedTxArray),
			)
		}
	})
	t.Run("ByKey", func(t *testing.T) {
		step := 2
		var next []byte
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.EncryptedTxAll(wctx, request(next, 0, uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.EncryptedTxArray), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.EncryptedTxArray),
			)
			next = resp.Pagination.NextKey
		}
	})
	t.Run("Total", func(t *testing.T) {
		resp, err := keeper.EncryptedTxAll(wctx, request(nil, 0, 0, true))
		require.NoError(t, err)
		require.Equal(t, len(msgs), int(resp.Pagination.Total))
		require.ElementsMatch(t,
			nullify.Fill(msgs),
			nullify.Fill(resp.EncryptedTxArray),
		)
	})
	t.Run("InvalidRequest", func(t *testing.T) {
		_, err := keeper.EncryptedTxAll(wctx, nil)
		require.ErrorIs(t, err, status.Error(codes.InvalidArgument, "invalid request"))
	})
}
