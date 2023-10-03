package types

import (
	peptypes "fairyring/x/pep/types"
	conditionalenctypes "fairyring/x/conditionalenc/types"
	"cosmossdk.io/math"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/auth/types"
	stakingtypes "github.com/cosmos/cosmos-sdk/x/staking/types"
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

// PepKeeper defines the expected interface needed to get and set active and queued public keys
type PepKeeper interface {
	SetActivePubKey(ctx sdk.Context, activePubKey peptypes.ActivePubKey)
	SetQueuedPubKey(ctx sdk.Context, queuedPubKey peptypes.QueuedPubKey)
	GetActivePubKey(ctx sdk.Context) (val peptypes.ActivePubKey, found bool)
	GetQueuedPubKey(ctx sdk.Context) (val peptypes.QueuedPubKey, found bool)
	DeleteActivePubKey(ctx sdk.Context)
	DeleteQueuedPubKey(ctx sdk.Context)
}

type ConditionalEncKeeper interface {
	SetActivePubKey(ctx sdk.Context, activePubKey conditionalenctypes.ActivePubKey)
	SetQueuedPubKey(ctx sdk.Context, queuedPubKey conditionalenctypes.QueuedPubKey)
	GetActivePubKey(ctx sdk.Context) (val conditionalenctypes.ActivePubKey, found bool)
	GetQueuedPubKey(ctx sdk.Context) (val conditionalenctypes.QueuedPubKey, found bool)
	DeleteActivePubKey(ctx sdk.Context)
	DeleteQueuedPubKey(ctx sdk.Context)
}
// StakingKeeper defines the expected interface needed to retrieve the list of validators.
type StakingKeeper interface {
	GetAllValidators(ctx sdk.Context) []stakingtypes.Validator
	GetValidator(ctx sdk.Context, addr sdk.ValAddress) (stakingtypes.Validator, bool)
	Slash(sdk.Context, sdk.ConsAddress, int64, int64, sdk.Dec) math.Int
}
