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

var (
	KeyTrustedCounterParties     = []byte("TrustedCounterParty")
	DefaultTrustedCounterParties []*TrustedCounterParty
)

// ParamKeyTable the param key table for launch module
func ParamKeyTable() paramtypes.KeyTable {
	return paramtypes.NewKeyTable().RegisterParamSet(&Params{})
}

// NewParams creates a new Params instance
func NewParams(trAddrs []string, trustedParties []*TrustedCounterParty) Params {
	return Params{
		TrustedAddresses:      trAddrs,
		TrustedCounterParties: trustedParties,
	}
}

// DefaultParams returns a default set of parameters
func DefaultParams() Params {
	return NewParams(DefaultTrustedAddresses, DefaultTrustedCounterParties)
}

// ParamSetPairs get the params.ParamSet
func (p *Params) ParamSetPairs() paramtypes.ParamSetPairs {
	return paramtypes.ParamSetPairs{
		paramtypes.NewParamSetPair(KeyTrustedAddresses, &p.TrustedAddresses, validateTrustedAddresses),
		paramtypes.NewParamSetPair(KeyTrustedCounterParties, &p.TrustedCounterParties, validateTrustedCounterParties),
	}
}

// Validate validates the set of params
func (p Params) Validate() error {
	if err := validateTrustedAddresses(p.TrustedAddresses); err != nil {
		return err
	}

	if err := validateTrustedCounterParties(p.TrustedCounterParties); err != nil {
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

// validateTrustedAddresses validates the TrustedAddresses param
func validateTrustedCounterParties(v interface{}) error {
	trustedParties, ok := v.([]*TrustedCounterParty)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	// Validate each party in the slice
	for i, element := range trustedParties {
		if element == nil {
			return fmt.Errorf("Trusted Party is null")
		}
		// Perform validation logic on each element
		if len(element.ChannelId) < 1 {
			return fmt.Errorf("channel ID at index %d is empty", i)
		}
		if len(element.ConnectionId) < 1 {
			return fmt.Errorf("connection ID at index %d is empty", i)
		}
		if len(element.ClientId) < 1 {
			return fmt.Errorf("client ID at index %d is empty", i)
		}
	}

	return nil
}
