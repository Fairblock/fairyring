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

func (k msgServer) RequestPrivateIdentity(goCtx context.Context, msg *types.MsgRequestPrivateIdentity) (*types.MsgRequestPrivateIdentityResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	reqID, found := k.GetRequestId(ctx, msg.Creator, msg.ReqId)
	if found || len(reqID.ReqId) != 0 {
		return nil, types.ErrReqIDAlreadyExists
	}

	k.SetRequestId(ctx, types.RequestId{
		Creator: msg.Creator,
		ReqId:   msg.ReqId,
	})

	requestIDStr := types.GetReqIDStr(msg.Creator, msg.ReqId)
	req := types.PrivateRequest{
		Creator:               msg.Creator,
		ReqId:                 requestIDStr,
		Pubkey:                "",
		PrivateDecryptionKeys: make([]*commontypes.PrivateDecryptionKey, 0),
	}

	k.SetPrivateRequest(ctx, req)

	params := k.GetParams(ctx)

	if params.IsSourceChain {
		entry := commontypes.RequestPrivateDecryptionKey{
			Creator:   msg.Creator,
			RequestId: msg.ReqId,
		}

		k.SetPrivateReqQueueEntry(ctx, entry)

		return &types.MsgRequestPrivateIdentityResponse{
			ReqId: requestIDStr,
		}, nil
	} else {
		packetData := kstypes.RequestPrivateDecryptionKeyPacketData{
			Requester: msg.Creator,
			RequestId: msg.ReqId,
		}

		sPort := k.GetPort(ctx)
		timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()
		_, _ = k.TransmitRequestPrivateDecryptionKey(
			ctx,
			packetData,
			sPort,
			params.KeyshareChannelId,
			clienttypes.ZeroHeight(),
			uint64(timeoutTimestamp),
		)

		ctx.EventManager().EmitEvent(
			sdk.NewEvent(
				types.EventTypePrivateKeyshareRequestSent,
				sdk.NewAttribute(types.AttributeKeyCreator, msg.Creator),
				sdk.NewAttribute(types.AttributeKeyRequestID, requestIDStr),
			),
		)

		return &types.MsgRequestPrivateIdentityResponse{
			ReqId: requestIDStr,
		}, nil
	}

	// return &types.MsgRequestPrivateIdentityResponse{}, nil
}

// TransmitRequestPrivateDecryptionKey transmits the packet over IBC
// with the specified source port and source channel
func (k Keeper) TransmitRequestPrivateDecryptionKey(
	ctx sdk.Context,
	packetData kstypes.RequestPrivateDecryptionKeyPacketData,
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

// OnAcknowledgementRequestPrivateDecryptionKeyPacket responds to
// the success or failure of a packet acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementRequestPrivateDecryptionKeyPacket(
	ctx sdk.Context,
	packet channeltypes.Packet,
	data kstypes.RequestPrivateDecryptionKeyPacketData,
	ack channeltypes.Acknowledgement,
) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:

		// TODO: failed acknowledgement logic
		_ = dispatchedAck.Error
		return nil
	case *channeltypes.Acknowledgement_Result:
		// Decode the packet acknowledgment
		var packetAck kstypes.RequestPrivateDecryptionKeyPacketAck

		if err := kstypes.ModuleCdc.UnmarshalJSON(dispatchedAck.Result, &packetAck); err != nil {
			// The counter-party module doesn't implement the correct acknowledgment format
			return errors.New("cannot unmarshal acknowledgment")
		}

		entry := types.PrivateRequest{
			Creator: data.Requester,
			ReqId:   data.GetRequestId(),
			Pubkey:  packetAck.GetPubkey(),
		}

		entry, found := k.GetPrivateRequest(ctx, data.RequestId)
		if !found {
			return errors.New("entry does not exists")
		}
		entry.Pubkey = packetAck.Pubkey

		k.SetPrivateRequest(ctx, entry)

		ctx.EventManager().EmitEvent(
			sdk.NewEvent(
				types.EventTypePrivateKeyshareRequest,
				sdk.NewAttribute(types.AttributeKeyCreator, entry.Creator),
				sdk.NewAttribute(types.AttributeKeyRequestID, entry.ReqId),
			),
		)

		return nil
	default:
		// The counter-party module doesn't implement the correct acknowledgment format
		return errors.New("invalid acknowledgment format")
	}
}
