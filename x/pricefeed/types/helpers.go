package types

import "sort"

type OracleTask struct {
	OracleScriptID uint64
	Symbols        []string
}

func CalculateGas(base, each, n uint64) uint64 {
	return base + each*n
}

func ComputeOracleTasks(symbols []SymbolRequest, blockHeight int64) []OracleTask {
	symbolsOsMap := make(map[uint64][]string)
	for _, symbol := range symbols {
		if symbol.BlockInterval != 0 && blockHeight%int64(symbol.BlockInterval) == 0 {
			symbolsOsMap[symbol.OracleScriptID] = append(symbolsOsMap[symbol.OracleScriptID], symbol.Symbol)
		}
	}

	ids := make([]uint64, 0, len(symbolsOsMap))
	for id := range symbolsOsMap {
		ids = append(ids, id)
	}
	sort.Slice(ids, func(i, j int) bool { return ids[i] < ids[j] })

	tasks := make([]OracleTask, len(symbolsOsMap))
	for i, id := range ids {
		tasks[i] = OracleTask{OracleScriptID: id, Symbols: symbolsOsMap[id]}
	}

	return tasks
}
