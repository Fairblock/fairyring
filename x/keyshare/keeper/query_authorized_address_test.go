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

func TestAuthorizedAddressQuerySingle(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNAuthorizedAddress(&keeper, ctx, 2)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryGetAuthorizedAddressRequest
		response *types.QueryGetAuthorizedAddressResponse
		err      error
	}{
		{
			desc: "First",
			request: &types.QueryGetAuthorizedAddressRequest{
				Target: msgs[0].Target,
			},
			response: &types.QueryGetAuthorizedAddressResponse{AuthorizedAddress: msgs[0]},
		},
		{
			desc: "Second",
			request: &types.QueryGetAuthorizedAddressRequest{
				Target: msgs[1].Target,
			},
			response: &types.QueryGetAuthorizedAddressResponse{AuthorizedAddress: msgs[1]},
		},
		{
			desc: "AuthorizedAddressNotFound",
			request: &types.QueryGetAuthorizedAddressRequest{
				Target: strconv.Itoa(100000),
			},
			err: types.ErrAuthorizedAddrNotFound,
		},
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.AuthorizedAddress(wctx, tc.request)
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

func TestAuthorizedAddressQueryAllNoPagination(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNAuthorizedAddress(&keeper, ctx, 12)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryAllAuthorizedAddressRequest
		response *types.QueryAllAuthorizedAddressResponse
		err      error
	}{
		{
			desc: "QueryAllAuthorizedAddress",
			request: &types.QueryAllAuthorizedAddressRequest{
				Pagination: &query.PageRequest{
					Key:        nil,
					Offset:     0,
					Limit:      0,
					CountTotal: false,
					Reverse:    false,
				},
			},
			response: &types.QueryAllAuthorizedAddressResponse{
				AuthorizedAddress: msgs,
				Pagination: &query.PageResponse{
					NextKey: nil,
					Total:   12,
				},
			},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.AuthorizedAddressAll(wctx, tc.request)
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

func TestAuthorizedAddressQueryPaginated(t *testing.T) {
	keeper, ctx, _, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNAuthorizedAddress(&keeper, ctx, 5)

	request := func(next []byte, offset, limit uint64, total bool) *types.QueryAllAuthorizedAddressRequest {
		return &types.QueryAllAuthorizedAddressRequest{
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
			resp, err := keeper.AuthorizedAddressAll(wctx, request(nil, uint64(i), uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.AuthorizedAddress), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.AuthorizedAddress),
			)
		}
	})
	t.Run("ByKey", func(t *testing.T) {
		step := 2
		var next []byte
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.AuthorizedAddressAll(wctx, request(next, 0, uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.AuthorizedAddress), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.AuthorizedAddress),
			)
			next = resp.Pagination.NextKey
		}
	})
	t.Run("Total", func(t *testing.T) {
		resp, err := keeper.AuthorizedAddressAll(wctx, request(nil, 0, 0, true))
		require.NoError(t, err)
		require.Equal(t, len(msgs), int(resp.Pagination.Total))
		require.ElementsMatch(t,
			nullify.Fill(msgs),
			nullify.Fill(resp.AuthorizedAddress),
		)
	})
	t.Run("InvalidRequest", func(t *testing.T) {
		_, err := keeper.AuthorizedAddressAll(wctx, nil)
		require.ErrorIs(t, err, status.Error(codes.InvalidArgument, "invalid request"))
	})
}
