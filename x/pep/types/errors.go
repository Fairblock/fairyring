package types

// DONTCOVER

import (
	sdkerrors "cosmossdk.io/errors"
)

// x/pep module sentinel errors
var (
	ErrInvalidSigner            = sdkerrors.Register(ModuleName, 1100, "expected gov account as only signer for proposal message")
	ErrInvalidVersion           = sdkerrors.Register(ModuleName, 1501, "invalid version")
	ErrInvalidTargetBlockHeight = sdkerrors.Register(ModuleName, 1600, "Invalid target block height")
	ErrInvalidIdentity          = sdkerrors.Register(ModuleName, 1601, "Invalid identity")
	ErrInvalidMsgCreator        = sdkerrors.Register(ModuleName, 1700, "Invalid msg creator address")
	ErrActivePubKeyNotFound     = sdkerrors.Register(ModuleName, 1800, "Active public key not found")
)
