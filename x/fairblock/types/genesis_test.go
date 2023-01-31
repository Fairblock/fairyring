package types_test

import (
	"testing"

	"fairyring/x/fairblock/types"
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
								TargetHeight: 0,
								Index:        0,
							},
							{
								TargetHeight: 0,
								Index:        0,
							},
						},
					},
					{
						EncryptedTx: []types.EncryptedTx{
							{
								TargetHeight: 0,
								Index:        0,
							},
							{
								TargetHeight: 0,
								Index:        0,
							},
						},
					},
				},
			},
			valid: false,
		},
		{
			desc: "duplicated fairblockNonce",
			genState: &types.GenesisState{
				FairblockNonceList: []types.FairblockNonce{
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
			desc: "duplicated fairblockExecutedNonce",
			genState: &types.GenesisState{
				FairblockExecutedNonceList: []types.FairblockExecutedNonce{
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
