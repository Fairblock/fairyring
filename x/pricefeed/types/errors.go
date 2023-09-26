package types

import (
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

// x/pricefeed module sentinel errors
var (
	ErrSymbolRequestNotFound   = sdkerrors.Register(ModuleName, 2, "symbol request not found")
	ErrPriceNotFound           = sdkerrors.Register(ModuleName, 3, "price not found")
	ErrResolveStatusNotSuccess = sdkerrors.Register(ModuleName, 4, "request is not resolved successfully")
	ErrEmptySymbolRequests     = sdkerrors.Register(ModuleName, 5, "submitted symbol requests are empty")
	ErrEmptySymbol             = sdkerrors.Register(ModuleName, 6, "symbol is empty")
	ErrInvalidOracleScriptID   = sdkerrors.Register(ModuleName, 7, "invalid oracle script id")

	ErrInvalidVersion = sdkerrors.Register(ModuleName, 1501, "invalid version")
)
