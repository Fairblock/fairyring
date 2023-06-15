package types

import (
	"fmt"
	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
	"gopkg.in/yaml.v2"
)

var _ paramtypes.ParamSet = (*Params)(nil)

var (
	KeyMaximumEncryptedTx            = []byte("MaximumEncryptedTx")
	DefaultMaximumEncryptedTx uint64 = 20
)

// ParamKeyTable the param key table for launch module
func ParamKeyTable() paramtypes.KeyTable {
	return paramtypes.NewKeyTable().RegisterParamSet(&Params{})
}

// NewParams creates a new Params instance
func NewParams(
	maximumEncryptedTx uint64,
) Params {
	return Params{
		MaximumEncryptedTx: maximumEncryptedTx,
	}
}

// DefaultParams returns a default set of parameters
func DefaultParams() Params {
	return NewParams(
		DefaultMaximumEncryptedTx,
	)
}

// ParamSetPairs get the params.ParamSet
func (p *Params) ParamSetPairs() paramtypes.ParamSetPairs {
	return paramtypes.ParamSetPairs{
		paramtypes.NewParamSetPair(KeyMaximumEncryptedTx, &p.MaximumEncryptedTx, validateMaximumEncryptedTx),
	}
}

// Validate validates the set of params
func (p Params) Validate() error {
	if err := validateMaximumEncryptedTx(p.MaximumEncryptedTx); err != nil {
		return err
	}
	return nil
}

// String implements the Stringer interface.
func (p Params) String() string {
	out, _ := yaml.Marshal(p)
	return string(out)
}

// validates the MaximumEncryptedTx param
func validateMaximumEncryptedTx(v interface{}) error {
	_, ok := v.(uint64)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	return nil
}
