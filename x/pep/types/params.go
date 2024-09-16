package types

import (
	"fmt"

	cosmosmath "cosmossdk.io/math"
	sdk "github.com/cosmos/cosmos-sdk/types"
	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
)

var _ paramtypes.ParamSet = (*Params)(nil)

var (
	KeyKeyshareChannelID            = []byte("KeyshareChannelId")
	DefaultKeyshareChannelID string = KeyshareChannelID
)

var (
	KeyIsSourceChain          = []byte("IsSourceChain")
	DefaultIsSourceChain bool = false
)

var (
	KeyMinGasPrice       = []byte("MinGasPrice")
	DefaultMinGasPrice   = sdk.NewCoin("ufairy", cosmosmath.NewInt(300000))
	KeyKeysharePrice     = []byte("PrivateKeysharePrice")
	DefaultKeysharePrice = sdk.NewCoin("ufairy", cosmosmath.NewInt(300000))
)

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
func NewParams(
	trAddrs []string,
	trustedParties []*TrustedCounterParty,
	keyshareChannelID string,
	minGasPrice *sdk.Coin,
	isSourceChain bool,
	keysharePrice *sdk.Coin,
) Params {
	return Params{
		TrustedAddresses:      trAddrs,
		TrustedCounterParties: trustedParties,
		KeyshareChannelId:     keyshareChannelID,
		MinGasPrice:           minGasPrice,
		IsSourceChain:         isSourceChain,
		PrivateKeysharePrice:  keysharePrice,
	}
}

// DefaultParams returns a default set of parameters
func DefaultParams() Params {
	return NewParams(
		DefaultTrustedAddresses,
		DefaultTrustedCounterParties,
		DefaultKeyshareChannelID,
		&DefaultMinGasPrice,
		DefaultIsSourceChain,
		&DefaultKeysharePrice,
	)
}

// ParamSetPairs get the params.ParamSet
func (p *Params) ParamSetPairs() paramtypes.ParamSetPairs {
	return paramtypes.ParamSetPairs{
		paramtypes.NewParamSetPair(KeyTrustedAddresses, &p.TrustedAddresses, validateTrustedAddresses),
		paramtypes.NewParamSetPair(KeyTrustedCounterParties, &p.TrustedCounterParties, validateTrustedCounterParties),
		paramtypes.NewParamSetPair(KeyKeyshareChannelID, &p.KeyshareChannelId, validateKeyshareChannelId),
		paramtypes.NewParamSetPair(KeyMinGasPrice, &p.MinGasPrice, validateMinGasPrice),
		paramtypes.NewParamSetPair(KeyIsSourceChain, &p.IsSourceChain, validateIsSourceChain),
		paramtypes.NewParamSetPair(KeyKeysharePrice, &p.PrivateKeysharePrice, validateMinGasPrice),
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

	if err := validateKeyshareChannelId(p.KeyshareChannelId); err != nil {
		return err
	}

	if err := validateMinGasPrice(p.MinGasPrice); err != nil {
		return err
	}

	if err := validateMinGasPrice(p.PrivateKeysharePrice); err != nil {
		return err
	}

	if err := validateIsSourceChain(p.IsSourceChain); err != nil {
		return err
	}

	return nil
}

// validateKeyshareChannelId validates the KeyshareChannelId param
func validateKeyshareChannelId(v interface{}) error {
	keyshareChannelId, ok := v.(string)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
	}

	if len(keyshareChannelId) < 1 {
		return fmt.Errorf("invalid Channel ID")
	}

	return nil
}

// validateIsSourceChain validates the IsSourceChain param
func validateIsSourceChain(v interface{}) error {
	_, ok := v.(bool)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", v)
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
