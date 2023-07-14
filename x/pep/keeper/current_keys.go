package keeper

import (
	"errors"
	"time"

	"fairyring/x/pep/types"

	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
	clienttypes "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v7/modules/core/24-host"
)

func (k Keeper) QueryFairyringCurrentKeys(ctx sdk.Context) error {
	srcPort := k.GetPort(ctx)
	params := k.GetParams(ctx)
	srcChannel := params.ChannelId

	timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()
	var packet types.CurrentKeysPacketData

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
	packetData types.CurrentKeysPacketData,
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

	packetBytes, err := packetData.GetBytes()
	if err != nil {
		return sdkerrors.Wrap(cosmoserror.ErrJSONMarshal, "cannot marshal the packet: "+err.Error())
	}

	if _, err := k.ChannelKeeper.SendPacket(ctx, channelCap, sourcePort, sourceChannel, timeoutHeight, timeoutTimestamp, packetBytes); err != nil {
		return err
	}

	return nil
}

// OnRecvCurrentKeysPacket processes packet reception
func (k Keeper) OnRecvCurrentKeysPacket(ctx sdk.Context, packet channeltypes.Packet, data types.CurrentKeysPacketData) (packetAck types.CurrentKeysPacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	k.Logger(ctx).Info("Received keys packet req")

	ak, found := k.GetActivePubKey(ctx)
	if found {
		packetAck.ActiveKey = &types.ActivePubKey{
			PublicKey: ak.PublicKey,
			Creator:   ak.Creator,
			Expiry:    ak.Expiry,
		}
	}

	qk, found := k.GetQueuedPubKey(ctx)
	if found {
		packetAck.QueuedKey = &types.QueuedPubKey{
			PublicKey: qk.PublicKey,
			Creator:   qk.Creator,
			Expiry:    qk.Expiry,
		}
	}

	return packetAck, nil
}

// OnAcknowledgementCurrentKeysPacket responds to the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementCurrentKeysPacket(ctx sdk.Context, packet channeltypes.Packet, data types.CurrentKeysPacketData, ack channeltypes.Acknowledgement) error {
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

		parmas := k.GetParams(ctx)
		trusted := verifyCounterparty(
			connection.Counterparty.ClientId,
			connection.Counterparty.ConnectionId,
			channel.Counterparty.GetChannelID(),
			parmas.TrustedCounterParties,
		)

		if !trusted {
			return errors.New("counterparty is not trusted")
		}

		// Decode the packet acknowledgment
		var packetAck types.CurrentKeysPacketAck

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
func (k Keeper) OnTimeoutCurrentKeysPacket(ctx sdk.Context, packet channeltypes.Packet, data types.CurrentKeysPacketData) error {
	k.Logger(ctx).Info("Packet timeout")
	k.Logger(ctx).Info(data.String())
	return nil
}

func verifyCounterparty(clientID string, connectionID string, channelId string, trustedChannels []*types.TrustedCounterParty) bool {
	for _, channelInfo := range trustedChannels {
		if channelInfo.ChannelId == clientID {
			if channelInfo.ConnectionId == connectionID {
				if channelInfo.ChannelId == channelId {
					return true
				}
			}
		}
	}

	return false
}
