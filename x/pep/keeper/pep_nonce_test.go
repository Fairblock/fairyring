package keeper_test

import (
	"math/rand"
	"strconv"
	"testing"

	"github.com/Fairblock/fairyring/testutil/sample"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNPepNonce(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.PepNonce {
	items := make([]types.PepNonce, n)
	for i := range items {
		items[i].Address = sample.AccAddress()
		items[i].Nonce = rand.Uint64()

		keeper.SetPepNonce(ctx, items[i])
	}
	return items
}

func TestPepNonceGet(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNPepNonce(&keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetPepNonce(ctx,
			item.Address,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestPepNonceRemove(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNPepNonce(&keeper, ctx, 10)
	for _, item := range items {
		nonce, found := keeper.GetPepNonce(ctx,
			item.Address,
		)
		require.True(t, found)
		// pep nonce default is 1
		require.NotEqual(t, nullify.Fill(1), nullify.Fill(nonce.Nonce))

		keeper.RemovePepNonce(ctx,
			item.Address,
		)
		nonce, found = keeper.GetPepNonce(ctx,
			item.Address,
		)
		require.True(t, found)
		require.Equal(t, nullify.Fill(uint64(1)), nullify.Fill(nonce.Nonce))
	}
}

func TestPepNonceGetAll(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNPepNonce(&keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllPepNonce(ctx)),
	)
}
