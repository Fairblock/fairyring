package types

// DONTCOVER

import (
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

// x/fairyring module sentinel errors
var (
	ErrSample                     = sdkerrors.Register(ModuleName, 1100, "sample error")
	ErrValidatorAlreadyRegistered = sdkerrors.Register(ModuleName, 1101, "validator already registered")
)
