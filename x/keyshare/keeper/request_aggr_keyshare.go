package keeper

import (
	"errors"

	"fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	clienttypes "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v7/modules/core/24-host"
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
	channelCap, ok := k.ScopedKeeper.GetCapability(ctx, host.ChannelCapabilityPath(sourcePort, sourceChannel))
	if !ok {
		return 0, sdkerrors.Wrap(channeltypes.ErrChannelCapabilityNotFound, "module does not own channel capability")
	}

	packetBytes, err := packetData.GetBytes()
	if err != nil {
		return 0, sdkerrors.Wrapf(sdkerrors.ErrJSONMarshal, "cannot marshal the packet: %w", err)
	}

	return k.ChannelKeeper.SendPacket(ctx, channelCap, sourcePort, sourceChannel, timeoutHeight, timeoutTimestamp, packetBytes)
}

// OnRecvRequestAggrKeysharePacket processes packet reception
func (k Keeper) OnRecvRequestAggrKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data types.RequestAggrKeysharePacketData) (packetAck types.RequestAggrKeysharePacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	// TODO: packet reception logic

	return packetAck, nil
}

// OnAcknowledgementRequestAggrKeysharePacket responds to the the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementRequestAggrKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data types.RequestAggrKeysharePacketData, ack channeltypes.Acknowledgement) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:

		// TODO: failed acknowledgement logic
		_ = dispatchedAck.Error

		return nil
	case *channeltypes.Acknowledgement_Result:
		// Decode the packet acknowledgment
		var packetAck types.RequestAggrKeysharePacketAck

		if err := types.ModuleCdc.UnmarshalJSON(dispatchedAck.Result, &packetAck); err != nil {
			// The counter-party module doesn't implement the correct acknowledgment format
			return errors.New("cannot unmarshal acknowledgment")
		}

		// TODO: successful acknowledgement logic

		return nil
	default:
		// The counter-party module doesn't implement the correct acknowledgment format
		return errors.New("invalid acknowledgment format")
	}
}

// OnTimeoutRequestAggrKeysharePacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutRequestAggrKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data types.RequestAggrKeysharePacketData) error {

	// TODO: packet timeout logic

	return nil
}
