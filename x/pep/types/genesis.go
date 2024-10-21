package types

import (
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
	host "github.com/cosmos/ibc-go/v8/modules/core/24-host"
	// this line is used by starport scaffolding # genesis/types/import
)

// DefaultIndex is the default global index
const DefaultIndex uint64 = 1

// DefaultGenesis returns the default genesis state
func DefaultGenesis() *GenesisState {
	return &GenesisState{
		PortId: PortID,
		// this line is used by starport scaffolding # genesis/types/default
		Params:            DefaultParams(),
		EncryptedTxArray:  []EncryptedTxArray{},
		DecryptionKeyList: []DecryptionKey{},
	}
}

// Validate performs basic genesis state validation returning an error upon any
// failure.
func (gs GenesisState) Validate() error {
	if err := host.PortIdentifierValidator(gs.PortId); err != nil {
		return err
	}
	// Check for duplicated index in requestId
	requestIdIndexMap := make(map[string]struct{})

	for _, elem := range gs.RequestIdList {
		index := string(RequestIdKey(elem.Creator, elem.ReqId))
		if _, ok := requestIdIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for requestId")
		}
		requestIdIndexMap[index] = struct{}{}
	}
	// this line is used by starport scaffolding # genesis/types/validate
	encryptedTxArrIndexMap := make(map[string]struct{})
	for height, elem := range gs.EncryptedTxArray {
		for index, item := range elem.EncryptedTxs {
			if item.Index != uint64(index) {
				return fmt.Errorf("encrypted tx index does not match")
			}

			if item.TargetHeight != uint64(height) {
				return fmt.Errorf("encrypted tx target height does not match")
			}
		}
		index := string(EncryptedTxAllFromHeightKey(uint64(height)))
		if _, ok := encryptedTxArrIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for encryptedTxArr")
		}
		encryptedTxArrIndexMap[index] = struct{}{}
	}

	// Check for duplicated index in decryption keys
	decryptionKeyIndexMap := make(map[string]struct{})

	for _, elem := range gs.DecryptionKeyList {
		index := string(DecryptionKeyKey(elem.Height))
		if _, ok := decryptionKeyIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for decryption key")
		}
		decryptionKeyIndexMap[index] = struct{}{}
	}
	// this line is used by starport scaffolding # genesis/types/validate

	// Check for valid addresses in NONCE
	for _, elem := range gs.PepNonceList {
		_, err := sdk.AccAddressFromBech32(elem.Address)
		if err != nil {
			return err
		}
	}

	return gs.Params.Validate()
}
