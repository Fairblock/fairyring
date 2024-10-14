package keeper

import (
	"errors"
	"math"

	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"

	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	clienttypes "github.com/cosmos/ibc-go/v8/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v8/modules/core/24-host"
)

// TransmitRequestAggrKeysharePacket transmits the packet over IBC with the specified source port and source channel
func (k Keeper) TransmitRequestAggrKeysharePacket(
	ctx sdk.Context,
	packetData types.RequestAggrKeysharePacketData,
	sourcePort,
	sourceChannel string,
	timeoutHeight clienttypes.Height,
	timeoutTimestamp uint64,
) (uint64, error) {
	channelCap, ok := k.ScopedKeeper().GetCapability(ctx, host.ChannelCapabilityPath(sourcePort, sourceChannel))
	if !ok {
		return 0, sdkerrors.Wrap(channeltypes.ErrChannelCapabilityNotFound, "module does not own channel capability")
	}

	packetBytes := packetData.GetBytes()

	return k.ibcKeeperFn().ChannelKeeper.SendPacket(ctx, channelCap, sourcePort, sourceChannel, timeoutHeight, timeoutTimestamp, packetBytes)
}

// OnRecvRequestAggrKeysharePacket processes packet reception
func (k Keeper) OnRecvRequestAggrKeysharePacket(
	ctx sdk.Context,
	packet channeltypes.Packet,
	data types.RequestAggrKeysharePacketData,
) (packetAck types.RequestAggrKeysharePacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	activePubKey, found := k.GetActivePubKey(ctx)
	if !found {
		return packetAck, err
	}

	delay := data.EstimatedDelay
	blockDelay := uint64(math.Ceil(delay.Seconds() / types.AvgBlockTime))
	currentHeight := uint64(ctx.BlockHeight())
	executionHeight := currentHeight + blockDelay
	if executionHeight > activePubKey.Expiry {
		queuedPubKey, found := k.GetQueuedPubKey(ctx)
		if !found {
			return packetAck, errors.New("estimated delay too long")
		}
		if executionHeight > queuedPubKey.Expiry {
			return packetAck, errors.New("estimated delay too long")
		}
		activePubKey = types.ActivePubKey(queuedPubKey)
	}

	var isProposalID bool
	switch data.Id.(type) {
	case *types.RequestAggrKeysharePacketData_ProposalId:
		isProposalID = true
	default:
		isProposalID = false
	}

	id := data.GetRequestId()

	var keyshareRequest types.KeyShareRequest

	keyshareRequest.Identity = id
	keyshareRequest.Pubkey = activePubKey.PublicKey
	keyshareRequest.IbcInfo = &types.IBCInfo{
		ChannelId: packet.DestinationChannel,
		PortId:    packet.DestinationPort,
	}

	keyshareRequest.Counterparty = &types.CounterPartyIBCInfo{
		ChannelId: packet.SourceChannel,
		PortId:    packet.SourcePort,
	}

	keyshareRequest.AggrKeyshare = ""

	if isProposalID {
		keyshareRequest.ProposalId = data.GetProposalId()
	} else {
		keyshareRequest.RequestId = data.GetRequestId()
	}
	keyshareRequest.Sent = false

	k.SetKeyShareRequest(ctx, keyshareRequest)

	packetAck.Identity = id
	packetAck.Pubkey = activePubKey.PublicKey

	return packetAck, nil
}

// OnTimeoutRequestAggrKeysharePacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutRequestAggrKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data types.RequestAggrKeysharePacketData) error {

	// Implement custom packet timeout logic
	// (Not required for fairyring since this packet is never sent from fairyring)

	return nil
}

// OnRecvRequestPrivateKeysharePacket processes packet reception
func (k Keeper) OnRecvRequestPrivateKeysharePacket(
	ctx sdk.Context,
	packet channeltypes.Packet,
	data types.RequestPrivateKeysharePacketData,
) (packetAck types.RequestPrivateKeysharePacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	activePubKey, found := k.GetActivePubKey(ctx)
	if !found {
		return packetAck, err
	}

	id := data.GetRequestId()

	var keyshareRequest types.PrivateKeyshareRequest

	keyshareRequest.Identity = id
	keyshareRequest.Pubkey = activePubKey.PublicKey
	keyshareRequest.IbcInfo = &types.IBCInfo{
		ChannelId: packet.DestinationChannel,
		PortId:    packet.DestinationPort,
	}

	keyshareRequest.Counterparty = &types.CounterPartyIBCInfo{
		ChannelId: packet.SourceChannel,
		PortId:    packet.SourcePort,
	}

	keyshareRequest.EncryptedKeyshares = make([]*commontypes.EncryptedKeyshare, 0)
	keyshareRequest.RequestId = data.GetRequestId()
	keyshareRequest.Sent = false

	k.SetPrivateKeyShareRequest(ctx, keyshareRequest)

	packetAck.Identity = id
	packetAck.Pubkey = activePubKey.PublicKey

	return packetAck, nil
}

// OnTimeoutRequestAggrKeysharePacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutRequestPrivateKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data types.RequestPrivateKeysharePacketData) error {

	// Implement custom packet timeout logic
	// (Not required for fairyring since this packet is never sent from fairyring)

	return nil
}
