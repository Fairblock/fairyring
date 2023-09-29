package types_test

import (
	"testing"

	"fairyring/x/conditionalenc/types"

	"github.com/stretchr/testify/require"
)

func TestGenesisState_Validate(t *testing.T) {
	for _, tc := range []struct {
		desc     string
		genState *types.GenesisState
		valid    bool
	}{
		{
			desc:     "default is valid",
			genState: types.DefaultGenesis(),
			valid:    true,
		},
		{
			desc: "valid genesis state",
			genState: &types.GenesisState{
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
				// this line is used by starport scaffolding # types/genesis/validField
			},
			valid: true,
		},
		{
			desc: "duplicated encryptedTx",
			genState: &types.GenesisState{
				EncryptedTxArray: []types.EncryptedTxArray{
					{
						EncryptedTx: []types.EncryptedTx{
							{
								TargetCondition: "0",
								Index:           0,
							},
							{
								TargetCondition: "0",
								Index:           0,
							},
						},
					},
					{
						EncryptedTx: []types.EncryptedTx{
							{
								TargetCondition: "0",
								Index:           0,
							},
							{
								TargetCondition: "0",
								Index:           0,
							},
						},
					},
				},
			},
			valid: false,
		},
		{
			desc: "duplicated ConditionalencNonce",
			genState: &types.GenesisState{
				ConditionalencNonceList: []types.ConditionalencNonce{
					{
						Address: "0",
					},
					{
						Address: "0",
					},
				},
			},
			valid: false,
		},
		{
			desc: "duplicated aggregatedKeyShare",
			genState: &types.GenesisState{
				AggregatedKeyShareList: []types.AggregatedKeyShare{
					{
						Condition: "0",
					},
					{
						Condition: "0",
					},
				},
			},
			valid: false,
		},
		// this line is used by starport scaffolding # types/genesis/testcase
	} {
		t.Run(tc.desc, func(t *testing.T) {
			err := tc.genState.Validate()
			if tc.valid {
				require.NoError(t, err)
			} else {
				require.Error(t, err)
			}
		})
	}
}
