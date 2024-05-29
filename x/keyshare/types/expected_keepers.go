package types

import (
	"context"
	"cosmossdk.io/core/store"
	sdkmath "cosmossdk.io/math"
	"cosmossdk.io/store/prefix"
	peptypes "github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	sdkerrors "cosmossdk.io/errors"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	v1 "github.com/cosmos/cosmos-sdk/x/gov/types/v1"
	stakingtypes "github.com/cosmos/cosmos-sdk/x/staking/types"
	capabilitytypes "github.com/cosmos/ibc-go/modules/capability/types"
	clienttypes "github.com/cosmos/ibc-go/v8/modules/core/02-client/types"
	connTypes "github.com/cosmos/ibc-go/v8/modules/core/03-connection/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v8/modules/core/24-host"
)

// AccountKeeper defines the expected account keeper used for simulations (noalias)
type AccountKeeper interface {
	GetAccount(ctx context.Context, addr sdk.AccAddress) sdk.AccountI
	// Methods imported from account should be defined here
}

// BankKeeper defines the expected interface needed to retrieve account balances.
type BankKeeper interface {
	SpendableCoins(ctx context.Context, addr sdk.AccAddress) sdk.Coins
	// Methods imported from bank should be defined here
}

// PepKeeper defines the expected interface needed to get and set active and queued public keys
type PepKeeper interface {
	SetActivePubKey(ctx sdk.Context, activePubKey commontypes.ActivePublicKey)
	SetQueuedPubKey(ctx sdk.Context, queuedPubKey commontypes.QueuedPublicKey)
	GetActivePubKey(ctx sdk.Context) (val commontypes.ActivePublicKey, found bool)
	GetQueuedPubKey(ctx sdk.Context) (val commontypes.QueuedPublicKey, found bool)
	DeleteActivePubKey(ctx sdk.Context)
	DeleteQueuedPubKey(ctx sdk.Context)
	SetEntry(ctx sdk.Context, val peptypes.GenEncTxExecutionQueue)
	GetEntry(ctx sdk.Context, reqID string) (val peptypes.GenEncTxExecutionQueue, found bool)
	RemoveEntry(ctx sdk.Context, reqID string)
	GetAllGenEncTxEntry(ctx sdk.Context) (list []peptypes.GenEncTxExecutionQueue)
	GetSignalQueueEntry(ctx sdk.Context, reqID string) (val commontypes.GetAggrKeyshare, found bool)
	SetSignalQueueEntry(ctx sdk.Context, val commontypes.GetAggrKeyshare)
	RemoveSignalQueueEntry(ctx sdk.Context, reqID string)
	GetAllGenEncTxSignalQueueEntry(ctx sdk.Context) (list []commontypes.GetAggrKeyshare)
	GetExecutionQueueEntry(ctx sdk.Context, reqID string) (val peptypes.GenEncTxExecutionQueue, found bool)
	SetExecutionQueueEntry(ctx sdk.Context, val peptypes.GenEncTxExecutionQueue)
	RemoveExecutionQueueEntry(ctx sdk.Context, reqID string)
	GetAllGenEncTxExecutionQueueEntry(ctx sdk.Context) (list []peptypes.GenEncTxExecutionQueue)
	GetRequestQueueEntry(ctx sdk.Context, reqID string) (val commontypes.RequestAggrKeyshare, found bool)
	SetReqQueueEntry(ctx sdk.Context, val commontypes.RequestAggrKeyshare)
	RemoveReqQueueEntry(ctx sdk.Context, reqID string)
	GetAllGenEncTxReqQueueEntry(ctx sdk.Context) (list []commontypes.RequestAggrKeyshare)
	GetAggregatedKeyShare(ctx sdk.Context, height uint64) (val peptypes.AggregatedKeyShare, found bool)
	SetAggregatedKeyShare(ctx sdk.Context, aggregatedKeyShare peptypes.AggregatedKeyShare)
	GetLatestHeight(ctx sdk.Context) string
	SetLatestHeight(ctx sdk.Context, height string)
}

// StakingKeeper defines the expected interface needed to retrieve the list of validators.
type StakingKeeper interface {
	GetAllValidators(ctx context.Context) (validators []stakingtypes.Validator, err error)
	GetValidator(ctx context.Context, addr sdk.ValAddress) (stakingtypes.Validator, error)
}

type SlashingKeeper interface {
	Slash(ctx context.Context, consAddr sdk.ConsAddress, fraction sdkmath.LegacyDec, power int64, distributionHeight int64) error
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

// ConnectionKeeper defines the expected interfaces needed to retrieve connection info
type ConnectionKeeper interface {
	GetConnection(ctx sdk.Context, connectionID string) (connTypes.ConnectionEnd, bool)
}

// ChannelKeeper defines the expected IBC channel keeper
type ChannelKeeper interface {
	GetChannel(ctx sdk.Context, srcPort, srcChan string) (channel channeltypes.Channel, found bool)
	GetNextSequenceSend(ctx sdk.Context, portID, channelID string) (uint64, bool)
	SendPacket(
		ctx sdk.Context,
		channelCap *capabilitytypes.Capability,
		sourcePort string,
		sourceChannel string,
		timeoutHeight clienttypes.Height,
		timeoutTimestamp uint64,
		data []byte,
	) (uint64, error)
	ChanCloseInit(ctx sdk.Context, portID, channelID string, chanCap *capabilitytypes.Capability) error
}

// PortKeeper defines the expected IBC port keeper
type PortKeeper interface {
	BindPort(ctx sdk.Context, portID string) *capabilitytypes.Capability
}

// ScopedKeeper defines the expected IBC scoped keeper
type ScopedKeeper interface {
	GetCapability(ctx sdk.Context, name string) (*capabilitytypes.Capability, bool)
	AuthenticateCapability(ctx sdk.Context, cap *capabilitytypes.Capability, name string) bool
	ClaimCapability(ctx sdk.Context, cap *capabilitytypes.Capability, name string) error
}

// IBCKeeper defines the IBC Keeper
type IBCKeeper struct {
	portKey       []byte
	storeService  store.KVStoreService
	ChannelKeeper ChannelKeeper
	PortKeeper    PortKeeper
	ScopedKeeper  ScopedKeeper
}

// NewKeeper create an IBC Keeper
func NewIBCKeeper(
	portKey []byte,
	storeService store.KVStoreService,
	channelKeeper ChannelKeeper,
	portKeeper PortKeeper,
	scopedKeeper ScopedKeeper,
) *IBCKeeper {
	return &IBCKeeper{
		portKey:       portKey,
		storeService:  storeService,
		ChannelKeeper: channelKeeper,
		PortKeeper:    portKeeper,
		ScopedKeeper:  scopedKeeper,
	}
}

// ChanCloseInit defines a wrapper function for the channel Keeper's function
func (k IBCKeeper) ChanCloseInit(ctx sdk.Context, portID, channelID string) error {
	capName := host.ChannelCapabilityPath(portID, channelID)
	chanCap, ok := k.ScopedKeeper.GetCapability(ctx, capName)
	if !ok {
		return sdkerrors.Wrapf(channeltypes.ErrChannelCapabilityNotFound, "could not retrieve channel capability at: %s", capName)
	}
	return k.ChannelKeeper.ChanCloseInit(ctx, portID, channelID, chanCap)
}

// IsBound checks if the module is already bound to the desired port
func (k IBCKeeper) IsBound(ctx sdk.Context, portID string) bool {
	_, ok := k.ScopedKeeper.GetCapability(ctx, host.PortPath(portID))
	return ok
}

// BindPort defines a wrapper function for the ort Keeper's function in
// order to expose it to module's InitGenesis function
func (k IBCKeeper) BindPort(ctx sdk.Context, portID string) error {
	cap := k.PortKeeper.BindPort(ctx, portID)
	return k.ClaimCapability(ctx, cap, host.PortPath(portID))
}

// GetPort returns the portID for the module. Used in ExportGenesis
func (k IBCKeeper) GetPort(ctx sdk.Context) string {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	return string(store.Get(peptypes.PortKey))
}

// SetPort sets the portID for the module. Used in InitGenesis
func (k IBCKeeper) SetPort(ctx sdk.Context, portID string) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	store.Set(peptypes.PortKey, []byte(portID))
}

// AuthenticateCapability wraps the scopedKeeper's AuthenticateCapability function
func (k IBCKeeper) AuthenticateCapability(ctx sdk.Context, cap *capabilitytypes.Capability, name string) bool {
	return k.ScopedKeeper.AuthenticateCapability(ctx, cap, name)
}

// ClaimCapability allows the module that can claim a capability that IBC module passes to it
func (k IBCKeeper) ClaimCapability(ctx sdk.Context, cap *capabilitytypes.Capability, name string) error {
	return k.ScopedKeeper.ClaimCapability(ctx, cap, name)
}
