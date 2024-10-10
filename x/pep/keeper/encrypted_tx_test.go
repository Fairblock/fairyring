package keeper_test

import (
	"github.com/Fairblock/fairyring/testutil/random"
	"github.com/Fairblock/fairyring/testutil/sample"
	"math/rand"
	"strconv"
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNEncryptedTx(keeper *keeper.Keeper, ctx sdk.Context, n int) (items []types.EncryptedTxArray) {
	items = make([]types.EncryptedTxArray, n)
	for i := range items { // i is block height
		items[i].EncryptedTx = make([]types.EncryptedTx, n)
		for j := 0; j < n; j++ { // j is encrypted tx index
			items[i].EncryptedTx[j].Creator = sample.AccAddress()
			items[i].EncryptedTx[j].Data = random.RandHex(32)
			items[i].EncryptedTx[j].TargetHeight = uint64(i)
			items[i].EncryptedTx[j].Index = uint64(j)
		}
		keeper.SetEncryptedTx(ctx, uint64(i), items[i])
	}

	return items
}

func TestEncryptedTxAppend(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	appendTx1 := types.EncryptedTx{
		TargetHeight: rand.Uint64(),
		Data:         random.RandHex(32),
		Creator:      sample.AccAddress(),
	}
	tx1Index := keeper.AppendEncryptedTx(ctx, appendTx1)
	_, found := keeper.GetEncryptedTx(ctx,
		appendTx1.TargetHeight,
		tx1Index,
	)
	require.True(t, found)
	appendTx2 := types.EncryptedTx{
		TargetHeight: appendTx1.TargetHeight,
		Data:         random.RandHex(32),
		Creator:      sample.AccAddress(),
	}
	tx2Index := keeper.AppendEncryptedTx(ctx, appendTx2)
	_, found = keeper.GetEncryptedTx(ctx,
		appendTx2.TargetHeight,
		tx2Index,
	)
	require.True(t, found)

	arr := keeper.GetEncryptedTxAllFromHeight(ctx, appendTx1.TargetHeight)
	require.Equal(t,
		nullify.Fill(2),
		nullify.Fill(len(arr.EncryptedTx)))
}

func TestEncryptedTxGet(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNEncryptedTx(&keeper, ctx, 10)
	for _, encryptedTxs := range items {
		for _, item := range encryptedTxs.EncryptedTx {
			rst, found := keeper.GetEncryptedTx(ctx,
				item.TargetHeight,
				item.Index,
			)
			require.True(t, found)
			require.Equal(t,
				nullify.Fill(&item),
				nullify.Fill(&rst),
			)
		}
	}
}

func TestEncryptedTxRemoveAllFromHeight(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNEncryptedTx(&keeper, ctx, 10)
	for i := range items {
		keeper.RemoveAllEncryptedTxFromHeight(ctx,
			uint64(i),
		)
		arr := keeper.GetEncryptedTxAllFromHeight(ctx,
			uint64(i),
		)
		require.Equal(t,
			nullify.Fill(0),
			nullify.Fill(len(arr.EncryptedTx)))
	}
}
func TestEncryptedTxSetProcessedHeight(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNEncryptedTx(&keeper, ctx, 10)
	for i, encryptedTxs := range items {
		for _, item := range encryptedTxs.EncryptedTx {
			keeper.SetEncryptedTxProcessedHeight(ctx,
				item.TargetHeight,
				item.Index,
				uint64(i*10),
			)
			rst, found := keeper.GetEncryptedTx(ctx,
				item.TargetHeight,
				item.Index,
			)
			require.True(t, found)
			require.Equal(t,
				nullify.Fill(rst.ProcessedAtChainHeight),
				nullify.Fill(uint64(i*10)),
			)
		}
	}
}
func TestEncryptedTxSetAllExpired(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNEncryptedTx(&keeper, ctx, 10)
	for _, encryptedTxs := range items {
		for _, item := range encryptedTxs.EncryptedTx {
			keeper.SetAllEncryptedTxExpired(ctx,
				item.TargetHeight,
			)
			rst, found := keeper.GetEncryptedTx(ctx,
				item.TargetHeight,
				item.Index,
			)
			require.True(t, found)
			require.True(t, rst.Expired)
		}
	}
}

func TestEncryptedTxGetAll(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNEncryptedTx(&keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllEncryptedArray(ctx)),
	)
}
