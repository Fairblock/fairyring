package keeper

import (
	"context"
	"errors"
	"time"

	commontypes "github.com/Fairblock/fairyring/x/common/types"
	kstypes "github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/Fairblock/fairyring/x/pep/types"

	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	clienttypes "github.com/cosmos/ibc-go/v8/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v8/modules/core/24-host"
)

func (k msgServer) RequestGeneralIdentity(
	goCtx context.Context,
	msg *types.MsgRequestGeneralIdentity,
) (*types.MsgRequestGeneralIdentityResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	reqID, found := k.GetRequestId(ctx, msg.Creator, msg.ReqId)
	if found || len(reqID.ReqId) != 0 {
		return nil, types.ErrReqIDAlreadyExists
	}

	identity := types.GenerateIdentityFromReqID(msg.Creator, msg.ReqId)

	if msg.EstimatedDelay == nil {
		return &types.MsgRequestGeneralIdentityResponse{}, errors.New("could not parse estimated delay")
	}

	k.SetRequestId(ctx, types.RequestId{
		Creator: msg.Creator,
		ReqId:   msg.ReqId,
	})

	params := k.GetParams(ctx)

	if params.IsSourceChain {
		entry := commontypes.RequestDecryptionKey{
			Creator:        msg.Creator,
			Id:             &commontypes.RequestDecryptionKey_Identity{Identity: identity},
			EstimatedDelay: msg.EstimatedDelay,
		}

		k.SetReqQueueEntry(ctx, entry)

		return &types.MsgRequestGeneralIdentityResponse{
			Identity: identity,
		}, nil
	} else {
		packetData := kstypes.RequestDecryptionKeyPacketData{
			Requester: msg.Creator,
			Id: &kstypes.RequestDecryptionKeyPacketData_Identity{
				Identity: identity,
			},
			EstimatedDelay: msg.EstimatedDelay,
		}

		sPort := k.GetPort(ctx)
		timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()
		_, _ = k.TransmitRequestDecryptionKeyPacket(
			ctx,
			packetData,
			sPort,
			params.KeyshareChannelId,
			clienttypes.ZeroHeight(),
			uint64(timeoutTimestamp),
		)

		ctx.EventManager().EmitEvent(
			sdk.NewEvent(
				types.EventTypeRequestKeyshare,
				sdk.NewAttribute(types.AttributeKeyCreator, msg.Creator),
				sdk.NewAttribute(types.AttributeKeyIdentity, identity),
			),
		)

		return &types.MsgRequestGeneralIdentityResponse{
			Identity: identity,
		}, nil
	}
}

// TransmitRequestDecryptionKeyPacket transmits the packet over IBC with the specified source port and source channel
func (k Keeper) TransmitRequestDecryptionKeyPacket(
	ctx sdk.Context,
	packetData kstypes.RequestDecryptionKeyPacketData,
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

// OnAcknowledgementRequestDecryptionKeyPacket responds to the the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementRequestDecryptionKeyPacket(
	ctx sdk.Context,
	packet channeltypes.Packet,
	data kstypes.RequestDecryptionKeyPacketData,
	ack channeltypes.Acknowledgement,
) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:

		// TODO: failed acknowledgement logic
		_ = dispatchedAck.Error
		return nil
	case *channeltypes.Acknowledgement_Result:
		// Decode the packet acknowledgment
		var packetAck kstypes.RequestDecryptionKeyPacketAck

		if err := kstypes.ModuleCdc.UnmarshalJSON(dispatchedAck.Result, &packetAck); err != nil {
			// The counter-party module doesn't implement the correct acknowledgment format
			return errors.New("cannot unmarshal acknowledgment")
		}

		entry := types.IdentityExecutionEntry{
			Creator:  data.Requester,
			Identity: packetAck.GetIdentity(),
			Pubkey:   packetAck.GetPubkey(),
		}

		_, found := k.GetEntry(ctx, entry.Identity)
		if found {
			return errors.New("entry already exists")
		}

		k.SetEntry(ctx, entry)

		ctx.EventManager().EmitEvent(
			sdk.NewEvent(
				types.EventTypeRequestKeyshare,
				sdk.NewAttribute(types.AttributeKeyCreator, entry.Creator),
				sdk.NewAttribute(types.AttributeKeyIdentity, entry.Identity),
			),
		)

		return nil
	default:
		// The counter-party module doesn't implement the correct acknowledgment format
		return errors.New("invalid acknowledgment format")
	}
}
