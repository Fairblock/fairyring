package keeper

import (
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
)

// OnRecvCurrentKeysPacket processes packet reception
func (k Keeper) OnRecvCurrentKeysPacket(ctx sdk.Context, packet channeltypes.Packet, data types.CurrentKeysPacketData) (packetAck types.CurrentKeysPacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	k.Logger().Info("Received keys packet req")

	ak, found := k.GetActivePubkey(ctx)
	if found {
		packetAck.ActiveKey = &commontypes.ActivePublicKey{
			PublicKey: ak.PublicKey,
			Creator:   ak.Creator,
			Expiry:    ak.Expiry,
		}
	}

	qk, found := k.GetQueuedPubkey(ctx)
	if found {
		packetAck.QueuedKey = &commontypes.QueuedPublicKey{
			PublicKey: qk.PublicKey,
			Creator:   qk.Creator,
			Expiry:    qk.Expiry,
		}
	}

	return packetAck, nil
}
