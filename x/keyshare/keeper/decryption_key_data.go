package keeper

import (
	"errors"
	"time"

	"github.com/Fairblock/fairyring/x/keyshare/types"

	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	clienttypes "github.com/cosmos/ibc-go/v8/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v8/modules/core/24-host"
)

const MAX_RETRIES = 5

// TransmitDecryptionKeyDataPacket transmits the packet over IBC with the specified source port and source channel
func (k Keeper) TransmitDecryptionKeyDataPacket(
	ctx sdk.Context,
	packetData types.DecryptionKeyDataPacketData,
	sourcePort,
	sourceChannel string,
	timeoutHeight clienttypes.Height,
	timeoutTimestamp uint64,
) (uint64, error) {
	_, found := k.ibcKeeperFn().ChannelKeeper.GetChannel(ctx, sourcePort, sourceChannel)
	if !found {
		return 0, sdkerrors.Wrapf(channeltypes.ErrChannelNotFound, "port ID (%s) channel ID (%s)", sourcePort, sourceChannel)
	}

	// get the next sequence
	_, found = k.ibcKeeperFn().ChannelKeeper.GetNextSequenceSend(ctx, sourcePort, sourceChannel)
	if !found {
		return 0, sdkerrors.Wrapf(
			channeltypes.ErrSequenceSendNotFound,
			"source port: %s, source channel: %s", sourcePort, sourceChannel,
		)
	}

	channelCap, ok := k.ScopedKeeper().GetCapability(ctx, host.ChannelCapabilityPath(sourcePort, sourceChannel))
	if !ok {
		return 0, sdkerrors.Wrap(channeltypes.ErrChannelCapabilityNotFound, "module does not own channel capability")
	}

	packetBytes := packetData.GetBytes()

	return k.ibcKeeperFn().ChannelKeeper.SendPacket(ctx, channelCap, sourcePort, sourceChannel, timeoutHeight, timeoutTimestamp, packetBytes)
}

// OnAcknowledgementDecryptionKeyDataPacket responds to the the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementDecryptionKeyDataPacket(
	ctx sdk.Context,
	packet channeltypes.Packet,
	data types.DecryptionKeyDataPacketData,
	ack channeltypes.Acknowledgement,
) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:

		// retry sending the packet
		if data.Retries < MAX_RETRIES {
			timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()

			data.Retries = data.Retries + 1

			_, err := k.TransmitDecryptionKeyDataPacket(
				ctx,
				data,
				packet.SourcePort,
				packet.SourceChannel,
				clienttypes.ZeroHeight(),
				uint64(timeoutTimestamp),
			)
			if err != nil {
				return err
			}
		}
		return nil
	case *channeltypes.Acknowledgement_Result:
		// Decode the packet acknowledgment
		var packetAck types.DecryptionKeyPacketAck

		if err := types.ModuleCdc.UnmarshalJSON(dispatchedAck.Result, &packetAck); err != nil {
			// The counter-party module doesn't implement the correct acknowledgment format
			return errors.New("cannot unmarshal acknowledgment")
		}

		keyshareReq, found := k.GetDecryptionKeyRequest(ctx, data.Identity)
		if !found {
			return errors.New("cannot find keyshare request")
		}

		keyshareReq.Sent = true
		k.SetDecryptionKeyRequest(ctx, keyshareReq)

		return nil
	default:
		// The counter-party module doesn't implement the correct acknowledgment format
		return errors.New("invalid acknowledgment format")
	}
}

// OnTimeoutDecryptionKeyDataPacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutDecryptionKeyDataPacket(
	ctx sdk.Context,
	packet channeltypes.Packet,
	data types.DecryptionKeyDataPacketData,
) error {

	// retry sending the packet
	if data.Retries < MAX_RETRIES {
		timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()

		data.Retries = data.Retries + 1

		_, err := k.TransmitDecryptionKeyDataPacket(
			ctx,
			data,
			packet.SourcePort,
			packet.SourceChannel,
			clienttypes.ZeroHeight(),
			uint64(timeoutTimestamp),
		)
		if err != nil {
			return err
		}
	}

	return nil
}

// TransmitPrivateDecryptionKeyDataPacket transmits the packet over IBC with the specified source port and source channel
func (k Keeper) TransmitPrivateDecryptionKeyDataPacket(
	ctx sdk.Context,
	packetData types.PrivateDecryptionKeyDataPacketData,
	sourcePort,
	sourceChannel string,
	timeoutHeight clienttypes.Height,
	timeoutTimestamp uint64,
) (uint64, error) {
	_, found := k.ibcKeeperFn().ChannelKeeper.GetChannel(ctx, sourcePort, sourceChannel)
	if !found {
		return 0, sdkerrors.Wrapf(channeltypes.ErrChannelNotFound, "port ID (%s) channel ID (%s)", sourcePort, sourceChannel)
	}

	// get the next sequence
	_, found = k.ibcKeeperFn().ChannelKeeper.GetNextSequenceSend(ctx, sourcePort, sourceChannel)
	if !found {
		return 0, sdkerrors.Wrapf(
			channeltypes.ErrSequenceSendNotFound,
			"source port: %s, source channel: %s", sourcePort, sourceChannel,
		)
	}

	channelCap, ok := k.ScopedKeeper().GetCapability(ctx, host.ChannelCapabilityPath(sourcePort, sourceChannel))
	if !ok {
		return 0, sdkerrors.Wrap(channeltypes.ErrChannelCapabilityNotFound, "module does not own channel capability")
	}

	packetBytes := packetData.GetBytes()

	return k.ibcKeeperFn().ChannelKeeper.SendPacket(ctx, channelCap, sourcePort, sourceChannel, timeoutHeight, timeoutTimestamp, packetBytes)
}

// OnAcknowledgementPrivateDecryptionKeyDataPacket responds to the the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementPrivateDecryptionKeyDataPacket(
	ctx sdk.Context,
	packet channeltypes.Packet,
	data types.PrivateDecryptionKeyDataPacketData,
	ack channeltypes.Acknowledgement,
) error {
	switch ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:
		return nil
	case *channeltypes.Acknowledgement_Result:
		return nil
	default:
		// The counter-party module doesn't implement the correct acknowledgment format
		return errors.New("invalid acknowledgment format")
	}
}

// OnTimeoutPrivateDecryptionKeyDataPacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutPrivateDecryptionKeyDataPacket(
	ctx sdk.Context,
	packet channeltypes.Packet,
	data types.PrivateDecryptionKeyDataPacketData,
) error {
	return nil
}
