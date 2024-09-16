package keeper

import (
	"context"
	"errors"
	"time"

	sdkerrors "cosmossdk.io/errors"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	kstypes "github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	clienttypes "github.com/cosmos/ibc-go/v8/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v8/modules/core/24-host"
)

func (k msgServer) GetPrivateKeyshares(goCtx context.Context, msg *types.MsgGetPrivateKeyshares) (*types.MsgGetPrivateKeysharesResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	requester := sdk.MustAccAddressFromBech32(msg.Creator)

	entry, found := k.GetPrivateRequest(ctx, msg.ReqId)
	if !found {
		pubkey, found := k.GetActivePubKey(ctx)
		if !found {
			return &types.MsgGetPrivateKeysharesResponse{}, errors.New("entry and pubkey not found")
		}

		entry.Creator = ""
		entry.EncryptedKeyshares = make([]*commontypes.EncryptedKeyshare, 0)
		entry.Pubkey = pubkey.PublicKey
		entry.ReqId = msg.ReqId

		k.SetPrivateRequest(ctx, entry)
	}

	params := k.GetParams(ctx)

	if params.PrivateKeysharePrice.IsPositive() {
		k.bankKeeper.SendCoinsFromAccountToModule(ctx,
			requester,
			types.ModuleName,
			sdk.NewCoins(*params.PrivateKeysharePrice),
		)
	}

	if params.IsSourceChain {
		var qentry = commontypes.GetPrivateKeyshare{
			RequestId:  msg.ReqId,
			Identity:   msg.ReqId,
			Requester:  msg.Creator,
			SecpPubkey: msg.SecpPubkey,
		}

		k.SetPrivateSignalQueueEntry(ctx, qentry)
		return &types.MsgGetPrivateKeysharesResponse{}, nil
	} else {
		packetData := kstypes.GetPrivateKeysharePacketData{
			Identity:   msg.ReqId,
			Requester:  msg.Creator,
			SecpPubkey: msg.SecpPubkey,
		}

		sPort := k.GetPort(ctx)
		timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()
		_, _ = k.TransmitGetPrivateKeysharePacket(
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
				sdk.NewAttribute(types.AttributeKeyRequestID, msg.ReqId),
				sdk.NewAttribute("requester", msg.Creator),
				sdk.NewAttribute("scep256k1_pubkey", msg.SecpPubkey),
			),
		)
	}

	return &types.MsgGetPrivateKeysharesResponse{}, nil
}

// TransmitGetPrivateKeysharePacket transmits the packet over IBC with the specified source port and source channel
func (k Keeper) TransmitGetPrivateKeysharePacket(
	ctx sdk.Context,
	packetData kstypes.GetPrivateKeysharePacketData,
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
func (k Keeper) OnAcknowledgementGetPrivateKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data kstypes.GetPrivateKeysharePacketData, ack channeltypes.Acknowledgement) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:

		// TODO: failed acknowledgement logic
		_ = dispatchedAck.Error
		return nil
	case *channeltypes.Acknowledgement_Result:
		// Decode the packet acknowledgment
		var packetAck kstypes.GetPrivateKeysharePacketAck

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
