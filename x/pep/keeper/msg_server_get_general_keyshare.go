package keeper

import (
	"context"
	"time"

	sdkerrors "cosmossdk.io/errors"
	kstypes "github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	clienttypes "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v7/modules/core/24-host"
)

func (k msgServer) GetGeneralKeyshare(goCtx context.Context, msg *types.MsgGetGeneralKeyshare) (*types.MsgGetGeneralKeyshareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: check on creator

	params := k.GetParams(ctx)
	if params.IsSourceChain {
		//TODO: process for fairyring
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
