package types

import (
	"context"
	sdkmath "cosmossdk.io/math"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	peptypes "github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	v1 "github.com/cosmos/cosmos-sdk/x/gov/types/v1"
	stakingtypes "github.com/cosmos/cosmos-sdk/x/staking/types"
)

// StakingKeeper defines the expected interface needed to retrieve the list of validators.
type StakingKeeper interface {
	GetAllValidators(ctx context.Context) (validators []stakingtypes.Validator, err error)
	GetValidator(ctx context.Context, addr sdk.ValAddress) (stakingtypes.Validator, error)
}

// SlashingKeeper defines the expected interface for the Slashing module.
type SlashingKeeper interface {
	Slash(ctx context.Context, consAddr sdk.ConsAddress, fraction sdkmath.LegacyDec, power int64, distributionHeight int64) error
	IsTombstoned(context.Context, sdk.ConsAddress) bool
	Jail(context.Context, sdk.ConsAddress) error
	// Methods imported from account should be defined here
}

// AccountKeeper defines the expected interface for the Account module.
type AccountKeeper interface {
	GetAccount(context.Context, sdk.AccAddress) sdk.AccountI // only used for simulation
	// Methods imported from account should be defined here
}

// BankKeeper defines the expected interface for the Bank module.
type BankKeeper interface {
	SpendableCoins(context.Context, sdk.AccAddress) sdk.Coins
	// Methods imported from bank should be defined here
}

// ParamSubspace defines the expected Subspace interface for parameters.
type ParamSubspace interface {
	Get(context.Context, []byte, interface{})
	Set(context.Context, []byte, interface{})
}

type GovKeeper interface {
	GetRequestQueueEntry(ctx sdk.Context, reqID string) (val commontypes.RequestAggrKeyshare, found bool)
	SetReqQueueEntry(ctx sdk.Context, val commontypes.RequestAggrKeyshare)
	RemoveReqQueueEntry(ctx sdk.Context, reqID string)
	GetAllReqQueueEntry(ctx sdk.Context) (list []commontypes.RequestAggrKeyshare)
	GetSignalQueueEntry(ctx sdk.Context, reqID string) (val commontypes.GetAggrKeyshare, found bool)
	SetSignalQueueEntry(ctx sdk.Context, val commontypes.GetAggrKeyshare)
	RemoveSignalQueueEntry(ctx sdk.Context, reqID string)
	GetAllSignalQueueEntry(ctx sdk.Context) (list []commontypes.GetAggrKeyshare)
	GetProposal(ctx context.Context, proposalID uint64) (v1.Proposal, bool)
	SetProposal(ctx context.Context, proposal v1.Proposal) error
}

// PepKeeper defines the expected interface needed to get and set active and queued public keys
type PepKeeper interface {
	SetActivePubKey(ctx context.Context, activePubKey commontypes.ActivePublicKey)
	SetQueuedPubKey(ctx context.Context, queuedPubKey commontypes.QueuedPublicKey)
	GetActivePubKey(ctx context.Context) (val commontypes.ActivePublicKey, found bool)
	GetQueuedPubKey(ctx context.Context) (val commontypes.QueuedPublicKey, found bool)
	DeleteActivePubKey(ctx context.Context)
	DeleteQueuedPubKey(ctx context.Context)
	SetEntry(ctx context.Context, val peptypes.GenEncTxExecutionQueue)
	GetEntry(ctx context.Context, reqID string) (val peptypes.GenEncTxExecutionQueue, found bool)
	RemoveEntry(ctx context.Context, reqID string)
	GetAllGenEncTxEntry(ctx context.Context) (list []peptypes.GenEncTxExecutionQueue)
	GetSignalQueueEntry(ctx context.Context, reqID string) (val commontypes.GetAggrKeyshare, found bool)
	SetSignalQueueEntry(ctx context.Context, val commontypes.GetAggrKeyshare)
	RemoveSignalQueueEntry(ctx context.Context, reqID string)
	GetAllGenEncTxSignalQueueEntry(ctx context.Context) (list []commontypes.GetAggrKeyshare)
	GetExecutionQueueEntry(ctx context.Context, reqID string) (val peptypes.GenEncTxExecutionQueue, found bool)
	SetExecutionQueueEntry(ctx context.Context, val peptypes.GenEncTxExecutionQueue)
	RemoveExecutionQueueEntry(ctx context.Context, reqID string)
	GetAllGenEncTxExecutionQueueEntry(ctx context.Context) (list []peptypes.GenEncTxExecutionQueue)
	GetRequestQueueEntry(ctx context.Context, reqID string) (val commontypes.RequestAggrKeyshare, found bool)
	SetReqQueueEntry(ctx context.Context, val commontypes.RequestAggrKeyshare)
	RemoveReqQueueEntry(ctx context.Context, reqID string)
	GetAllGenEncTxReqQueueEntry(ctx context.Context) (list []commontypes.RequestAggrKeyshare)
	GetAggregatedKeyShare(ctx context.Context, height uint64) (val peptypes.AggregatedKeyShare, found bool)
	SetAggregatedKeyShare(ctx context.Context, aggregatedKeyShare peptypes.AggregatedKeyShare)
	GetLatestHeight(ctx context.Context) string
	SetLatestHeight(ctx context.Context, height string)
}
