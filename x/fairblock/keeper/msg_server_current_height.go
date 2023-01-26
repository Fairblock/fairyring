package keeper

import (
	"context"

	"fairyring/x/fairblock/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	clienttypes "github.com/cosmos/ibc-go/v5/modules/core/02-client/types"
)

func (k msgServer) SendCurrentHeight(goCtx context.Context, msg *types.MsgSendCurrentHeight) (*types.MsgSendCurrentHeightResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: logic before transmitting the packet

	// Construct the packet
	var packet types.CurrentHeightPacketData

	// Transmit the packet
	err := k.TransmitCurrentHeightPacket(
		ctx,
		packet,
		msg.Port,
		msg.ChannelID,
		clienttypes.ZeroHeight(),
		msg.TimeoutTimestamp,
	)
	if err != nil {
		return nil, err
	}

	return &types.MsgSendCurrentHeightResponse{}, nil
}
