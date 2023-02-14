package types_test

import (
	"testing"

	"fairyring/x/fairyring/types"
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
				// this line is used by starport scaffolding # types/genesis/validField
			},
			valid: true,
		},
		{
			desc: "duplicated validatorSet",
			genState: &types.GenesisState{
				ValidatorSetList: []types.ValidatorSet{
					{
						Index: "0",
					},
					{
						Index: "0",
					},
				},
			},
			valid: false,
		},
		{
			desc: "duplicated keyShare",
			genState: &types.GenesisState{
				KeyShareList: []types.KeyShare{
					{
						Validator:   "0",
						BlockHeight: 0,
					},
					{
						Validator:   "0",
						BlockHeight: 0,
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
						Height: 0,
					},
					{
						Height: 0,
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
