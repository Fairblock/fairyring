package keeper_test

import (
	"math/rand"
	"strconv"
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/testutil/sample"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

func createLastSubmittedHeight(keeper *keeper.Keeper, ctx sdk.Context) (string, string) {
	randomValidator := sample.AccAddress()
	randomHeight := strconv.FormatUint(rand.Uint64(), 10)
	keeper.SetLastSubmittedHeight(ctx, randomValidator, randomHeight)
	return randomValidator, randomHeight
}

func TestLastSubmittedHeightGet(t *testing.T) {
	keeper, ctx, _ := keepertest.KeyshareKeeper(t)
	val, generatedHeight := createLastSubmittedHeight(&keeper, ctx)
	height := strconv.FormatUint(keeper.GetLastSubmittedHeight(ctx, val), 10)
	require.Equal(t,
		nullify.Fill(generatedHeight),
		nullify.Fill(height),
	)
}
