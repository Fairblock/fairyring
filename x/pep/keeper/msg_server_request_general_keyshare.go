package keeper

import (
	"context"
	"errors"
	"strconv"
	"time"

	commontypes "github.com/Fairblock/fairyring/x/common/types"
	kstypes "github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/Fairblock/fairyring/x/pep/types"

	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	clienttypes "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v7/modules/core/24-host"
)

func (k msgServer) RequestGeneralKeyshare(goCtx context.Context, msg *types.MsgRequestGeneralKeyshare) (*types.MsgRequestGeneralKeyshareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	params := k.GetParams(ctx)
	reqCountString := k.GetRequestCount(ctx)
	reqCount, _ := strconv.ParseUint(reqCountString, 10, 64)
	reqCount = reqCount + 1

	if params.IsSourceChain {
		entry := commontypes.RequestAggrKeyshare{
			Creator: msg.Creator,
			Id:      &commontypes.RequestAggrKeyshare_RequestId{RequestId: reqCountString},
		}

		k.SetReqQueueEntry(ctx, entry)
		k.SetRequestCount(ctx, reqCount)

		return &types.MsgRequestGeneralKeyshareResponse{
			ReqId: reqCountString,
		}, nil
	} else {
		packetData := kstypes.RequestAggrKeysharePacketData{
			Requester: msg.Creator,
			Id: &kstypes.RequestAggrKeysharePacketData_RequestId{
				RequestId: reqCountString,
			},
		}

		sPort := k.GetPort(ctx)
		timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()
		_, _ = k.TransmitRequestAggrKeysharePacket(
			ctx,
			packetData,
			sPort,
			params.KeyshareChannelId,
			clienttypes.ZeroHeight(),
			uint64(timeoutTimestamp),
		)

		k.SetRequestCount(ctx, reqCount)

		ctx.EventManager().EmitEvent(
			sdk.NewEvent(
				types.EventTypeRequestKeyshare,
				sdk.NewAttribute(types.AttributeKeyCreator, msg.Creator),
				sdk.NewAttribute(types.AttributeKeyRequestID, reqCountString),
			),
		)

		return &types.MsgRequestGeneralKeyshareResponse{
			ReqId: reqCountString,
		}, nil
	}
}

// TransmitRequestAggrKeysharePacket transmits the packet over IBC with the specified source port and source channel
func (k Keeper) TransmitRequestAggrKeysharePacket(
	ctx sdk.Context,
	packetData kstypes.RequestAggrKeysharePacketData,
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
	// if err != nil {
	// 	return 0, sdkerrors.Wrapf(sdkerrors.ErrJSONMarshal, "cannot marshal the packet: %w", err)
	// }

	return k.ChannelKeeper.SendPacket(ctx, channelCap, sourcePort, sourceChannel, timeoutHeight, timeoutTimestamp, packetBytes)
}

// OnAcknowledgementRequestAggrKeysharePacket responds to the the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementRequestAggrKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data kstypes.RequestAggrKeysharePacketData, ack channeltypes.Acknowledgement) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:

		// TODO: failed acknowledgement logic
		_ = dispatchedAck.Error
		return nil
	case *channeltypes.Acknowledgement_Result:
		// Decode the packet acknowledgment
		var packetAck kstypes.RequestAggrKeysharePacketAck

		if err := kstypes.ModuleCdc.UnmarshalJSON(dispatchedAck.Result, &packetAck); err != nil {
			// The counter-party module doesn't implement the correct acknowledgment format
			return errors.New("cannot unmarshal acknowledgment")
		}

		entry := types.GenEncTxExecutionQueue{
			Creator:   data.Requester,
			RequestId: data.GetRequestId(),
			Identity:  packetAck.GetIdentity(),
			Pubkey:    packetAck.GetPubkey(),
		}

		_, found := k.GetEntry(ctx, entry.RequestId)
		if found {
			return errors.New("entry already exists")
		}

		k.SetEntry(ctx, entry)

		ctx.EventManager().EmitEvent(
			sdk.NewEvent(
				types.EventTypeRequestKeyshare,
				sdk.NewAttribute(types.AttributeKeyCreator, entry.Creator),
				sdk.NewAttribute(types.AttributeKeyRequestID, entry.RequestId),
			),
		)

		return nil
	default:
		// The counter-party module doesn't implement the correct acknowledgment format
		return errors.New("invalid acknowledgment format")
	}
}

// // OnTimeoutRequestAggrKeysharePacket responds to the case where a packet has not been transmitted because of a timeout
// func (k Keeper) OnTimeoutRequestAggrKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data kstypes.RequestAggrKeysharePacketData) error {
// 	pID, _ := strconv.ParseUint(data.ProposalId, 10, 64)
// 	proposal, found := k.GetProposal(ctx, pID)
// 	if !found {
// 		return errors.New("Proposal not found")
// 	}

// 	if (proposal.Status == v1.ProposalStatus_PROPOSAL_STATUS_DEPOSIT_PERIOD) ||
// 		(proposal.Status == v1.ProposalStatus_PROPOSAL_STATUS_VOTING_PERIOD) {
// 		timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()

// 		_, _ = k.TransmitRequestAggrKeysharePacket(ctx,
// 			data,
// 			packet.SourcePort,
// 			packet.SourceChannel,
// 			clienttypes.ZeroHeight(),
// 			uint64(timeoutTimestamp),
// 		)
// 	}

// 	return nil
// }
