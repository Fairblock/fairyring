package keeper_test

import (
	"strconv"
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestCommitmentsQuery(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	msgs := createNCommitments(&keeper, ctx, 1)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryCommitmentsRequest
		response *types.QueryCommitmentsResponse
		err      error
	}{
		{
			desc:    "QueryCommitments",
			request: &types.QueryCommitmentsRequest{},
			response: &types.QueryCommitmentsResponse{
				ActiveCommitments: &msgs[0],
				QueuedCommitments: &msgs[0],
			},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.Commitments(wctx, tc.request)
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
