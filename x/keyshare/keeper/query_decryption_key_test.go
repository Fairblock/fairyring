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

func TestDecryptionKeyQuerySingle(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNDecryptionKeys(&keeper, ctx, 2)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryDecryptionKeyRequest
		response *types.QueryDecryptionKeyResponse
		err      error
	}{
		{
			desc: "First",
			request: &types.QueryDecryptionKeyRequest{
				Height: msgs[0].Height,
			},
			response: &types.QueryDecryptionKeyResponse{DecryptionKey: msgs[0]},
		},
		{
			desc: "Second",
			request: &types.QueryDecryptionKeyRequest{
				Height: msgs[1].Height,
			},
			response: &types.QueryDecryptionKeyResponse{DecryptionKey: msgs[1]},
		},
		{
			desc: "KeyNotFound",
			request: &types.QueryDecryptionKeyRequest{
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
			response, err := keeper.DecryptionKey(wctx, tc.request)
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

func TestDecryptionKeyQueryAllNoPagination(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNDecryptionKeys(&keeper, ctx, 10)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryDecryptionKeyAllRequest
		response *types.QueryDecryptionKeyAllResponse
		err      error
	}{
		{
			desc: "QueryAll",
			request: &types.QueryDecryptionKeyAllRequest{
				Pagination: &query.PageRequest{
					Key:        nil,
					Offset:     0,
					Limit:      0,
					CountTotal: false,
					Reverse:    false,
				},
			},
			response: &types.QueryDecryptionKeyAllResponse{
				DecryptionKeys: msgs,
				Pagination: &query.PageResponse{
					NextKey: nil,
					Total:   10,
				},
			},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.DecryptionKeyAll(wctx, tc.request)
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

func TestDecryptionKeyQueryPaginated(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNDecryptionKeys(&keeper, ctx, 5)

	request := func(
		next []byte,
		offset,
		limit uint64,
		total bool,
	) *types.QueryDecryptionKeyAllRequest {
		return &types.QueryDecryptionKeyAllRequest{
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
			resp, err := keeper.DecryptionKeyAll(wctx, request(nil, uint64(i), uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.DecryptionKeys), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.DecryptionKeys),
			)
		}
	})
	t.Run("ByKey", func(t *testing.T) {
		step := 2
		var next []byte
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.DecryptionKeyAll(wctx, request(next, 0, uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.DecryptionKeys), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.DecryptionKeys),
			)
			next = resp.Pagination.NextKey
		}
	})
	t.Run("Total", func(t *testing.T) {
		resp, err := keeper.DecryptionKeyAll(wctx, request(nil, 0, 0, true))
		require.NoError(t, err)
		require.Equal(t, len(msgs), int(resp.Pagination.Total))
		require.ElementsMatch(t,
			nullify.Fill(msgs),
			nullify.Fill(resp.DecryptionKeys),
		)
	})
	t.Run("InvalidRequest", func(t *testing.T) {
		_, err := keeper.DecryptionKeyAll(wctx, nil)
		require.ErrorIs(t, err, status.Error(codes.InvalidArgument, "invalid request"))
	})
}
