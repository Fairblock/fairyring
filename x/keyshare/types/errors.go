package types

// DONTCOVER

import (
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

// x/keyshare module sentinel errors
var (
	ErrSample                     = sdkerrors.Register(ModuleName, 1100, "sample error")
	ErrValidatorAlreadyRegistered = sdkerrors.Register(ModuleName, 1101, "validator already registered")
	ErrValidatorNotRegistered     = sdkerrors.Register(ModuleName, 1102, "validator not registered")
	ErrInvalidBlockHeight         = sdkerrors.Register(ModuleName, 1103, "invalid block height")
	ErrDecodingKeyShare           = sdkerrors.Register(ModuleName, 1104, "error decoding keyshare")
	ErrUnmarshallingKeyShare      = sdkerrors.Register(ModuleName, 1105, "error unmarshalling keyshare")
	ErrDecodingCommitment         = sdkerrors.Register(ModuleName, 1106, "error decoding commitment")
	ErrUnmarshallingCommitment    = sdkerrors.Register(ModuleName, 1107, "error unmarhsalling commitment")
	ErrUnableToVerifyShare        = sdkerrors.Register(ModuleName, 1108, "unable to verify share")
	ErrInvalidShare               = sdkerrors.Register(ModuleName, 1109, "invalid share / commitment")
	ErrPubKeyNotFound             = sdkerrors.Register(ModuleName, 1110, "Public key does not exists now")
	ErrQueuedKeyAlreadyExists     = sdkerrors.Register(ModuleName, 1111, "a queued key already exists")
	ErrAccountNotStaking          = sdkerrors.Register(ModuleName, 1112, "account is not staking")
	ErrAddressNotTrusted          = sdkerrors.Register(ModuleName, 1102, "address is not trusted")
)
