package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	capabilitytypes "github.com/cosmos/cosmos-sdk/x/capability/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
	//ibcexported "github.com/cosmos/ibc-go/v7/modules/core/exported"
	clienttypes "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	//conditionalenctypes "fairyring/x/conditionalenc/types"
)

// ICS4Wrapper defines the expected ICS4Wrapper for middleware
type ICS4Wrapper interface {
	//SendPacket(ctx sdk.Context, channelCap *capabilitytypes.Capability, packet ibcexported.PacketI) error
	SendPacket(
		ctx sdk.Context,
		channelCap *capabilitytypes.Capability,
		sourcePort string,
		sourceChannel string,
		timeoutHeight clienttypes.Height,
		timeoutTimestamp uint64,
		data []byte,
	) (uint64, error)
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
	
}

// PortKeeper defines the expected IBC port keeper
type PortKeeper interface {
	BindPort(ctx sdk.Context, portID string) *capabilitytypes.Capability
}

// type ConditionalEncKeeper interface {
// 	SetActivePubKey(ctx sdk.Context, activePubKey conditionalenctypes.ActivePubKey)
// 	SetQueuedPubKey(ctx sdk.Context, queuedPubKey conditionalenctypes.QueuedPubKey)
// 	GetActivePubKey(ctx sdk.Context) (val conditionalenctypes.ActivePubKey, found bool)
// 	GetQueuedPubKey(ctx sdk.Context) (val conditionalenctypes.QueuedPubKey, found bool)
// 	DeleteActivePubKey(ctx sdk.Context)
// 	DeleteQueuedPubKey(ctx sdk.Context)
// }