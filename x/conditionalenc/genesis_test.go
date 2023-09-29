package conditionalenc_test

import (
	"testing"

	keepertest "fairyring/testutil/keeper"
	"fairyring/testutil/nullify"
	pep "fairyring/x/conditionalenc"
	"fairyring/x/conditionalenc/types"

	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),
		EncryptedTxArray: []types.EncryptedTxArray{
			{
				EncryptedTx: []types.EncryptedTx{
					{
						TargetCondition: "0",
						Index:           0,
					},
					{
						TargetCondition: "0",
						Index:           1,
					},
				},
			},
			{
				EncryptedTx: []types.EncryptedTx{
					{
						TargetCondition: "1",
						Index:           0,
					},
					{
						TargetCondition: "1",
						Index:           1,
					},
				},
			},
		},
		ConditionalencNonceList: []types.ConditionalencNonce{
			{
				Address: "0",
			},
			{
				Address: "1",
			},
		},
		AggregatedKeyShareList: []types.AggregatedKeyShare{
			{
				Condition: "0",
			},
			{
				Condition: "1",
			},
		},
		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.ConditionalEncKeeper(t)
	pep.InitGenesis(ctx, *k, genesisState)
	got := pep.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	require.Equal(t, genesisState.PortId, got.PortId)

	require.ElementsMatch(t, genesisState.EncryptedTxArray, got.EncryptedTxArray)
	require.ElementsMatch(t, genesisState.ConditionalencNonceList, got.ConditionalencNonceList)
	require.ElementsMatch(t, genesisState.AggregatedKeyShareList, got.AggregatedKeyShareList)
	// this line is used by starport scaffolding # genesis/test/assert
}
