package keeper_test

import (
	"strconv"
	"testing"

	keepertest "fairyring/testutil/keeper"
	"fairyring/testutil/nullify"
	"fairyring/x/fairyring/keeper"
	"fairyring/x/fairyring/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createLatestPubKey(keeper *keeper.Keeper, ctx sdk.Context) types.LatestPubKey {
	item := types.LatestPubKey{
		PublicKey: "latest_pub_key_test",
	}
	nullify.Fill(item)
	keeper.SetLatestPubKey(ctx, item)
	return item
}

func TestLatestPubKeyGet(t *testing.T) {
	keeper, ctx := keepertest.FairyringKeeper(t)
	item := createLatestPubKey(keeper, ctx)
	rst, found := keeper.GetLatestPubKey(ctx)
	require.True(t, found)
	require.Equal(t,
		nullify.Fill(&item),
		nullify.Fill(&rst),
	)
}
