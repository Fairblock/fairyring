package keyshare_test

import (
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	keyshare "github.com/Fairblock/fairyring/x/keyshare/module"
	"github.com/Fairblock/fairyring/x/keyshare/types"

	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),
		PortId: types.PortID,
		AggregatedKeyShareList: []types.AggregatedKeyShare{
			{
				Height: 0,
			},
			{
				Height: 1,
			},
		},
		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.KeyshareKeeper(t)
	keyshare.InitGenesis(ctx, k, genesisState)
	got := keyshare.ExportGenesis(ctx, k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	require.Equal(t, genesisState.PortId, got.PortId)

	require.ElementsMatch(t, genesisState.AggregatedKeyShareList, got.AggregatedKeyShareList)
	// this line is used by starport scaffolding # genesis/test/assert
}
