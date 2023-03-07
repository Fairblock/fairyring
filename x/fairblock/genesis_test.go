package fairblock_test

import (
	"testing"

	keepertest "fairyring/testutil/keeper"
	"fairyring/testutil/nullify"
	"fairyring/x/fairblock"
	"fairyring/x/fairblock/types"
	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),
		PortId: types.PortID,
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
		FairblockNonceList: []types.FairblockNonce{
			{
				Address: "0",
			},
			{
				Address: "1",
			},
		},
		FairblockExecutedNonceList: []types.FairblockExecutedNonce{
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

	k, ctx := keepertest.FairblockKeeper(t)
	fairblock.InitGenesis(ctx, *k, genesisState)
	got := fairblock.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	require.Equal(t, genesisState.PortId, got.PortId)

	require.ElementsMatch(t, genesisState.EncryptedTxArray, got.EncryptedTxArray)
	require.ElementsMatch(t, genesisState.FairblockNonceList, got.FairblockNonceList)
	require.ElementsMatch(t, genesisState.FairblockExecutedNonceList, got.FairblockExecutedNonceList)
	require.ElementsMatch(t, genesisState.AggregatedKeyShareList, got.AggregatedKeyShareList)
	// this line is used by starport scaffolding # genesis/test/assert
}
