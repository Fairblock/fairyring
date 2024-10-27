package keeper

import (
	"errors"

	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
)

// OnRecvGetDecryptionKeyPacket processes packet reception
func (k Keeper) OnRecvGetDecryptionKeyPacket(
	ctx sdk.Context,
	packet channeltypes.Packet,
	data types.GetDecryptionKeyPacketData,
) (packetAck types.GetDecryptionKeyPacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	keyshareReq, found := k.GetDecryptionKeyRequest(ctx, data.Identity)
	if !found {
		return packetAck, types.ErrRequestNotFound
	}

	key, _ := k.GetActivePubkey(ctx)
	if keyshareReq.Pubkey != key.PublicKey {
		qKey, found := k.GetQueuedPubkey(ctx)
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

	if keyshareReq.DecryptionKey == "" {

		k.Logger().Info("Got GetDecryptionKeyPacket")

		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.StartSendGeneralKeyshareEventType,
				sdk.NewAttribute(types.StartSendGeneralKeyshareEventIdentity, data.Identity),
			),
		)
	}

	return packetAck, nil
}

// OnTimeoutGetDecryptionKeyPacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutGetDecryptionKeyPacket(ctx sdk.Context, packet channeltypes.Packet, data types.GetDecryptionKeyPacketData) error {
	// Implement custom packet timeout logic
	// (Not required for fairyring since this packet is never sent from fairyring)

	return nil
}

// OnRecvGetPrivateDecryptionKeyPacket processes packet reception
func (k Keeper) OnRecvGetPrivateDecryptionKeyPacket(
	ctx sdk.Context,
	packet channeltypes.Packet,
	data types.GetPrivateDecryptionKeyPacketData,
) (packetAck types.GetPrivateDecryptionKeyPacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	activePubkey, found := k.GetActivePubkey(ctx)
	if !found {
		return packetAck, errors.New("active public key not found")
	}

	keyshareReq, found := k.GetPrivateDecryptionKeyRequest(ctx, data.Identity)
	if !found {
		keyshareReq.Identity = data.Identity
		keyshareReq.Pubkey = activePubkey.PublicKey
		keyshareReq.IbcInfo = &types.IBCInfo{
			ChannelId: packet.DestinationChannel,
			PortId:    packet.DestinationPort,
		}

		keyshareReq.Counterparty = &types.CounterPartyIBCInfo{
			ChannelId: packet.SourceChannel,
			PortId:    packet.SourcePort,
		}

		keyshareReq.PrivateDecryptionKeys = make([]*commontypes.PrivateDecryptionKey, 0)
		keyshareReq.Sent = false

		k.SetPrivateDecryptionKeyRequest(ctx, keyshareReq)
	}

	if len(keyshareReq.PrivateDecryptionKeys) == 0 {
		k.Logger().Info("Got OnRecvGetPrivateKeysharePacket")

		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.StartSendEncryptedKeyshareEventType,
				sdk.NewAttribute(types.StartSendGeneralKeyshareEventIdentity, data.Identity),
				sdk.NewAttribute(types.StartSendEncryptedKeyshareEventRequester, data.Requester),
				sdk.NewAttribute(types.StartSendEncryptedKeyshareEventPubkey, data.SecpPubkey),
			),
		)
	}

	return packetAck, nil
}

// OnTimeoutGetPrivateDecryptionKeyPacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutGetPrivateDecryptionKeyPacket(ctx sdk.Context, packet channeltypes.Packet, data types.GetPrivateDecryptionKeyPacketData) error {
	// Implement custom packet timeout logic
	// (Not required for fairyring since this packet is never sent from fairyring)

	return nil
}

func verifyIBCInfo(packet channeltypes.Packet, keyshareReq types.DecryptionKeyRequest) error {
	if keyshareReq.Counterparty.ChannelId != packet.SourceChannel ||
		keyshareReq.Counterparty.PortId != packet.SourcePort ||
		keyshareReq.IbcInfo.ChannelId != packet.DestinationChannel ||
		keyshareReq.IbcInfo.PortId != packet.DestinationPort {
		return errors.New("unauthorized request")
	}
	return nil
}
