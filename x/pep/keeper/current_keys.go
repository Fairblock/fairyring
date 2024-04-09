package keeper

import (
	"errors"
	"time"

	kstypes "github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/Fairblock/fairyring/x/pep/types"

	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	clienttypes "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v7/modules/core/24-host"
)

func (k Keeper) QueryFairyringCurrentKeys(ctx sdk.Context) error {
	srcPort := k.GetPort(ctx)
	params := k.GetParams(ctx)
	srcChannel := params.KeyshareChannelId

	timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()
	var packet kstypes.CurrentKeysPacketData

	// Transmit the packet
	return k.TransmitCurrentKeysPacket(
		ctx,
		packet,
		srcPort,
		srcChannel,
		clienttypes.ZeroHeight(),
		uint64(timeoutTimestamp),
	)
}

// TransmitCurrentKeysPacket transmits the packet over IBC with the specified source port and source channel
func (k Keeper) TransmitCurrentKeysPacket(
	ctx sdk.Context,
	packetData kstypes.CurrentKeysPacketData,
	sourcePort,
	sourceChannel string,
	timeoutHeight clienttypes.Height,
	timeoutTimestamp uint64,
) error {

	_, found := k.ChannelKeeper.GetChannel(ctx, sourcePort, sourceChannel)
	if !found {
		return sdkerrors.Wrapf(channeltypes.ErrChannelNotFound, "port ID (%s) channel ID (%s)", sourcePort, sourceChannel)
	}

	// get the next sequence
	_, found = k.ChannelKeeper.GetNextSequenceSend(ctx, sourcePort, sourceChannel)
	if !found {
		return sdkerrors.Wrapf(
			channeltypes.ErrSequenceSendNotFound,
			"source port: %s, source channel: %s", sourcePort, sourceChannel,
		)
	}

	channelCap, ok := k.ScopedKeeper.GetCapability(ctx, host.ChannelCapabilityPath(sourcePort, sourceChannel))
	if !ok {
		return sdkerrors.Wrap(channeltypes.ErrChannelCapabilityNotFound, "module does not own channel capability")
	}

	packetBytes := packetData.GetBytes()

	if _, err := k.ChannelKeeper.SendPacket(ctx, channelCap, sourcePort, sourceChannel, timeoutHeight, timeoutTimestamp, packetBytes); err != nil {
		return err
	}

	return nil
}

// OnAcknowledgementCurrentKeysPacket responds to the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementCurrentKeysPacket(ctx sdk.Context, packet channeltypes.Packet, data kstypes.CurrentKeysPacketData, ack channeltypes.Acknowledgement) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:
		k.Logger(ctx).Error("Ack Error")
		k.Logger(ctx).Error(dispatchedAck.Error)
		return errors.New(dispatchedAck.Error)
	case *channeltypes.Acknowledgement_Result:
		channel, found := k.ChannelKeeper.GetChannel(ctx, packet.SourcePort, packet.SourceChannel)
		if !found {
			return errors.New("channel info not found")
		}

		// Retrieve the connection associated with the channel
		connection, found := k.connectionKeeper.GetConnection(ctx, channel.ConnectionHops[0])
		if !found {
			return errors.New("connection info not found")
		}

		params := k.GetParams(ctx)

		trusted := verifyCounterparty(
			connection.Counterparty.ClientId,
			connection.Counterparty.ConnectionId,
			channel.Counterparty.GetChannelID(),
			params.TrustedCounterParties,
		)

		if !trusted {
			return errors.New("counterparty is not trusted")
		}

		// Decode the packet acknowledgment
		var packetAck kstypes.CurrentKeysPacketAck

		if err := types.ModuleCdc.UnmarshalJSON(dispatchedAck.Result, &packetAck); err != nil {
			// The counter-party module doesn't implement the correct acknowledgment format
			return errors.New("cannot unmarshal acknowledgment")
		}

		k.Logger(ctx).Info("Got ack result")
		k.Logger(ctx).Info(packetAck.String())

		if packetAck.ActiveKey == nil {
			k.Logger(ctx).Info("active key is nil in packet ack")
			return nil
		}

		ak, found := k.GetActivePubKey(ctx)
		if !found {
			k.SetActivePubKey(ctx, *packetAck.ActiveKey)
		} else {
			if ak.Expiry <= packetAck.ActiveKey.Expiry {
				k.SetActivePubKey(ctx, *packetAck.ActiveKey)
			}
		}

		if packetAck.QueuedKey == nil {
			k.Logger(ctx).Info("queued key is nil in packet ack")
			return nil
		}

		qk, found := k.GetQueuedPubKey(ctx)
		if !found {
			k.SetQueuedPubKey(ctx, *packetAck.QueuedKey)
		} else {
			if qk.Expiry <= packetAck.QueuedKey.Expiry {
				k.SetQueuedPubKey(ctx, *packetAck.QueuedKey)
			}
		}

		return nil
	default:
		// The counter-party module doesn't implement the correct acknowledgment format
		return errors.New("invalid acknowledgment format")
	}
}

// OnTimeoutCurrentKeysPacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutCurrentKeysPacket(ctx sdk.Context, packet channeltypes.Packet, data kstypes.CurrentKeysPacketData) error {
	k.Logger(ctx).Info("Packet timeout")
	k.Logger(ctx).Info(data.String())
	return nil
}

func verifyCounterparty(clientID string, connectionID string, channelId string, trustedChannels []*types.TrustedCounterParty) bool {
	for _, channelInfo := range trustedChannels {
		if channelInfo.ClientId == clientID && channelInfo.ConnectionId == connectionID && channelInfo.ChannelId == channelId {
			return true
		}
	}

	return false
}
