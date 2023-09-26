package types_test

import (
	"testing"

	"github.com/stretchr/testify/require"

	"fairyring/x/pricefeed/types"
)

func TestCalculateGas(t *testing.T) {
	testCases := []struct {
		name        string
		base        uint64
		each        uint64
		n           uint64
		expectedGas uint64
	}{
		{
			name:        "Base case",
			base:        10,
			each:        5,
			n:           4,
			expectedGas: 30,
		},
		{
			name:        "Zero base",
			base:        0,
			each:        5,
			n:           4,
			expectedGas: 20,
		},
		{
			name:        "Zero each",
			base:        10,
			each:        0,
			n:           4,
			expectedGas: 10,
		},
		{
			name:        "Zero n",
			base:        10,
			each:        5,
			n:           0,
			expectedGas: 10,
		},
		{
			name:        "All zero",
			base:        0,
			each:        0,
			n:           0,
			expectedGas: 0,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			calculatedGas := types.CalculateGas(tc.base, tc.each, tc.n)
			require.Equal(t, tc.expectedGas, calculatedGas, "CalculateGas should return the correct value")
		})
	}
}

func TestComputeOracleTasks(t *testing.T) {
	symbolRequests := []types.SymbolRequest{
		types.NewSymbolRequest("BTC", 46, 10, 1000),
		types.NewSymbolRequest("ETH", 46, 10,1000),
		types.NewSymbolRequest("BAND", 46, 15,1000),
		types.NewSymbolRequest("EUR", 47, 35,1000),
		types.NewSymbolRequest("CNY", 47, 40,1000),
		types.NewSymbolRequest("JPY", 47, 50,1000),
	}

	// Compute task at 300
	tasks := types.ComputeOracleTasks(symbolRequests, 300)
	require.Equal(t, []types.OracleTask{
		{OracleScriptID: 46, Symbols: []string{"BTC", "ETH", "BAND"}},
		{OracleScriptID: 47, Symbols: []string{"JPY"}},
	}, tasks)

	// Compute task at 315
	tasks = types.ComputeOracleTasks(symbolRequests, 315)
	require.Equal(t, []types.OracleTask{
		{OracleScriptID: 46, Symbols: []string{"BAND"}},
		{OracleScriptID: 47, Symbols: []string{"EUR"}},
	}, tasks)

	// Compute task at 322
	tasks = types.ComputeOracleTasks(symbolRequests, 322)
	require.Equal(t, []types.OracleTask{}, tasks)

	// Compute task at 350
	tasks = types.ComputeOracleTasks(symbolRequests, 350)
	require.Equal(t, []types.OracleTask{
		{OracleScriptID: 46, Symbols: []string{"BTC", "ETH"}},
		{OracleScriptID: 47, Symbols: []string{"EUR", "JPY"}},
	}, tasks)

	// Compute task at 400
	tasks = types.ComputeOracleTasks(symbolRequests, 400)
	require.Equal(t, []types.OracleTask{
		{OracleScriptID: 46, Symbols: []string{"BTC", "ETH"}},
		{OracleScriptID: 47, Symbols: []string{"CNY", "JPY"}},
	}, tasks)
}
