package keeper

import (
	"errors"
	"fmt"

	"fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	clienttypes "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v7/modules/core/24-host"
)

// TransmitAggrKeyshareDataPacket transmits the packet over IBC with the specified source port and source channel
func (k Keeper) TransmitAggrKeyshareDataPacket(
	ctx sdk.Context,
	packetData types.AggrKeyshareDataPacketData,
	sourcePort,
	sourceChannel string,
	timeoutHeight clienttypes.Height,
	timeoutTimestamp uint64,
) (uint64, error) {
	fmt.Println("\n\n\nTransmitAggrKeyshareDataPacket\n\n\n")
	ch, found := k.ChannelKeeper.GetChannel(ctx, sourcePort, sourceChannel)
	if !found {
		fmt.Println("\n\n\nChannel not found")
		return 0, sdkerrors.Wrapf(channeltypes.ErrChannelNotFound, "port ID (%s) channel ID (%s)", sourcePort, sourceChannel)
	}

	fmt.Println("conn hops: ", ch.ConnectionHops)
	fmt.Println("counterparty channel: ", ch.Counterparty.ChannelId)
	fmt.Println("counterparty port: ", ch.Counterparty.PortId)

	// get the next sequence
	sq, found := k.ChannelKeeper.GetNextSequenceSend(ctx, sourcePort, sourceChannel)
	if !found {
		fmt.Println("\n\n\nSequence not found")

		return 0, sdkerrors.Wrapf(
			channeltypes.ErrSequenceSendNotFound,
			"source port: %s, source channel: %s", sourcePort, sourceChannel,
		)
	}

	fmt.Println("next seq: ", sq)

	channelCap, ok := k.ScopedKeeper.GetCapability(ctx, host.ChannelCapabilityPath(sourcePort, sourceChannel))
	if !ok {
		return 0, sdkerrors.Wrap(channeltypes.ErrChannelCapabilityNotFound, "module does not own channel capability")
	}

	packetBytes, err := packetData.GetBytes()
	if err != nil {
		return 0, sdkerrors.Wrapf(sdkerrors.ErrJSONMarshal, "cannot marshal the packet: %w", err)
	}

	fmt.Println("Sending Packet")

	return k.ChannelKeeper.SendPacket(ctx, channelCap, sourcePort, sourceChannel, timeoutHeight, timeoutTimestamp, packetBytes)
}

// OnAcknowledgementAggrKeyshareDataPacket responds to the the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementAggrKeyshareDataPacket(ctx sdk.Context, packet channeltypes.Packet, data types.AggrKeyshareDataPacketData, ack channeltypes.Acknowledgement) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:

		// TODO: failed acknowledgement logic
		_ = dispatchedAck.Error
		fmt.Println("\n\n\nOnAcknowledgementAggrKeyshareDataPacket failure for reqID: ", data.Identity)

		return nil
	case *channeltypes.Acknowledgement_Result:
		// Decode the packet acknowledgment
		var packetAck types.AggrKeyshareDataPacketAck

		if err := types.ModuleCdc.UnmarshalJSON(dispatchedAck.Result, &packetAck); err != nil {
			// The counter-party module doesn't implement the correct acknowledgment format
			return errors.New("cannot unmarshal acknowledgment")
		}

		keyshareReq, found := k.GetKeyShareRequest(ctx, data.Identity)
		if !found {
			return errors.New("cannot find keyshare request")
		}

		keyshareReq.Sent = true
		k.SetKeyShareRequest(ctx, keyshareReq)
		fmt.Println("\n\n\nOnAcknowledgementAggrKeyshareDataPacket received for reqID: ", data.Identity)

		return nil
	default:
		// The counter-party module doesn't implement the correct acknowledgment format
		return errors.New("invalid acknowledgment format")
	}
}

// OnTimeoutAggrKeyshareDataPacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutAggrKeyshareDataPacket(ctx sdk.Context, packet channeltypes.Packet, data types.AggrKeyshareDataPacketData) error {

	// TODO: packet timeout logic

	return nil
}
