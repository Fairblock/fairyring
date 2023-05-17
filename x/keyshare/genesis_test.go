package keyshare_test

import (
	"testing"

	keepertest "fairyring/testutil/keeper"
	"fairyring/testutil/nullify"
	"fairyring/x/keyshare"
	"fairyring/x/keyshare/types"

	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		ValidatorSetList: []types.ValidatorSet{
			{
				Index: "0",
			},
			{
				Index: "1",
			},
		},
		KeyShareList: []types.KeyShare{
			{
				Validator:   "0",
				BlockHeight: 0,
			},
			{
				Validator:   "1",
				BlockHeight: 1,
			},
		},
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
	keyshare.InitGenesis(ctx, *k, genesisState)
	got := keyshare.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	require.ElementsMatch(t, genesisState.ValidatorSetList, got.ValidatorSetList)
	require.ElementsMatch(t, genesisState.KeyShareList, got.KeyShareList)
	require.ElementsMatch(t, genesisState.AggregatedKeyShareList, got.AggregatedKeyShareList)
	// this line is used by starport scaffolding # genesis/test/assert
}
