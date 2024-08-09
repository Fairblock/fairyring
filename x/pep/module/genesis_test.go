package pep_test

import (
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	pep "github.com/Fairblock/fairyring/x/pep/module"
	"github.com/Fairblock/fairyring/x/pep/types"

	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),
		PortId: types.PortID,
		RequestIdList: []types.RequestId{
		{
			Creator: "0",
},
		{
			Creator: "1",
},
	},
	// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.PepKeeper(t)
	pep.InitGenesis(ctx, k, genesisState)
	got := pep.ExportGenesis(ctx, k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	require.Equal(t, genesisState.PortId, got.PortId)

	require.ElementsMatch(t, genesisState.RequestIdList, got.RequestIdList)
// this line is used by starport scaffolding # genesis/test/assert
}
