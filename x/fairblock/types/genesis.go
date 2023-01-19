package types

import (
	"fmt"
	host "github.com/cosmos/ibc-go/v5/modules/core/24-host"
)

// DefaultIndex is the default global index
const DefaultIndex uint64 = 1

// DefaultGenesis returns the default genesis state
func DefaultGenesis() *GenesisState {
	return &GenesisState{
		PortId:          PortID,
		EncryptedTxList: []EncryptedTx{},
		// this line is used by starport scaffolding # genesis/types/default
		Params: DefaultParams(),
	}
}

// Validate performs basic genesis state validation returning an error upon any
// failure.
func (gs GenesisState) Validate() error {
	if err := host.PortIdentifierValidator(gs.PortId); err != nil {
		return err
	}
	// Check for duplicated index in encryptedTx
	encryptedTxIndexMap := make(map[string]struct{})

	for _, elem := range gs.EncryptedTxList {
		index := string(EncryptedTxKey(elem.TargetHeight, elem.Index))
		if _, ok := encryptedTxIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for encryptedTx")
		}
		encryptedTxIndexMap[index] = struct{}{}
	}
	// this line is used by starport scaffolding # genesis/types/validate

	return gs.Params.Validate()
}
