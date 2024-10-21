package keeper_test

import (
	"strconv"
	"testing"

	"github.com/Fairblock/fairyring/testutil/random"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestKeyshareReqSingle(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)

	out := createNGeneralEncryptedTxEntry(&keeper, wctx, 5)

	for _, tc := range []struct {
		desc     string
		request  *types.QueryGeneralIdentityRequest
		response *types.QueryGeneralIdentityResponse
		err      error
		errMsg   string
	}{
		{
			desc: "First item",
			request: &types.QueryGeneralIdentityRequest{
				ReqId: out[0].RequestId,
			},
			response: &types.QueryGeneralIdentityResponse{
				RequestDetails: &out[0],
			},
		},
		{
			desc: "Not found",
			request: &types.QueryGeneralIdentityRequest{
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
			response, err := keeper.GeneralIdentity(wctx, tc.request)
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

	resp, err := keeper.GeneralIdentityAll(wctx, &types.QueryGeneralIdentityAllRequest{
		Pagination: &query.PageRequest{
			Key:        nil,
			Offset:     0,
			Limit:      0,
			CountTotal: false,
		},
	})
	require.NoError(t, err)
	require.Equal(t, len(resp.RequestDetailsList), len(msgs))

	check := make([]types.IdentityExecutionEntry, len(resp.RequestDetailsList))
	for i := range resp.RequestDetailsList {
		check[i] = *resp.RequestDetailsList[i]
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

	request := func(
		next []byte,
		offset,
		limit uint64,
		total bool,
	) *types.QueryGeneralIdentityAllRequest {
		return &types.QueryGeneralIdentityAllRequest{
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
			resp, err := keeper.GeneralIdentityAll(wctx, request(nil, uint64(i), uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.RequestDetailsList), step)

			check := make([]types.IdentityExecutionEntry, len(resp.RequestDetailsList))
			for j := range resp.RequestDetailsList {
				check[j] = *resp.RequestDetailsList[j]
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
			resp, err := keeper.GeneralIdentityAll(wctx, request(next, 0, uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.RequestDetailsList), step)

			check := make([]types.IdentityExecutionEntry, len(resp.RequestDetailsList))
			for j := range resp.RequestDetailsList {
				check[j] = *resp.RequestDetailsList[j]
			}

			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(check),
			)
			next = resp.Pagination.NextKey
		}
	})
	t.Run("Total", func(t *testing.T) {
		resp, err := keeper.GeneralIdentityAll(wctx, request(nil, 0, 0, true))
		require.NoError(t, err)
		require.Equal(t, len(msgs), int(resp.Pagination.Total))

		check := make([]types.IdentityExecutionEntry, len(resp.RequestDetailsList))
		for j := range resp.RequestDetailsList {
			check[j] = *resp.RequestDetailsList[j]
		}

		require.ElementsMatch(t,
			nullify.Fill(msgs),
			nullify.Fill(check),
		)
	})
	t.Run("InvalidRequest", func(t *testing.T) {
		_, err := keeper.GeneralIdentityAll(wctx, nil)
		require.ErrorIs(t, err, status.Error(codes.InvalidArgument, "invalid request"))
	})
}
