package types

import (
	"cosmossdk.io/math"
	"fmt"
	sdk "github.com/cosmos/cosmos-sdk/types"
	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
)

var _ paramtypes.ParamSet = (*Params)(nil)

var (
	KeyMinimumDelegateAmount     = []byte("MinimumDelegateAmount")
	DefaultMinimumDelegateAmount = sdk.NewCoin("ufairy", math.NewInt(1000000))
)

// ParamKeyTable the param key table for launch module
func ParamKeyTable() paramtypes.KeyTable {
	return paramtypes.NewKeyTable().RegisterParamSet(&Params{})
}

// NewParams creates a new Params instance
func NewParams(
	minDelegateAmount *sdk.Coin,
) Params {
	return Params{
		MinimumDelegationAmount: minDelegateAmount,
	}
}

// DefaultParams returns a default set of parameters
func DefaultParams() Params {
	return NewParams(
		&DefaultMinimumDelegateAmount,
	)
}

// ParamSetPairs get the params.ParamSet
func (p *Params) ParamSetPairs() paramtypes.ParamSetPairs {
	return paramtypes.ParamSetPairs{
		paramtypes.NewParamSetPair(KeyMinimumDelegateAmount, &p.MinimumDelegationAmount, validateMinimumDelegateAmount),
	}
}

func validateMinimumDelegateAmount(v interface{}) error {

	minDelegateAmount, ok := v.(*sdk.Coin)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	if minDelegateAmount.Amount.IsZero() || minDelegateAmount.Amount.IsNegative() {
		return fmt.Errorf("invalid minimum delegate amount, expected > 0, got: %d", minDelegateAmount.Amount.Int64())
	}

	return nil
}

// Validate validates the set of params
func (p Params) Validate() error {
	return validateMinimumDelegateAmount(p.MinimumDelegationAmount)
}
