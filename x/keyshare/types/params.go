package types

import (
	"fmt"

	"cosmossdk.io/math"
	sdk "github.com/cosmos/cosmos-sdk/types"

	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
)

var _ paramtypes.ParamSet = (*Params)(nil)

var (
	KeyMinimumBonded            = []byte("MinimumBonded")
	DefaultMinimumBonded uint64 = 10000000000
)

var (
	KeyKeyExpiry            = []byte("KeyExpiry")
	DefaultKeyExpiry uint64 = 100
)

var (
	KeyTrustedAddresses     = []byte("TrustedAddresses")
	DefaultTrustedAddresses []string
)

var (
	KeySlashFractionNoKeyshare     = []byte("KeyNoShareSlashFraction")
	DefaultSlashFractionNoKeyshare = math.LegacyNewDecWithPrec(5, 1) // 0.5
)

var (
	KeySlashFractionWrongKeyshare     = []byte("KeyWrongShareSlashFraction")
	DefaultSlashFractionWrongKeyshare = math.LegacyNewDecWithPrec(5, 1) // 0.5
)

var (
	KeyMaxIdledBlock            = []byte("KeyMaxIdledBlock")
	DefaultMaxIdledBlock uint64 = 10
)

var (
	KeyAvgBlockTime             = []byte("KeyAvgBlockTime")
	DefaultAvgBlockTime float32 = 5.6
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
	noKeyshareFraction math.LegacyDec,
	wrongKeyshareFraction math.LegacyDec,
	maxIdledBlock uint64,
	avgBlockTime float32,
) Params {
	return Params{
		KeyExpiry:                  keyExp,
		TrustedAddresses:           trAddrs,
		SlashFractionNoKeyshare:    noKeyshareFraction,
		SlashFractionWrongKeyshare: wrongKeyshareFraction,
		MaxIdledBlock:              maxIdledBlock,
		MinimumBonded:              minimumBonded,
		AvgBlockTime:               avgBlockTime,
	}
}

// DefaultParams returns a default set of parameters
func DefaultParams() Params {
	return NewParams(
		DefaultKeyExpiry,
		DefaultTrustedAddresses,
		DefaultMinimumBonded,
		DefaultSlashFractionNoKeyshare,
		DefaultSlashFractionWrongKeyshare,
		DefaultMaxIdledBlock,
		DefaultAvgBlockTime,
	)
}

// ParamSetPairs get the params.ParamSet
func (p *Params) ParamSetPairs() paramtypes.ParamSetPairs {
	return paramtypes.ParamSetPairs{
		paramtypes.NewParamSetPair(KeyKeyExpiry, &p.KeyExpiry, validateKeyExpiry),
		paramtypes.NewParamSetPair(KeyTrustedAddresses, &p.TrustedAddresses, validateTrustedAddresses),
		paramtypes.NewParamSetPair(KeyMinimumBonded, &p.MinimumBonded, validateMinimumBonded),
		paramtypes.NewParamSetPair(KeySlashFractionNoKeyshare, &p.SlashFractionNoKeyshare, validateSlashFractionNoKeyshare),
		paramtypes.NewParamSetPair(KeySlashFractionWrongKeyshare, &p.SlashFractionWrongKeyshare, validateSlashFractionWrongKeyshare),
		paramtypes.NewParamSetPair(KeyMaxIdledBlock, &p.MaxIdledBlock, validateMaxIdledBlock),
		paramtypes.NewParamSetPair(KeyAvgBlockTime, &p.AvgBlockTime, validateAvgBlockTime),
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

// validateKeyExpiry validates the KeyExpiry param
func validateKeyExpiry(v interface{}) error {
	_, ok := v.(uint64)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	return nil
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

// validates the MinimumBonded param
func validateMinimumBonded(v interface{}) error {
	_, ok := v.(uint64)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	return nil
}

// validateSlashFractionNoKeyshare validates the SlashFractionNoKeyshare param
func validateSlashFractionNoKeyshare(v interface{}) error {
	val, ok := v.(math.LegacyDec)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}
	if val.LTE(math.LegacyNewDec(0)) || val.GT(math.LegacyNewDec(1)) {
		return fmt.Errorf("invalid parameter value, expected value between 0 and 1, not including 0, got %v", val)
	}
	return nil
}

// validateSlashFractionWrongKeyshare validates the SlashFractionWrongKeyshare param
func validateSlashFractionWrongKeyshare(v interface{}) error {
	val, ok := v.(math.LegacyDec)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}
	if val.LTE(math.LegacyNewDec(0)) || val.GT(math.LegacyNewDec(1)) {
		return fmt.Errorf("invalid parameter value, expected value between 0 and 1, not including 0, got %v", val)
	}
	return nil
}

// validateMaxIdledBlock validates the MaxIdledBlock param
func validateMaxIdledBlock(v interface{}) error {
	_, ok := v.(uint64)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	return nil
}

// validateAvgBlockTime validates the AvgBlockTime param
func validateAvgBlockTime(v interface{}) error {
	_, ok := v.(float32)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	return nil
}
