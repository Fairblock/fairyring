package types

import (
	cosmosmath "cosmossdk.io/math"
	"fmt"
	sdk "github.com/cosmos/cosmos-sdk/types"
	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
	"gopkg.in/yaml.v2"
)

var _ paramtypes.ParamSet = (*Params)(nil)

var (
	KeyMinGasPrice     = []byte("MinGasPrice")
	DefaultMinGasPrice = sdk.NewCoin("frt", cosmosmath.NewInt(1))
)

// ParamKeyTable the param key table for launch module
func ParamKeyTable() paramtypes.KeyTable {
	return paramtypes.NewKeyTable().RegisterParamSet(&Params{})
}

// NewParams creates a new Params instance
func NewParams(minGasPrice *sdk.Coin) Params {
	return Params{
		MinGasPrice: minGasPrice,
	}
}

// DefaultParams returns a default set of parameters
func DefaultParams() Params {
	return NewParams(&DefaultMinGasPrice)
}

// ParamSetPairs get the params.ParamSet
func (p *Params) ParamSetPairs() paramtypes.ParamSetPairs {
	return paramtypes.ParamSetPairs{
		paramtypes.NewParamSetPair(KeyMinGasPrice, &p.MinGasPrice, validateMinGasPrice),
	}
}

// Validate validates the set of params
func (p Params) Validate() error {
	if err := validateMinGasPrice(p.MinGasPrice); err != nil {
		return err
	}
	return nil
}

// String implements the Stringer interface.
func (p Params) String() string {
	out, _ := yaml.Marshal(p)
	return string(out)
}

func validateMinGasPrice(v interface{}) error {

	minGasPrice, ok := v.(*sdk.Coin)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	if minGasPrice.Amount.IsZero() || minGasPrice.Amount.IsNegative() {
		return fmt.Errorf("invalid min gas price amount, expected > 0, got: %d", minGasPrice)
	}

	return nil
}
