package keeper_test

import (
	"strconv"
	"testing"

	"github.com/Fairblock/fairyring/testutil/random"
	"github.com/Fairblock/fairyring/testutil/sample"
	types2 "github.com/Fairblock/fairyring/x/common/types"
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

func TestPrivateKeyshareReq(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)

	req := types.PrivateRequest{
		Creator:               sample.AccAddress(),
		ReqId:                 random.RandHex(16),
		Pubkey:                random.RandHex(96),
		PrivateDecryptionKeys: make([]*types2.PrivateDecryptionKey, 0),
	}

	keeper.SetPrivateRequest(wctx, req)

	for _, tc := range []struct {
		desc     string
		request  *types.QueryPrivateIdentityRequest
		response *types.QueryPrivateIdentityResponse
		err      error
	}{
		{
			desc: "ValidRequest",
			request: &types.QueryPrivateIdentityRequest{
				ReqId: req.ReqId,
			},
			response: &types.QueryPrivateIdentityResponse{
				Creator:               req.Creator,
				ReqId:                 req.ReqId,
				Pubkey:                req.Pubkey,
				PrivateDecryptionKeys: req.PrivateDecryptionKeys,
			},
		},
		{
			desc:    "InvalidRequest",
			request: nil,
			err:     status.Error(codes.InvalidArgument, "invalid request"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.PrivateIdentity(wctx, tc.request)
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
