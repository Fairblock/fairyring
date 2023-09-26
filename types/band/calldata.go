package band

import "fairyring/obi"

type Calldata struct {
	Symbols            []string
	MinimumSourceCount uint8
}

func EncodeCalldata(symbols []string, minimumSourceCount uint8) ([]byte, error) {
	return obi.Encode(Calldata{symbols, minimumSourceCount})
}
