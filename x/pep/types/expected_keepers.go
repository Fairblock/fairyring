package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/auth/types"
	connTypes "github.com/cosmos/ibc-go/v5/modules/core/03-connection/types"
)

// AccountKeeper defines the expected account keeper used for simulations (noalias)
type AccountKeeper interface {
	GetAccount(ctx sdk.Context, addr sdk.AccAddress) types.AccountI
	// Methods imported from account should be defined here
}

// BankKeeper defines the expected interface needed to retrieve account balances.
type BankKeeper interface {
	SpendableCoins(ctx sdk.Context, addr sdk.AccAddress) sdk.Coins
	// Methods imported from bank should be defined here
}

// ConnectionKeeper defines the expected interfaces needed to retrieve connection info
type ConnectionKeeper interface {
	GetConnection(ctx sdk.Context, connectionID string) (connTypes.ConnectionEnd, bool)
}
