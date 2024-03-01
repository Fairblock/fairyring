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
	clienttypes "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v7/modules/core/24-host"
)

func (k msgServer) GetGeneralKeyshare(goCtx context.Context, msg *types.MsgGetGeneralKeyshare) (*types.MsgGetGeneralKeyshareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	logger := k.Logger(ctx)

	entry, found := k.GetQueueEntry(ctx, msg.Identity)
	if !found {
		return &types.MsgGetGeneralKeyshareResponse{}, errors.New("identity not found")
	}

	if entry.Creator != msg.Creator {
		return &types.MsgGetGeneralKeyshareResponse{}, errors.New("unauthorized request. only creator can make this request")
	}

	params := k.GetParams(ctx)
	if params.IsSourceChain {
		req := commontypes.MsgGetAggrKeyshare{
			Identity: entry.Identity,
		}
		err := k.GetAggrKeyshare(ctx, req)
		if err != nil {
			logger.Info(
				"Request to fetch aggr. Keyshare failed",
				"Request ID", entry.RequestId,
				"Identity", entry.Identity,
				"error", err,
			)
			return &types.MsgGetGeneralKeyshareResponse{}, err
		}

	} else {
		packetData := kstypes.GetAggrKeysharePacketData{
			Identity: msg.Identity,
		}

		sPort := k.GetPort(ctx)
		timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()
		_, _ = k.TransmitGetAggrKeysharePacket(
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
				sdk.NewAttribute(types.AttributeKeyRequestID, msg.Identity),
			),
		)

	}

	return &types.MsgGetGeneralKeyshareResponse{}, nil
}

// TransmitGetAggrKeysharePacket transmits the packet over IBC with the specified source port and source channel
func (k Keeper) TransmitGetAggrKeysharePacket(
	ctx sdk.Context,
	packetData kstypes.GetAggrKeysharePacketData,
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

func (keeper Keeper) GetAggrKeyshare(ctx sdk.Context, req commontypes.MsgGetAggrKeyshare) error {
	_, err := keeper.keyshareKeeper.ProcessGetKeyshareRequest(ctx, req)
	if err != nil {
		return err
	}

	return nil
}

// OnAcknowledgementGetAggrKeysharePacket responds to the the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementGetAggrKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data kstypes.GetAggrKeysharePacketData, ack channeltypes.Acknowledgement) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:

		// TODO: failed acknowledgement logic
		_ = dispatchedAck.Error
		return nil
	case *channeltypes.Acknowledgement_Result:
		// Decode the packet acknowledgment
		var packetAck kstypes.GetAggrKeysharePacketAck

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
