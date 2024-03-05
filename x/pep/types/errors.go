package types

// DONTCOVER

import (
	sdkerrors "cosmossdk.io/errors"
)

// x/pep module sentinel errors
var (
	ErrInvalidVersion           = sdkerrors.Register(ModuleName, 1501, "invalid version")
	ErrInvalidTargetBlockHeight = sdkerrors.Register(ModuleName, 1600, "Invalid target block height")
	ErrInvalidMsgCreator        = sdkerrors.Register(ModuleName, 1700, "Invalid msg creator address")
	ErrActivePubKeyNotFound     = sdkerrors.Register(ModuleName, 1800, "Active public key not found")
)
