package types

import (
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func DefaultGenesis() *GenesisState {
	return &GenesisState{
		Params: DefaultParams(),
	}
}

func (gs GenesisState) Validate() error {
	if gs.Params.Authority != "" {
		if err := gs.Params.Validate(); err != nil {
			return fmt.Errorf("invalid params: %w", err)
		}
	}

	seen := make(map[string]bool)
	for i, addr := range gs.TrustedContracts {
		if _, err := sdk.AccAddressFromBech32(addr); err != nil {
			return fmt.Errorf("invalid trusted contract address at index %d: %w", i, err)
		}
		if seen[addr] {
			return fmt.Errorf("duplicate trusted contract address at index %d: %s", i, addr)
		}
		seen[addr] = true
	}
	return nil
}
