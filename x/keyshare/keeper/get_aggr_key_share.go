package keeper

import (
	"errors"

	commontypes "github.com/Fairblock/fairyring/x/common/types"
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

// OnRecvGetPrivateKeysharePacket processes packet reception
func (k Keeper) OnRecvGetPrivateKeysharePacket(
	ctx sdk.Context,
	packet channeltypes.Packet,
	data types.GetPrivateKeysharePacketData,
) (packetAck types.GetPrivateKeysharePacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	activePubKey, found := k.GetActivePubKey(ctx)
	if !found {
		return packetAck, errors.New("active public key not found")
	}

	keyshareReq, found := k.GetPrivateKeyShareRequest(ctx, data.Identity)
	if !found {
		keyshareReq.Identity = data.Identity
		keyshareReq.Pubkey = activePubKey.PublicKey
		keyshareReq.IbcInfo = &types.IBCInfo{
			ChannelId: packet.DestinationChannel,
			PortId:    packet.DestinationPort,
		}

		keyshareReq.Counterparty = &types.CounterPartyIBCInfo{
			ChannelId: packet.SourceChannel,
			PortId:    packet.SourcePort,
		}

		keyshareReq.EncryptedKeyshares = make([]*commontypes.EncryptedKeyshare, 0)
		keyshareReq.RequestId = data.Identity
		keyshareReq.Sent = false

		k.SetPrivateKeyShareRequest(ctx, keyshareReq)
	}

	if len(keyshareReq.EncryptedKeyshares) == 0 {
		k.Logger().Info("Got OnRecvGetPrivateKeysharePacket")

		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.StartSendEncryptedKeyShareEventType,
				sdk.NewAttribute(types.StartSendGeneralKeyShareEventIdentity, data.Identity),
				sdk.NewAttribute(types.StartSendEncryptedKeyShareEventRequester, data.Requester),
				sdk.NewAttribute(types.StartSendEncryptedKeyShareEventPubkey, data.SecpPubkey),
			),
		)
	}

	return packetAck, nil
}

// OnTimeoutGetPrivateKeysharePacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutGetPrivateKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data types.GetPrivateKeysharePacketData) error {

	// Implement custom packet timeout logic
	// (Not required for fairyring since this packet is never sent from fairyring)

	return nil
}

func verifyIBCInfo(packet channeltypes.Packet, keyshareReq types.KeyShareRequest) error {
	if keyshareReq.Counterparty.ChannelId != packet.SourceChannel ||
		keyshareReq.Counterparty.PortId != packet.SourcePort ||
		keyshareReq.IbcInfo.ChannelId != packet.DestinationChannel ||
		keyshareReq.IbcInfo.PortId != packet.DestinationPort {
		return errors.New("unauthorized request")
	}
	return nil
}
