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
		PortId:                     PortID,
		EncryptedTxArray:           []EncryptedTxArray{},
		FairblockExecutedNonceList: []FairblockExecutedNonce{},
		AggregatedKeyShareList:     []AggregatedKeyShare{},
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

	encryptedTxArrIndexMap := make(map[string]struct{})
	for height, elem := range gs.EncryptedTxArray {
		for index, item := range elem.EncryptedTx {
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

	// Check for duplicated index in fairblockExecutedNonce
	fairblockExecutedNonceIndexMap := make(map[string]struct{})

	for _, elem := range gs.FairblockExecutedNonceList {
		index := string(FairblockExecutedNonceKey(elem.Address))
		if _, ok := fairblockExecutedNonceIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for fairblockExecutedNonce")
		}
		fairblockExecutedNonceIndexMap[index] = struct{}{}
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
