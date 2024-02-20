package keeper

import (
	"errors"

	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
)

// OnRecvGetAggrKeysharePacket processes packet reception
func (k Keeper) OnRecvGetAggrKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data types.GetAggrKeysharePacketData) (packetAck types.GetAggrKeysharePacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	keyshareReq, found := k.GetKeyShareRequest(ctx, data.Identity)
	if !found {
		return packetAck, types.ErrRequestNotFound
	}

	if err := verifyIBCInfo(packet, keyshareReq); err != nil {
		return packetAck, err
	}

	if keyshareReq.AggrKeyshare == "" {

		k.Logger(ctx).Info("Got OnRecvGetAggrKeysharePacket")

		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.StartSendGeneralKeyShareEventType,
				sdk.NewAttribute(types.StartSendGeneralKeyShareEventIdentity, data.Identity),
			),
		)
	}

	return packetAck, nil
}

// OnTimeoutGetAggrKeysharePacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutGetAggrKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data types.GetAggrKeysharePacketData) error {

	// Implement custom packet timeout logic
	// (Not required for fairyring since this packet is never sent from fairyring)

	return nil
}

func (k Keeper) ProcessGetKeyshareRequest(ctx sdk.Context, msg commontypes.MsgGetAggrKeyshare,
) (rsp commontypes.MsgGetAggrKeyshareResponse, err error) {
	if msg.Identity == "" {
		return rsp, errors.New("identity is blank")
	}

	keyshareReq, found := k.GetKeyShareRequest(ctx, msg.Identity)
	if !found {
		return rsp, types.ErrRequestNotFound
	}

	if keyshareReq.AggrKeyshare == "" {
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.StartSendGeneralKeyShareEventType,
				sdk.NewAttribute(types.StartSendGeneralKeyShareEventIdentity, msg.Identity),
			),
		)
	}

	return rsp, nil
}

func verifyIBCInfo(packet channeltypes.Packet, keyshareReq types.KeyShareRequest) error {
	if keyshareReq.Counterparty.ChannelID != packet.SourceChannel ||
		keyshareReq.Counterparty.PortID != packet.SourcePort ||
		keyshareReq.IbcInfo.ChannelID != packet.DestinationChannel ||
		keyshareReq.IbcInfo.PortID != packet.DestinationPort {
		return errors.New("unauthorized request")
	}
	return nil
}
