package keeper_test

import (
	"context"
	"strconv"
	"testing"

	"github.com/Fairblock/fairyring/testutil/random"
	"github.com/Fairblock/fairyring/testutil/sample"
	commontypes "github.com/Fairblock/fairyring/x/common/types"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNRequestId(keeper keeper.Keeper, ctx context.Context, n int) []types.RequestId {
	items := make([]types.RequestId, n)
	for i := range items {
		items[i].Creator = sample.AccAddress()
		items[i].ReqId = random.RandHex(16)

		keeper.SetRequestId(ctx, items[i])
	}
	return items
}

func TestRequestIdGet(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNRequestId(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetRequestId(ctx,
			item.Creator,
			item.ReqId,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}

func TestRequestIdGetAll(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNRequestId(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllRequestId(ctx)),
	)
}

func createNPrivateRequestId(keeper keeper.Keeper, ctx context.Context, n int) []types.PrivateRequest {
	items := make([]types.PrivateRequest, n)
	for i := range items {
		items[i].Creator = sample.AccAddress()
		items[i].Identity = random.RandHex(16)
		items[i].PrivateDecryptionKeys = make([]*commontypes.PrivateDecryptionKey, 0)

		keeper.SetPrivateRequest(ctx, items[i])
	}
	return items
}

func TestPrivateRequestIdGet(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNPrivateRequestId(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetPrivateRequest(ctx,
			item.Identity,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}

func TestPrivateRequestIdGetAll(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNPrivateRequestId(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllPrivateRequest(ctx)),
	)
}
