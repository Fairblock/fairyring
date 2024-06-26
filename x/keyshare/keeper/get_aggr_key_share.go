package keeper

import (
	"errors"

	"github.com/Fairblock/fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
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

	key, _ := k.GetActivePubKey(ctx)
	if keyshareReq.Pubkey != key.PublicKey {
		qKey, found := k.GetQueuedPubKey(ctx)
		if !found {
			return packetAck, errors.New("pubkey not found")
		}
		if qKey.PublicKey != keyshareReq.Pubkey {
			return packetAck, errors.New("pubkey not found")
		}
		return packetAck, errors.New("retry after current queued key becomes active key")
	}

	if err := verifyIBCInfo(packet, keyshareReq); err != nil {
		return packetAck, err
	}

	if keyshareReq.AggrKeyshare == "" {

		k.Logger().Info("Got OnRecvGetAggrKeysharePacket")

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

func verifyIBCInfo(packet channeltypes.Packet, keyshareReq types.KeyShareRequest) error {
	if keyshareReq.Counterparty.ChannelID != packet.SourceChannel ||
		keyshareReq.Counterparty.PortID != packet.SourcePort ||
		keyshareReq.IbcInfo.ChannelID != packet.DestinationChannel ||
		keyshareReq.IbcInfo.PortID != packet.DestinationPort {
		return errors.New("unauthorized request")
	}
	return nil
}
