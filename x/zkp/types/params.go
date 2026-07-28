package types

import (
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"
	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
)

var _ paramtypes.ParamSet = (*Params)(nil)

var KeyAuthority = []byte("Authority")

// DefaultAuthority returns the default authority for the zkp module.
//
// Keep this as a function instead of a package-level string so the bech32
// address is derived after the application config has set the chain prefix.
func DefaultAuthority() string {
	return authtypes.NewModuleAddress(govtypes.ModuleName).String()
}

// ParamKeyTable returns the zkp module param key table.
func ParamKeyTable() paramtypes.KeyTable {
	return paramtypes.NewKeyTable().RegisterParamSet(&Params{})
}

// NewParams creates a new Params instance.
func NewParams(authority string) Params {
	return Params{Authority: authority}
}

// DefaultParams returns a default set of parameters.
func DefaultParams() Params {
	return NewParams(DefaultAuthority())
}

// ParamSetPairs implements params.ParamSet.
func (p *Params) ParamSetPairs() paramtypes.ParamSetPairs {
	return paramtypes.ParamSetPairs{
		paramtypes.NewParamSetPair(KeyAuthority, &p.Authority, validateAuthority),
	}
}

// Validate validates the zkp module params.
func (p Params) Validate() error {
	return validateAuthority(p.Authority)
}

func validateAuthority(v interface{}) error {
	authority, ok := v.(string)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	if _, err := sdk.AccAddressFromBech32(authority); err != nil {
		return fmt.Errorf("invalid authority address: %w", err)
	}

	return nil
}
