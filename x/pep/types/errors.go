package types

// DONTCOVER

import (
	sdkerrors "cosmossdk.io/errors"
)

// x/pep module sentinel errors
var (
	ErrSample                   = sdkerrors.Register(ModuleName, 1100, "sample error")
	ErrInvalidPacketTimeout     = sdkerrors.Register(ModuleName, 1500, "invalid packet timeout")
	ErrInvalidVersion           = sdkerrors.Register(ModuleName, 1501, "invalid version")
	ErrInvalidTargetBlockHeight = sdkerrors.Register(ModuleName, 1600, "Invalid target block height")
)
