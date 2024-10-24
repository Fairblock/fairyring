package keeper_test

import (
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func TestPubkeyQuery(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	activePubkey := createActivePubkeys(&keeper, wctx)
	queuedPubkey := createQueuedPubkeys(&keeper, wctx)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryPubkeyRequest
		response *types.QueryPubkeyResponse
		err      error
	}{
		{
			desc:    "QueryPubkey",
			request: &types.QueryPubkeyRequest{},
			response: &types.QueryPubkeyResponse{
				ActivePubkey: activePubkey,
				QueuedPubkey: queuedPubkey,
			},
		},
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.Pubkey(wctx, tc.request)
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
