package keeper_test

import (
	"fmt"
	"strconv"
	"testing"

	keepertest "fairyring/testutil/keeper"
	"fairyring/testutil/nullify"
	"fairyring/x/conditionalenc/keeper"
	"fairyring/x/conditionalenc/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNEncryptedTx(keeper *keeper.Keeper, ctx sdk.Context, n int) (items []types.EncryptedTxArray) {

	for i := range items { // i is block height
		items[i].EncryptedTx = make([]types.EncryptedTx, n)
		for j := 0; j < n; j++ { // j is encrypted tx index
			items[i].EncryptedTx[j].Creator = fmt.Sprintf("Test Creator Height %d Index %d", i, j)
			items[i].EncryptedTx[j].Data = fmt.Sprintf("Test Data Height %d Index %d", i, j)
			items[i].EncryptedTx[j].TargetCondition = strconv.Itoa(i)
			items[i].EncryptedTx[j].Index = uint64(j)
		}
		keeper.SetEncryptedTx(ctx, strconv.Itoa(i), items[i])
	}

	return items
}

func TestEncryptedTxGet(t *testing.T) {
	keeper, ctx := keepertest.ConditionalEncKeeper(t)
	items := createNEncryptedTx(keeper, ctx, 10)
	for _, encryptedTxs := range items {
		for _, item := range encryptedTxs.EncryptedTx {
			rst, found := keeper.GetEncryptedTx(ctx,
				item.TargetCondition,
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
func TestEncryptedTxRemove(t *testing.T) {
	keeper, ctx := keepertest.ConditionalEncKeeper(t)
	items := createNEncryptedTx(keeper, ctx, 10)
	for _, encryptedTxs := range items {
		for _, item := range encryptedTxs.EncryptedTx {
			keeper.RemoveEncryptedTx(ctx,
				item.TargetCondition,
				item.Index,
			)
			_, found := keeper.GetEncryptedTx(ctx,
				item.TargetCondition,
				item.Index,
			)
			require.False(t, found)
		}
	}
}

func TestEncryptedTxGetAll(t *testing.T) {
	keeper, ctx := keepertest.ConditionalEncKeeper(t)
	items := createNEncryptedTx(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllEncryptedArray(ctx)),
	)
}
