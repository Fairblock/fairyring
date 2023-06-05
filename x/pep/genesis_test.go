package pep_test

import (
	"testing"

	keepertest "github.com/FairBlock/fairyring/testutil/keeper"
	"github.com/FairBlock/fairyring/testutil/nullify"
	"github.com/FairBlock/fairyring/x/pep"
	"github.com/FairBlock/fairyring/x/pep/types"

	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),
		EncryptedTxArray: []types.EncryptedTxArray{
			{
				EncryptedTx: []types.EncryptedTx{
					{
						TargetHeight: 0,
						Index:        0,
					},
					{
						TargetHeight: 0,
						Index:        1,
					},
				},
			},
			{
				EncryptedTx: []types.EncryptedTx{
					{
						TargetHeight: 1,
						Index:        0,
					},
					{
						TargetHeight: 1,
						Index:        1,
					},
				},
			},
		},
		PepNonceList: []types.PepNonce{
			{
				Address: "0",
			},
			{
				Address: "1",
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

	k, ctx := keepertest.PepKeeper(t)
	pep.InitGenesis(ctx, *k, genesisState)
	got := pep.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	require.Equal(t, genesisState.PortId, got.PortId)

	require.ElementsMatch(t, genesisState.EncryptedTxArray, got.EncryptedTxArray)
	require.ElementsMatch(t, genesisState.PepNonceList, got.PepNonceList)
	require.ElementsMatch(t, genesisState.AggregatedKeyShareList, got.AggregatedKeyShareList)
	// this line is used by starport scaffolding # genesis/test/assert
}
