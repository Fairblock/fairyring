package types

import (
	fmt "fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
	"gopkg.in/yaml.v2"
)

var _ paramtypes.ParamSet = (*Params)(nil)

var (
	KeyMinimumBonded            = []byte("MinimumBonded")
	DefaultMinimumBonded uint64 = 100000000000
)

var (
	KeyKeyExpiry            = []byte("KeyExpiry")
	DefaultKeyExpiry uint64 = 100
)

var (
	KeyTrustedAddresses     = []byte("TrustedAddresses")
	DefaultTrustedAddresses []string
)

// ParamKeyTable the param key table for launch module
func ParamKeyTable() paramtypes.KeyTable {
	return paramtypes.NewKeyTable().RegisterParamSet(&Params{})
}

// NewParams creates a new Params instance
func NewParams(
	keyExp uint64,
	trAddrs []string,
	minimumBonded uint64,
) Params {
	return Params{
		KeyExpiry:        keyExp,
		TrustedAddresses: trAddrs,
		MinimumBonded:    minimumBonded,
	}
}

// DefaultParams returns a default set of parameters
func DefaultParams() Params {
	return NewParams(
		DefaultKeyExpiry,
		DefaultTrustedAddresses,
		DefaultMinimumBonded,
	)
}

// ParamSetPairs get the params.ParamSet
func (p *Params) ParamSetPairs() paramtypes.ParamSetPairs {
	return paramtypes.ParamSetPairs{
		paramtypes.NewParamSetPair(KeyKeyExpiry, &p.KeyExpiry, validateKeyExpiry),
		paramtypes.NewParamSetPair(KeyTrustedAddresses, &p.TrustedAddresses, validateTrustedAddresses),
		paramtypes.NewParamSetPair(KeyMinimumBonded, &p.MinimumBonded, validateMinimumBonded),
	}
}

// Validate validates the set of params
func (p Params) Validate() error {
	if err := validateKeyExpiry(p.KeyExpiry); err != nil {
		return err
	}

	if err := validateTrustedAddresses(p.TrustedAddresses); err != nil {
		return err
	}

	if err := validateMinimumBonded(p.MinimumBonded); err != nil {
		return err
	}
	return nil
}

// String implements the Stringer interface.
func (p Params) String() string {
	out, _ := yaml.Marshal(p)
	return string(out)
}

// validate validates the KeyExpiry param
func validateKeyExpiry(v interface{}) error {
	_, ok := v.(uint64)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	return nil
}

// validate validates the TrustedAddresses param
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

// validates the MinimumBonded param
func validateMinimumBonded(v interface{}) error {
	_, ok := v.(uint64)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	return nil
}
