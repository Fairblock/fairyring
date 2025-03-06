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
	ErrInvalidDenom                     = sdkerrors.Register(ModuleName, 1107, "invalid denom")
	ErrInsufficientFunds                = sdkerrors.Register(ModuleName, 1108, "insufficient funds to register as a bidder")
	ErrTargetNotRegisteredBidder        = sdkerrors.Register(ModuleName, 1109, "target address is not a registered bidder")
	ErrBidCreatorNotRegistered          = sdkerrors.Register(ModuleName, 1110, "bid creator is not a registered bidder in auction module")
)
