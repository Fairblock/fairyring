package types

import (
	"fmt"

	cosmosmath "cosmossdk.io/math"
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

var (
	KeyChannelID       = []byte("ChannelID")
	DefaultChannelID   = ChannelID
	KeyMinGasPrice     = []byte("MinGasPrice")
	DefaultMinGasPrice = sdk.NewCoin("frt", cosmosmath.NewInt(300000))
)

// ParamKeyTable the param key table for launch module
func ParamKeyTable() paramtypes.KeyTable {
	return paramtypes.NewKeyTable().RegisterParamSet(&Params{})
}

// NewParams creates a new Params instance
func NewParams(
	trAddrs []string,
	trustedParties []*TrustedCounterParty,
	channelID string,
	minGasPrice *sdk.Coin,
) Params {
	return Params{
		TrustedAddresses:      trAddrs,
		TrustedCounterParties: trustedParties,
		ChannelId:             channelID,
		MinGasPrice:           minGasPrice,
	}
}

// DefaultParams returns a default set of parameters
func DefaultParams() Params {
	return NewParams(DefaultTrustedAddresses, DefaultTrustedCounterParties, DefaultChannelID, &DefaultMinGasPrice)
}

// ParamSetPairs get the params.ParamSet
func (p *Params) ParamSetPairs() paramtypes.ParamSetPairs {
	return paramtypes.ParamSetPairs{
		paramtypes.NewParamSetPair(KeyTrustedAddresses, &p.TrustedAddresses, validateTrustedAddresses),
		paramtypes.NewParamSetPair(KeyTrustedCounterParties, &p.TrustedCounterParties, validateTrustedCounterParties),
		paramtypes.NewParamSetPair(KeyChannelID, &p.ChannelId, validateChannelID),
		paramtypes.NewParamSetPair(KeyMinGasPrice, &p.MinGasPrice, validateMinGasPrice),
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

	if err := validateChannelID(p.ChannelId); err != nil {
		return err
	}
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

// validateChannelID validates the channelID param
func validateChannelID(v interface{}) error {
	channelID, ok := v.(string)

	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	if len(channelID) < 1 {
		return fmt.Errorf("invalid Channel ID")
	}

	return nil
}

func validateMinGasPrice(v interface{}) error {

	minGasPrice, ok := v.(*sdk.Coin)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	if minGasPrice.Amount.IsZero() || minGasPrice.Amount.IsNegative() {
		return fmt.Errorf("invalid min gas price amount, expected > 0, got: %d", minGasPrice.Amount.Int64())
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

// validateTrustedAddresses validates the TrustedAddresses param
func validateTrustedCounterParties(v interface{}) error {
	trustedParties, ok := v.([]*TrustedCounterParty)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	// Validate each party in the slice
	for i, element := range trustedParties {
		if element == nil {
			return fmt.Errorf("trusted Party is null")
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
