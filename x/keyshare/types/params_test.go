package types_test

import (
	"math"
	"testing"

	sdkmath "cosmossdk.io/math"
	"github.com/stretchr/testify/require"

	"github.com/Fairblock/fairyring/x/keyshare/types"
)

func TestParamsValidate(t *testing.T) {
	tests := []struct {
		name      string
		mutate    func(*types.Params)
		expErrMsg string
	}{
		{name: "default params are valid"},
		{
			name:      "zero key expiry",
			mutate:    func(params *types.Params) { params.KeyExpiry = 0 },
			expErrMsg: "key expiry must be greater than 0",
		},
		{
			name:      "zero minimum bonded",
			mutate:    func(params *types.Params) { params.MinimumBonded = 0 },
			expErrMsg: "minimum bonded amount must be greater than 0",
		},
		{
			name:      "zero max idled block",
			mutate:    func(params *types.Params) { params.MaxIdledBlock = 0 },
			expErrMsg: "max idled block must be greater than 0",
		},
		{
			name:      "zero no-keyshare slash fraction",
			mutate:    func(params *types.Params) { params.SlashFractionNoKeyshare = sdkmath.LegacyZeroDec() },
			expErrMsg: "expected value between 0 and 1",
		},
		{
			name:      "wrong-keyshare slash fraction above one",
			mutate:    func(params *types.Params) { params.SlashFractionWrongKeyshare = sdkmath.LegacyNewDec(2) },
			expErrMsg: "expected value between 0 and 1",
		},
		{
			name:      "zero average block time",
			mutate:    func(params *types.Params) { params.AvgBlockTime = 0 },
			expErrMsg: "average block time must be a finite value greater than 0",
		},
		{
			name:      "NaN average block time",
			mutate:    func(params *types.Params) { params.AvgBlockTime = math.NaN() },
			expErrMsg: "average block time must be a finite value greater than 0",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			params := types.DefaultParams()
			if tt.mutate != nil {
				tt.mutate(&params)
			}

			err := params.Validate()
			if tt.expErrMsg == "" {
				require.NoError(t, err)
				return
			}
			require.ErrorContains(t, err, tt.expErrMsg)
		})
	}
}
