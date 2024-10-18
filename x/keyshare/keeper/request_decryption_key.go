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

// TransmitRequestDecryptionKeyPacket transmits the packet over IBC
// with the specified source port and source channel
func (k Keeper) TransmitRequestDecryptionKeyPacket(
	ctx sdk.Context,
	packetData types.RequestDecryptionKeyPacketData,
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

// OnRecvRequestDecryptionKeyPacket processes packet reception
func (k Keeper) OnRecvRequestDecryptionKeyPacket(
	ctx sdk.Context,
	packet channeltypes.Packet,
	data types.RequestDecryptionKeyPacketData,
) (packetAck types.RequestDecryptionKeyPacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	activePubkey, found := k.GetActivePubkey(ctx)
	if !found {
		return packetAck, err
	}

	delay := data.EstimatedDelay
	blockDelay := uint64(math.Ceil(delay.Seconds() / types.AvgBlockTime))
	currentHeight := uint64(ctx.BlockHeight())
	executionHeight := currentHeight + blockDelay
	if executionHeight > activePubkey.Expiry {
		queuedPubkey, found := k.GetQueuedPubkey(ctx)
		if !found {
			return packetAck, errors.New("estimated delay too long")
		}
		if executionHeight > queuedPubkey.Expiry {
			return packetAck, errors.New("estimated delay too long")
		}
		activePubkey = types.ActivePubkey(queuedPubkey)
	}

	var isProposalID bool
	switch data.Id.(type) {
	case *types.RequestDecryptionKeyPacketData_ProposalId:
		isProposalID = true
	default:
		isProposalID = false
	}

	id := data.GetRequestId()

	var keyshareRequest types.DecryptionKeyRequest

	keyshareRequest.Identity = id
	keyshareRequest.Pubkey = activePubkey.PublicKey
	keyshareRequest.IbcInfo = &types.IBCInfo{
		ChannelId: packet.DestinationChannel,
		PortId:    packet.DestinationPort,
	}

	keyshareRequest.Counterparty = &types.CounterPartyIBCInfo{
		ChannelId: packet.SourceChannel,
		PortId:    packet.SourcePort,
	}

	keyshareRequest.DecryptionKey = ""

	if isProposalID {
		keyshareRequest.ProposalId = data.GetProposalId()
	} else {
		keyshareRequest.RequestId = data.GetRequestId()
	}
	keyshareRequest.Sent = false

	k.SetKeyShareRequest(ctx, keyshareRequest)

	packetAck.Identity = id
	packetAck.Pubkey = activePubkey.PublicKey

	return packetAck, nil
}

// OnTimeoutRequestDecryptionKeyPacket responds to the case where a
// packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutRequestDecryptionKeyPacket(ctx sdk.Context, packet channeltypes.Packet, data types.RequestDecryptionKeyPacketData) error {

	// Implement custom packet timeout logic
	// (Not required for fairyring since this packet is never sent from fairyring)

	return nil
}

// OnRecvRequestPrivateKeysharePacket processes packet reception
func (k Keeper) OnRecvRequestPrivateDecryptionKeyPacket(
	ctx sdk.Context,
	packet channeltypes.Packet,
	data types.RequestPrivateDecryptionKeyPacketData,
) (packetAck types.RequestPrivateDecryptionKeyPacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	activePubkey, found := k.GetActivePubkey(ctx)
	if !found {
		return packetAck, err
	}

	id := data.GetRequestId()

	var keyshareRequest types.PrivateDecryptionKeyRequest

	keyshareRequest.Identity = id
	keyshareRequest.Pubkey = activePubkey.PublicKey
	keyshareRequest.IbcInfo = &types.IBCInfo{
		ChannelId: packet.DestinationChannel,
		PortId:    packet.DestinationPort,
	}

	keyshareRequest.Counterparty = &types.CounterPartyIBCInfo{
		ChannelId: packet.SourceChannel,
		PortId:    packet.SourcePort,
	}

	keyshareRequest.PrivateDecryptionKeys = make([]*commontypes.PrivateDecryptionKey, 0)
	keyshareRequest.RequestId = data.GetRequestId()
	keyshareRequest.Sent = false

	k.SetPrivateKeyShareRequest(ctx, keyshareRequest)

	packetAck.Identity = id
	packetAck.Pubkey = activePubkey.PublicKey

	return packetAck, nil
}

// OnTimeoutRequestAggrKeysharePacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutRequestPrivateDecryptionKeyPacket(ctx sdk.Context, packet channeltypes.Packet, data types.RequestPrivateDecryptionKeyPacketData) error {

	// Implement custom packet timeout logic
	// (Not required for fairyring since this packet is never sent from fairyring)

	return nil
}
