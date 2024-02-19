package keeper

import (
	"strconv"

	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"

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

	packetBytes := packetData.GetBytes()

	return k.ChannelKeeper.SendPacket(ctx, channelCap, sourcePort, sourceChannel, timeoutHeight, timeoutTimestamp, packetBytes)
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

	var isProposalID bool
	switch data.Id.(type) {
	case *types.RequestAggrKeysharePacketData_ProposalId:
		isProposalID = true
	default:
		isProposalID = false
	}

	reqCountString := k.GetRequestCount(ctx)
	reqCount, _ := strconv.ParseUint(reqCountString, 10, 64)
	reqCount = reqCount + 1

	id := types.IdentityFromRequestCount(reqCount)
	activePubKey, found := k.GetActivePubKey(ctx)
	if !found {
		return packetAck, err
	}

	var keyshareRequest types.KeyShareRequest

	keyshareRequest.Identity = id
	keyshareRequest.Pubkey = activePubKey.PublicKey
	keyshareRequest.IbcInfo = &types.IBCInfo{
		ChannelID: packet.DestinationChannel,
		PortID:    packet.DestinationPort,
	}

	keyshareRequest.Counterparty = &types.CounterPartyIBCInfo{
		ChannelID: packet.SourceChannel,
		PortID:    packet.SourcePort,
	}

	keyshareRequest.AggrKeyshare = ""

	if isProposalID {
		keyshareRequest.ProposalId = data.GetProposalId()
	} else {
		keyshareRequest.RequestId = data.GetRequestId()
	}
	keyshareRequest.Sent = false

	k.SetKeyShareRequest(ctx, keyshareRequest)

	k.SetRequestCount(ctx, reqCount)

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

func (k Keeper) ProcessKeyshareRequest(ctx sdk.Context, msg commontypes.MsgRequestAggrKeyshare,
) (rsp commontypes.MsgRequestAggrKeyshareResponse, err error) {
	var isProposalID bool

	switch msg.Id.(type) {
	case *commontypes.MsgRequestAggrKeyshare_ProposalId:
		isProposalID = true
		_, err := strconv.ParseUint(msg.GetProposalId(), 10, 64)
		if err != nil {
			return rsp, err
		}
	default:
		isProposalID = false
	}

	reqCountString := k.GetRequestCount(ctx)
	reqCount, _ := strconv.ParseUint(reqCountString, 10, 64)
	reqCount = reqCount + 1

	id := types.IdentityFromRequestCount(reqCount)
	activePubKey, found := k.GetActivePubKey(ctx)
	if !found {
		return rsp, err
	}

	var keyshareRequest types.KeyShareRequest

	keyshareRequest.Identity = id
	keyshareRequest.Pubkey = activePubKey.PublicKey

	keyshareRequest.AggrKeyshare = ""

	if isProposalID {
		keyshareRequest.ProposalId = msg.GetProposalId()
	} else {
		keyshareRequest.RequestId = msg.GetRequestId()
	}

	k.SetKeyShareRequest(ctx, keyshareRequest)

	k.SetRequestCount(ctx, reqCount)

	rsp.Identity = id
	rsp.Pubkey = activePubKey.PublicKey

	return rsp, nil
}
