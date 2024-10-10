package keeper_test

import (
	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"testing"
)

func TestPubKeyQuery(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)
	activePubKey := createActivePubKeys(&keeper, wctx)
	queuedPubKey := createQueuedPubKeys(&keeper, wctx)
	for _, tc := range []struct {
		desc     string
		request  *types.QueryPubKeyRequest
		response *types.QueryPubKeyResponse
		err      error
	}{
		{
			desc:    "QueryPubKey",
			request: &types.QueryPubKeyRequest{},
			response: &types.QueryPubKeyResponse{
				ActivePubKey: activePubKey,
				QueuedPubKey: queuedPubKey,
			},
		},
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.PubKey(wctx, tc.request)
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
