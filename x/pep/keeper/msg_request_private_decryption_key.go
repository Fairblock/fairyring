package keeper

import (
	"context"
	"errors"
	"fmt"
	"time"

	sdkerrors "cosmossdk.io/errors"
	"cosmossdk.io/math"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	kstypes "github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	clienttypes "github.com/cosmos/ibc-go/v8/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v8/modules/core/24-host"
)

func (k msgServer) RequestPrivateDecryptionKey(
	goCtx context.Context,
	msg *types.MsgRequestPrivateDecryptionKey,
) (*types.MsgRequestPrivateDecryptionKeyResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	requester := sdk.MustAccAddressFromBech32(msg.Creator)

	entry, found := k.GetPrivateRequest(ctx, msg.Identity)
	if !found {
		pubkey, found := k.GetActivePubkey(ctx)
		if !found {
			return &types.MsgRequestPrivateDecryptionKeyResponse{}, errors.New("entry and pubkey not found")
		}

		entry.Creator = ""
		entry.PrivateDecryptionKeys = make([]*commontypes.PrivateDecryptionKey, 0)
		entry.Pubkey = pubkey.PublicKey
		entry.Identity = msg.Identity

		k.SetPrivateRequest(ctx, entry)
	}

	params := k.GetParams(ctx)

	if params.PrivateDecryptionKeyPrice.Amount.GT(math.ZeroInt()) {
		err := k.bankKeeper.SendCoinsFromAccountToModule(ctx,
			requester,
			types.ModuleName,
			sdk.NewCoins(*params.PrivateDecryptionKeyPrice),
		)
		if err != nil {
			k.Logger().Info(fmt.Sprintf("Error on sending coins: %v", err.Error()))
			return nil, err
		}
	}

	if params.IsSourceChain {
		var qentry = commontypes.GetPrivateDecryptionKey{
			Identity:   msg.Identity,
			Requester:  msg.Creator,
			SecpPubkey: msg.SecpPubkey,
		}

		k.SetPrivateSignalQueueEntry(ctx, qentry)
		return &types.MsgRequestPrivateDecryptionKeyResponse{}, nil
	} else {
		packetData := kstypes.GetPrivateDecryptionKeyPacketData{
			Identity:   msg.Identity,
			Requester:  msg.Creator,
			SecpPubkey: msg.SecpPubkey,
		}

		sPort := k.GetPort(ctx)
		timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()
		_, _ = k.TransmitGetPrivateDecryptionKeyPacket(
			ctx,
			packetData,
			sPort,
			params.KeyshareChannelId,
			clienttypes.ZeroHeight(),
			uint64(timeoutTimestamp),
		)

		ctx.EventManager().EmitEvent(
			sdk.NewEvent(
				types.EventTypeGetPrivateKeyshareRequest,
				sdk.NewAttribute(types.AttributeKeyIdentity, msg.Identity),
				sdk.NewAttribute("requester", msg.Creator),
				sdk.NewAttribute("scep256k1_pubkey", msg.SecpPubkey),
			),
		)
	}

	return &types.MsgRequestPrivateDecryptionKeyResponse{}, nil
}

// TransmitGetPrivateKeysharePacket transmits the packet over IBC with the specified source port and source channel
func (k Keeper) TransmitGetPrivateDecryptionKeyPacket(
	ctx sdk.Context,
	packetData kstypes.GetPrivateDecryptionKeyPacketData,
	sourcePort,
	sourceChannel string,
	timeoutHeight clienttypes.Height,
	timeoutTimestamp uint64,
) (uint64, error) {
	channelCap, ok := k.ScopedKeeper().GetCapability(ctx, host.ChannelCapabilityPath(sourcePort, sourceChannel))
	if !ok {
		return 0, sdkerrors.Wrap(channeltypes.ErrChannelCapabilityNotFound, "module does not own channel capability")
	}

	packetBytes := packetData.GetBytes()

	return k.ibcKeeperFn().ChannelKeeper.SendPacket(ctx, channelCap, sourcePort, sourceChannel, timeoutHeight, timeoutTimestamp, packetBytes)
}

// OnAcknowledgementGetPrivateKeysharePacket responds to the the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementGetPrivateDecryptionKeyPacket(
	ctx sdk.Context,
	packet channeltypes.Packet,
	data kstypes.GetPrivateDecryptionKeyPacketData,
	ack channeltypes.Acknowledgement,
) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:

		// TODO: failed acknowledgement logic
		_ = dispatchedAck.Error
		return nil
	case *channeltypes.Acknowledgement_Result:
		// Decode the packet acknowledgment
		var packetAck kstypes.GetPrivateDecryptionKeyPacketAck

		if err := types.ModuleCdc.UnmarshalJSON(dispatchedAck.Result, &packetAck); err != nil {
			// The counter-party module doesn't implement the correct acknowledgment format
			return errors.New("cannot unmarshal acknowledgment")
		}

		return nil
	default:
		// The counter-party module doesn't implement the correct acknowledgment format
		return errors.New("invalid acknowledgment format")
	}
}
