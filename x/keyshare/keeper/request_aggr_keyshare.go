package keeper

import (
	"fmt"
	"strconv"

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
func (k Keeper) OnRecvRequestAggrKeysharePacket(
	ctx sdk.Context,
	packet channeltypes.Packet,
	data types.RequestAggrKeysharePacketData,
) (packetAck types.RequestAggrKeysharePacketAck, err error) {
	fmt.Println("\n\n\nOnRecvRequestAggrKeysharePacket\n\n\n")

	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	reqCountString := k.GetRequestCount(ctx)
	reqCount, _ := strconv.ParseUint(reqCountString, 10, 64)
	reqCount = reqCount + 1

	id := types.IdentityFromRequestCount(reqCount)
	activePubKey, found := k.GetActivePubKey(ctx)
	if !found {
		return packetAck, err
	}

	var keyshareRequest = types.KeyShareRequest{
		Identity: id,
		Pubkey:   activePubKey.PublicKey,
		IbcInfo: &types.IBCInfo{
			ChannelID: packet.DestinationChannel,
			PortID:    packet.DestinationPort,
		},
		Counterparty: &types.CounterPartyIBCInfo{
			ChannelID: packet.SourceChannel,
			PortID:    packet.SourcePort,
		},
		AggrKeyshare: "",
		ProposalId:   data.ProposalId,
		Sent:         false,
	}

	k.SetKeyShareRequest(ctx, keyshareRequest)

	k.SetRequestCount(ctx, reqCount)

	packetAck.Identity = id
	packetAck.Pubkey = activePubKey.PublicKey

	return packetAck, nil
}

// OnTimeoutRequestAggrKeysharePacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutRequestAggrKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data types.RequestAggrKeysharePacketData) error {

	// TODO: packet timeout logic

	return nil
}
