package keeper

import (
	"errors"
	"time"

	"fairyring/x/pep/types"

	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
	clienttypes "github.com/cosmos/ibc-go/v5/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v5/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v5/modules/core/24-host"
)

func (k Keeper) QueryFairyringCurrentKeys(ctx sdk.Context) error {
	srcPort := k.GetPort(ctx)
	srcChannel := k.GetChannel(ctx)

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

	sourceChannelEnd, found := k.ChannelKeeper.GetChannel(ctx, sourcePort, sourceChannel)
	if !found {
		return sdkerrors.Wrapf(channeltypes.ErrChannelNotFound, "port ID (%s) channel ID (%s)", sourcePort, sourceChannel)
	}

	destinationPort := sourceChannelEnd.GetCounterparty().GetPortID()
	destinationChannel := sourceChannelEnd.GetCounterparty().GetChannelID()

	// get the next sequence
	sequence, found := k.ChannelKeeper.GetNextSequenceSend(ctx, sourcePort, sourceChannel)
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

	packet := channeltypes.NewPacket(
		packetBytes,
		sequence,
		sourcePort,
		sourceChannel,
		destinationPort,
		destinationChannel,
		timeoutHeight,
		timeoutTimestamp,
	)

	if err := k.ChannelKeeper.SendPacket(ctx, channelCap, packet); err != nil {
		return err
	}

	return nil
}

// OnRecvCurrentHeightPacket processes packet reception
func (k Keeper) OnRecvCurrentHeightPacket(ctx sdk.Context, packet channeltypes.Packet, data types.CurrentKeysPacketData) (packetAck types.CurrentKeysPacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	k.Logger(ctx).Info("Received keys packet req")

	ak, found := k.GetActivePubKey(ctx)
	if found {
		packetAck.ActiveKey.Creator = ak.Creator
		packetAck.ActiveKey.Expiry = ak.Expiry
		packetAck.ActiveKey.PublicKey = ak.PublicKey
	}

	qk, found := k.GetQueuedPubKey(ctx)
	if found {
		packetAck.QueuedKey.Creator = qk.Creator
		packetAck.QueuedKey.Expiry = qk.Expiry
		packetAck.QueuedKey.PublicKey = qk.PublicKey
	}

	return packetAck, nil
}

// OnAcknowledgementCurrentHeightPacket responds to the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementCurrentHeightPacket(ctx sdk.Context, packet channeltypes.Packet, data types.CurrentKeysPacketData, ack channeltypes.Acknowledgement) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:

		// TODO: failed acknowledgement logic
		_ = dispatchedAck.Error

		return nil
	case *channeltypes.Acknowledgement_Result:
		// Decode the packet acknowledgment
		var packetAck types.CurrentKeysPacketAck

		if err := types.ModuleCdc.UnmarshalJSON(dispatchedAck.Result, &packetAck); err != nil {
			// The counter-party module doesn't implement the correct acknowledgment format
			return errors.New("cannot unmarshal acknowledgment")
		}

		k.Logger(ctx).Info("Got ack result")
		k.Logger(ctx).Info(packetAck.String())
		k.Logger(ctx).Info(string(packetAck.ActiveKey.PublicKey))
		k.Logger(ctx).Info(string(packetAck.QueuedKey.PublicKey))

		ak, found := k.GetActivePubKey(ctx)
		if !found {
			k.SetActivePubKey(ctx, *packetAck.ActiveKey)
		} else {
			if ak.Expiry <= packetAck.ActiveKey.Expiry {
				k.SetActivePubKey(ctx, *packetAck.ActiveKey)
			}
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

// OnTimeoutCurrentHeightPacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutCurrentHeightPacket(ctx sdk.Context, packet channeltypes.Packet, data types.CurrentKeysPacketData) error {

	// TODO: packet timeout logic
	k.Logger(ctx).Info("Packet timeout")
	k.Logger(ctx).Info(data.String())
	return nil
}
