package keeper

import (
	"errors"
	"strconv"
	"time"

	"fairyring/x/fairblock/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	clienttypes "github.com/cosmos/ibc-go/v5/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v5/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v5/modules/core/24-host"
)

func (k Keeper) QueryFairyringCurrentHeight(ctx sdk.Context) error {
	srcPort := k.GetPort(ctx)
	srcChannel := k.GetChannel(ctx)

	timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()
	var packet types.CurrentHeightPacketData

	// Transmit the packet
	return k.TransmitCurrentHeightPacket(
		ctx,
		packet,
		srcPort,
		srcChannel,
		clienttypes.ZeroHeight(),
		uint64(timeoutTimestamp),
	)
}

// TransmitCurrentHeightPacket transmits the packet over IBC with the specified source port and source channel
func (k Keeper) TransmitCurrentHeightPacket(
	ctx sdk.Context,
	packetData types.CurrentHeightPacketData,
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
		return sdkerrors.Wrap(sdkerrors.ErrJSONMarshal, "cannot marshal the packet: "+err.Error())
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
func (k Keeper) OnRecvCurrentHeightPacket(ctx sdk.Context, packet channeltypes.Packet, data types.CurrentHeightPacketData) (packetAck types.CurrentHeightPacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	k.Logger(ctx).Info("Received height packet req")
	// TODO: packet reception logic
	packetAck.Height = uint64(ctx.BlockHeight())

	return packetAck, nil
}

// OnAcknowledgementCurrentHeightPacket responds to the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementCurrentHeightPacket(ctx sdk.Context, packet channeltypes.Packet, data types.CurrentHeightPacketData, ack channeltypes.Acknowledgement) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:

		// TODO: failed acknowledgement logic
		_ = dispatchedAck.Error

		return nil
	case *channeltypes.Acknowledgement_Result:
		// Decode the packet acknowledgment
		var packetAck types.CurrentHeightPacketAck

		if err := types.ModuleCdc.UnmarshalJSON(dispatchedAck.Result, &packetAck); err != nil {
			// The counter-party module doesn't implement the correct acknowledgment format
			return errors.New("cannot unmarshal acknowledgment")
		}

		// TODO: successful acknowledgement logic
		k.Logger(ctx).Info("Got ack result")
		k.Logger(ctx).Info(packetAck.String())
		k.Logger(ctx).Info(string(packetAck.Height))
		k.SetLatestHeight(ctx, strconv.FormatUint(packetAck.Height, 10))
		return nil
	default:
		// The counter-party module doesn't implement the correct acknowledgment format
		return errors.New("invalid acknowledgment format")
	}
}

// OnTimeoutCurrentHeightPacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutCurrentHeightPacket(ctx sdk.Context, packet channeltypes.Packet, data types.CurrentHeightPacketData) error {

	// TODO: packet timeout logic
	k.Logger(ctx).Info("Packet timeout")
	k.Logger(ctx).Info(data.String())
	return nil
}
