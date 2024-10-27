package keeper_test

import (
	"strconv"
	"testing"

	"github.com/Fairblock/fairyring/testutil/random"
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

func createNGeneralEncryptedTxEntry(
	keeper *keeper.Keeper,
	ctx sdk.Context,
	n int,
) (queue []types.IdentityExecutionEntry) {
	items := make([]types.GeneralEncryptedTxArray, n)
	queue = make([]types.IdentityExecutionEntry, n)
	for i := range items { // i is block height

		items[i].EncryptedTxs = make([]types.GeneralEncryptedTx, n)
		identity := random.RandHex(32)
		for j := 0; j < n; j++ { // j is encrypted tx index
			items[i].EncryptedTxs[j].Creator = sample.AccAddress()
			items[i].EncryptedTxs[j].Data = random.RandHex(32)
			items[i].EncryptedTxs[j].Identity = identity
			items[i].EncryptedTxs[j].Index = uint64(j)
		}
		queue[i] = types.IdentityExecutionEntry{
			Creator:       sample.AccAddress(),
			Identity:      identity,
			Pubkey:        random.RandHex(32),
			TxList:        &items[i],
			DecryptionKey: random.RandHex(32),
		}
		keeper.SetEntry(ctx, queue[i])
	}

	return queue
}

func TestGeneralEncryptedTxAppend(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	out := createNGeneralEncryptedTxEntry(&keeper, ctx, 1)
	appendTx1 := types.GeneralEncryptedTx{
		Identity: random.RandHex(32),
		Data:     random.RandHex(32),
		Creator:  sample.AccAddress(),
	}
	keeper.AppendTxToEntry(ctx, out[0].Identity, appendTx1)
	_, found := keeper.GetEntry(ctx, out[0].Identity)
	require.True(t, found)
}

func TestEntryGet(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNGeneralEncryptedTxEntry(&keeper, ctx, 10)
	for _, item := range items {
		out, found := keeper.GetEntry(ctx, item.Identity)
		require.True(t, found)
		require.Equal(t, nullify.Fill(out), nullify.Fill(item))
	}
}

func TestEntryRemove(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	items := createNGeneralEncryptedTxEntry(&keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveEntry(ctx, item.Identity)
		_, found := keeper.GetEntry(ctx, item.Identity)
		require.False(t, found)
	}
}
