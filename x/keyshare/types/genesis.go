package types

import (
	"fmt"

	host "github.com/cosmos/ibc-go/v8/modules/core/24-host"
)

// DefaultIndex is the default global index
const DefaultIndex uint64 = 1

// DefaultGenesis returns the default genesis state
func DefaultGenesis() *GenesisState {
	return &GenesisState{
		PortId:                PortID,
		DecryptionKeyList:     []DecryptionKey{},
		ValidatorSetList:      []ValidatorSet{},
		KeyshareList:          []Keyshare{},
		AuthorizedAddressList: []AuthorizedAddress{},
		GeneralKeyshareList:   []GeneralKeyshare{},
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

	// Check for duplicated index in decrtion key
	decryptionKeyIndexMap := make(map[string]struct{})

	for _, elem := range gs.DecryptionKeyList {
		index := string(DecryptionKeyKey(elem.Height))
		if _, ok := decryptionKeyIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for decryption key")
		}
		decryptionKeyIndexMap[index] = struct{}{}
	}

	validatorSetIndexMap := make(map[string]struct{})
	validatorMap := make(map[string]string)
	consMap := make(map[string]string)

	for _, elem := range gs.ValidatorSetList {
		index := string(ValidatorSetKey(elem.Index))
		if _, ok := validatorSetIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for validatorSet")
		}
		validatorSetIndexMap[index] = struct{}{}

		if _, found := validatorMap[elem.Validator]; found {
			return fmt.Errorf("duplicated validator in validatorSet")
		} else {
			validatorMap[elem.Validator] = elem.Validator
		}

		if _, found := consMap[elem.ConsAddr]; found {
			return fmt.Errorf("duplicated consensus address in validatorSet")
		} else {
			validatorMap[elem.ConsAddr] = elem.ConsAddr
		}
	}
	// Check for duplicated index in keyShare
	keyShareIndexMap := make(map[string]struct{})

	for _, elem := range gs.KeyshareList {
		index := string(KeyshareKey(elem.Validator, elem.BlockHeight))
		if _, ok := keyShareIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for keyShare")
		}
		keyShareIndexMap[index] = struct{}{}
	}

	// Check for duplicated index in authorizedAddress
	authorizedAddressIndexMap := make(map[string]struct{})

	for _, elem := range gs.AuthorizedAddressList {
		index := string(AuthorizedAddressKey(elem.Target))
		if _, ok := authorizedAddressIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for authorizedAddress")
		}
		authorizedAddressIndexMap[index] = struct{}{}
	}
	// Check for duplicated index in generalKeyShare
	generalKeyShareIndexMap := make(map[string]struct{})

	for _, elem := range gs.GeneralKeyshareList {
		index := string(GeneralKeyshareKey(elem.Validator, elem.IdType, elem.IdValue))
		if _, ok := generalKeyShareIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for generalKeyShare")
		}
		generalKeyShareIndexMap[index] = struct{}{}
	}
	// this line is used by starport scaffolding # genesis/types/validate

	return gs.Params.Validate()
}
