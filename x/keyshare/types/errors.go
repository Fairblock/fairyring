package types

// DONTCOVER

import (
	sdkerrors "cosmossdk.io/errors"
)

// x/keyshare module sentinel errors
var (
	ErrValidatorAlreadyRegistered     = sdkerrors.Register(ModuleName, 1101, "validator already registered")
	ErrValidatorNotRegistered         = sdkerrors.Register(ModuleName, 1102, "validator not registered")
	ErrInvalidBlockHeight             = sdkerrors.Register(ModuleName, 1103, "invalid block height")
	ErrDecodingKeyShare               = sdkerrors.Register(ModuleName, 1104, "error decoding keyshare")
	ErrUnmarshallingKeyShare          = sdkerrors.Register(ModuleName, 1105, "error unmarshalling keyshare")
	ErrDecodingCommitment             = sdkerrors.Register(ModuleName, 1106, "error decoding commitment")
	ErrUnmarshallingCommitment        = sdkerrors.Register(ModuleName, 1107, "error unmarhsalling commitment")
	ErrUnableToVerifyShare            = sdkerrors.Register(ModuleName, 1108, "unable to verify share")
	ErrInvalidShare                   = sdkerrors.Register(ModuleName, 1109, "invalid share / commitment")
	ErrPubKeyNotFound                 = sdkerrors.Register(ModuleName, 1110, "Public key does not exists now")
	ErrQueuedKeyAlreadyExists         = sdkerrors.Register(ModuleName, 1111, "a queued key already exists")
	ErrAccountNotStaking              = sdkerrors.Register(ModuleName, 1112, "account is not staking")
	ErrAddressNotTrusted              = sdkerrors.Register(ModuleName, 1113, "address is not trusted")
	ErrInsufficientBondedAmount       = sdkerrors.Register(ModuleName, 1114, "insufficient bonded amount to be a validator")
	ErrEmptyCommitments               = sdkerrors.Register(ModuleName, 1115, "provided commitments are empty")
	ErrCommitmentsNotFound            = sdkerrors.Register(ModuleName, 1116, "commitments not found")
	ErrInvalidKeyShareIndex           = sdkerrors.Register(ModuleName, 1117, "invalid KeyShare index")
	ErrInvalidKeyShareLength          = sdkerrors.Register(ModuleName, 1118, "invalid KeyShare length")
	ErrInvalidPubKeyLength            = sdkerrors.Register(ModuleName, 1119, "invalid PubKey length")
	ErrInvalidPubKey                  = sdkerrors.Register(ModuleName, 1120, "invalid PubKey")
	ErrInvalidCommitment              = sdkerrors.Register(ModuleName, 1121, "invalid commitment")
	ErrInvalidCommitmentLength        = sdkerrors.Register(ModuleName, 1122, "invalid commitment length")
	ErrInvalidVersion                 = sdkerrors.Register(ModuleName, 1123, "invalid version")
	ErrRequestNotFound                = sdkerrors.Register(ModuleName, 1124, "no request found with this identity")
	ErrNoAggregatedKeyshare           = sdkerrors.Register(ModuleName, 1125, "aggregated keyshare has not been generated")
	ErrAddressAlreadyAuthorized       = sdkerrors.Register(ModuleName, 1900, "address is already authorized")
	ErrAuthorizedAddrNotFound         = sdkerrors.Register(ModuleName, 1901, "target authorized address not found")
	ErrNotAuthorizedAddrCreator       = sdkerrors.Register(ModuleName, 1902, "sender is not the creator of target authorized address")
	ErrNotTargetOrAuthAddrCreator     = sdkerrors.Register(ModuleName, 1903, "only the authorized address / the creator can delete authorized address")
	ErrAddrIsNotValidatorOrAuthorized = sdkerrors.Register(ModuleName, 1904, "sender is not validator / authorized address to submit key share")
	ErrAuthorizerIsNotValidator       = sdkerrors.Register(ModuleName, 1905, "address authorized you is not a validator")
	ErrOnlyValidatorCanAuthorizeAddr  = sdkerrors.Register(ModuleName, 1906, "only validator can authorize address to submit key share")
	ErrExceedMaxAuthAddr              = sdkerrors.Register(ModuleName, 1907, "each validator can only authorize max 1 address to submit key share")
	ErrAuthorizeSelfAddress           = sdkerrors.Register(ModuleName, 1908, "unable to authorize sender own address")
	ErrAuthorizedAnotherAddress       = sdkerrors.Register(ModuleName, 1909, "validator authorized another address to submit key share is not allow to submit key share")
	ErrUnsupportedIDType              = sdkerrors.Register(ModuleName, 1910, "id type provided in general key share message is not supported")
	ErrKeyShareRequestNotFound        = sdkerrors.Register(ModuleName, 1911, "key share request for the given identity not found")
	ErrAggKeyAlreadyExists            = sdkerrors.Register(ModuleName, 1912, "aggregated key already exists for the given identity")
)
