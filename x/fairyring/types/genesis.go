package types

import (
	"fmt"
)

// DefaultIndex is the default global index
const DefaultIndex uint64 = 1

// DefaultGenesis returns the default genesis state
func DefaultGenesis() *GenesisState {
	return &GenesisState{
		ValidatorSetList:       []ValidatorSet{},
		KeyShareList:           []KeyShare{},
		AggregatedKeyShareList: []AggregatedKeyShare{},
		LatestPubKey:           LatestPubKey{},
		// this line is used by starport scaffolding # genesis/types/default
		Params: DefaultParams(),
	}
}

// Validate performs basic genesis state validation returning an error upon any
// failure.
func (gs GenesisState) Validate() error {
	// Check for duplicated index in validatorSet
	validatorSetIndexMap := make(map[string]struct{})

	for _, elem := range gs.ValidatorSetList {
		index := string(ValidatorSetKey(elem.Index))
		if _, ok := validatorSetIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for validatorSet")
		}
		validatorSetIndexMap[index] = struct{}{}
	}
	// Check for duplicated index in keyShare
	keyShareIndexMap := make(map[string]struct{})

	for _, elem := range gs.KeyShareList {
		index := string(KeyShareKey(elem.Validator, elem.BlockHeight))
		if _, ok := keyShareIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for keyShare")
		}
		keyShareIndexMap[index] = struct{}{}
	}
	// Check for duplicated index in aggregatedKeyShare
	aggregatedKeyShareIndexMap := make(map[string]struct{})

	for _, elem := range gs.AggregatedKeyShareList {
		index := string(AggregatedKeyShareKey(elem.Height))
		if _, ok := aggregatedKeyShareIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for aggregatedKeyShare")
		}
		aggregatedKeyShareIndexMap[index] = struct{}{}
	}
	// this line is used by starport scaffolding # genesis/types/validate

	return gs.Params.Validate()
}
