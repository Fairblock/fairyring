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
	GetRequestQueueEntry(ctx sdk.Context, reqID string) (val commontypes.RequestDecryptionKey, found bool)
	SetReqQueueEntry(ctx sdk.Context, val commontypes.RequestDecryptionKey)
	RemoveReqQueueEntry(ctx sdk.Context, reqID string)
	GetAllReqQueueEntry(ctx sdk.Context) (list []commontypes.RequestDecryptionKey)
	GetSignalQueueEntry(ctx sdk.Context, reqID string) (val commontypes.GetDecryptionKey, found bool)
	SetSignalQueueEntry(ctx sdk.Context, val commontypes.GetDecryptionKey)
	RemoveSignalQueueEntry(ctx sdk.Context, reqID string)
	GetAllSignalQueueEntry(ctx sdk.Context) (list []commontypes.GetDecryptionKey)
	GetProposal(ctx context.Context, proposalID uint64) (v1.Proposal, bool)
	SetProposal(ctx context.Context, proposal v1.Proposal) error
}

// PepKeeper defines the expected interface needed to get and set active and queued public keys
type PepKeeper interface {
	SetActivePubkey(ctx context.Context, activePubkey commontypes.ActivePublicKey)
	SetQueuedPubkey(ctx context.Context, queuedPubkey commontypes.QueuedPublicKey)
	GetActivePubkey(ctx context.Context) (val commontypes.ActivePublicKey, found bool)
	GetQueuedPubkey(ctx context.Context) (val commontypes.QueuedPublicKey, found bool)
	DeleteActivePubkey(ctx context.Context)
	DeleteQueuedPubkey(ctx context.Context)
	SetEntry(ctx context.Context, val peptypes.IdentityExecutionEntry)
	GetEntry(ctx context.Context, reqID string) (val peptypes.IdentityExecutionEntry, found bool)
	RemoveEntry(ctx context.Context, reqID string)
	GetAllGenEncTxEntry(ctx context.Context) (list []peptypes.IdentityExecutionEntry)
	GetSignalQueueEntry(ctx context.Context, reqID string) (val commontypes.GetDecryptionKey, found bool)
	SetSignalQueueEntry(ctx context.Context, val commontypes.GetDecryptionKey)
	RemoveSignalQueueEntry(ctx context.Context, reqID string)
	GetAllGenEncTxSignalQueueEntry(ctx context.Context) (list []commontypes.GetDecryptionKey)
	GetExecutionQueueEntry(ctx context.Context, reqID string) (val peptypes.IdentityExecutionEntry, found bool)
	SetExecutionQueueEntry(ctx context.Context, val peptypes.IdentityExecutionEntry)
	RemoveExecutionQueueEntry(ctx context.Context, reqID string)
	GetAllGenEncTxExecutionQueueEntry(ctx context.Context) (list []peptypes.IdentityExecutionEntry)
	GetRequestQueueEntry(ctx context.Context, reqID string) (val commontypes.RequestDecryptionKey, found bool)
	SetReqQueueEntry(ctx context.Context, val commontypes.RequestDecryptionKey)
	RemoveReqQueueEntry(ctx context.Context, reqID string)
	GetAllGenEncTxReqQueueEntry(ctx context.Context) (list []commontypes.RequestDecryptionKey)
	GetPrivateRequestQueueEntry(ctx context.Context, reqID string) (val commontypes.RequestPrivateDecryptionKey, found bool)
	SetPrivateReqQueueEntry(ctx context.Context, val commontypes.RequestPrivateDecryptionKey)
	RemovePrivateReqQueueEntry(ctx context.Context, reqID string)
	GetAllPrivateReqQueueEntry(ctx context.Context) (list []commontypes.RequestPrivateDecryptionKey)
	GetPrivateSignalQueueEntry(ctx context.Context, reqID string) (val commontypes.GetPrivateDecryptionKey, found bool)
	SetPrivateSignalQueueEntry(ctx context.Context, val commontypes.GetPrivateDecryptionKey)
	RemovePrivateSignalQueueEntry(ctx context.Context, reqID string)
	GetAllPrivateSignalQueueEntry(ctx context.Context) (list []commontypes.GetPrivateDecryptionKey)
	SetPrivateRequest(ctx context.Context, request peptypes.PrivateRequest)
	GetPrivateRequest(ctx context.Context, reqID string) (val peptypes.PrivateRequest, found bool)
	GetAllPrivateRequest(ctx context.Context) (list []peptypes.PrivateRequest)
	GetDecryptionKey(ctx context.Context, height uint64) (val peptypes.DecryptionKey, found bool)
	SetDecryptionKey(ctx context.Context, decryptionKey peptypes.DecryptionKey)
	GetLatestHeight(ctx context.Context) string
	SetLatestHeight(ctx context.Context, height string)
	GetContractEntriesByID(ctx context.Context, identity string) (val peptypes.RegisteredContract, found bool)
	ExecutePrivateContract(ctx sdk.Context, contractAddr string, msg peptypes.ExecuteContractPrivateMsg)
}
