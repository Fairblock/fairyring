package keeper_test

import (
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	keepertest "fairyring/testutil/keeper"
	"fairyring/testutil/nullify"
	"fairyring/x/keyshare/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestLatestPubKeyQuerySingle(t *testing.T) {
	keeper, ctx := keepertest.KeyshareKeeper(t)
	wctx := sdk.WrapSDKContext(ctx)
	msgs := createLatestPubKey(keeper, ctx)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryLatestPubKeyRequest
		response *types.QueryLatestPubKeyResponse
		err      error
	}{
		{
			desc:     "First",
			request:  &types.QueryLatestPubKeyRequest{},
			response: &types.QueryLatestPubKeyResponse{LatestPubKey: msgs},
		},
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.LatestPubKey(wctx, tc.request)
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
