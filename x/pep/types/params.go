package types

import (
	"fmt"
	sdk "github.com/cosmos/cosmos-sdk/types"
	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
	"gopkg.in/yaml.v2"
)

var _ paramtypes.ParamSet = (*Params)(nil)

var (
	KeyTrustedAddresses     = []byte("TrustedAddresses")
	DefaultTrustedAddresses []string
)

// ParamKeyTable the param key table for launch module
func ParamKeyTable() paramtypes.KeyTable {
	return paramtypes.NewKeyTable().RegisterParamSet(&Params{})
}

// NewParams creates a new Params instance
func NewParams(trAddrs []string) Params {
	return Params{
		TrustedAddresses: trAddrs,
	}
}

// DefaultParams returns a default set of parameters
func DefaultParams() Params {
	return NewParams(DefaultTrustedAddresses)
}

// ParamSetPairs get the params.ParamSet
func (p *Params) ParamSetPairs() paramtypes.ParamSetPairs {
	return paramtypes.ParamSetPairs{
		paramtypes.NewParamSetPair(KeyTrustedAddresses, &p.TrustedAddresses, validateTrustedAddresses),
	}
}

// Validate validates the set of params
func (p Params) Validate() error {
	if err := validateTrustedAddresses(p.TrustedAddresses); err != nil {
		return err
	}

	return nil
}

// String implements the Stringer interface.
func (p Params) String() string {
	out, _ := yaml.Marshal(p)
	return string(out)
}

// validateTrustedAddresses validates the TrustedAddresses param
func validateTrustedAddresses(v interface{}) error {
	trustedList, ok := v.([]string)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	// Validate each address in the slice
	for i, element := range trustedList {
		// Perform validation logic on each element
		_, err := sdk.AccAddressFromBech32(element)
		if err != nil {
			return fmt.Errorf("address at index %d is invalid", i)
		}
	}

	return nil
}
