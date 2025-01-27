package types

// DONTCOVER

import (
	sdkerrors "cosmossdk.io/errors"
)

// x/auction module sentinel errors
var (
	ErrInvalidSigner                    = sdkerrors.Register(ModuleName, 1100, "expected gov account as only signer for proposal message")
	ErrInvalidAuctionResolveBlockNumber = sdkerrors.Register(ModuleName, 1101, "the given resolve at block number is lower than current block height")
	ErrActivePubKeyNotFound             = sdkerrors.Register(ModuleName, 1102, "active public key not found in pep module")
	ErrInvalidTargetResolveBlockHeight  = sdkerrors.Register(ModuleName, 1103, "target resolve at block height is too large")
	ErrAuctionNotFound                  = sdkerrors.Register(ModuleName, 1104, "auction with given resolve height and id not found")
	ErrAuctionResolved                  = sdkerrors.Register(ModuleName, 1105, "target auction already resolved")
	ErrEarlyResolveAuction              = sdkerrors.Register(ModuleName, 1106, "block height too low to resolve target auction")
)
