package keeper

import (
	"errors"
	"fairyring/x/keyshare/types"
	"fmt"
	"strconv"
	"time"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	clienttypes "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v7/modules/core/24-host"
)

// TransmitGetAggrKeysharePacket transmits the packet over IBC with the specified source port and source channel
func (k Keeper) TransmitGetAggrKeysharePacket(
	ctx sdk.Context,
	packetData types.GetAggrKeysharePacketData,
	sourcePort,
	sourceChannel string,
	timeoutHeight clienttypes.Height,
	timeoutTimestamp uint64,
) (uint64, error) {
	channelCap, ok := k.ScopedKeeper.GetCapability(ctx, host.ChannelCapabilityPath(sourcePort, sourceChannel))
	if !ok {
		return 0, sdkerrors.Wrap(channeltypes.ErrChannelCapabilityNotFound, "module does not own channel capability")
	}

	packetBytes, err := packetData.GetBytes()
	if err != nil {
		return 0, sdkerrors.Wrapf(sdkerrors.ErrJSONMarshal, "cannot marshal the packet: %w", err)
	}

	return k.ChannelKeeper.SendPacket(ctx, channelCap, sourcePort, sourceChannel, timeoutHeight, timeoutTimestamp, packetBytes)
}

// OnRecvGetAggrKeysharePacket processes packet reception
func (k Keeper) OnRecvGetAggrKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data types.GetAggrKeysharePacketData) (packetAck types.GetAggrKeysharePacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	fmt.Println("\n\n\n\nReceived Request for: ", data.Identity, "\n\n\n\n")

	keyshareReq, found := k.GetKeyShareRequest(ctx, data.Identity)
	if !found {
		return packetAck, types.ErrRequestNotFound
	}

	fmt.Println("\n\n\n\naggr keyshare in req: ", keyshareReq.AggrKeyshare)
	fmt.Println("identity in req: ", keyshareReq.Identity)
	fmt.Println("proposal ID : ", keyshareReq.ProposalId, "\n\n\n\n")

	if keyshareReq.AggrKeyshare == "" {
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.StartSendGeneralKeyShareEventType,
				sdk.NewAttribute(types.StartSendGeneralKeyShareEventIdentity, data.Identity),
			),
		)
		fmt.Println("\n\n\n\nEmitted event\n\n\n\n")

		//===========================================//
		// FOR TESTING ONLY, HARDCODE AGGR. KEYSHARE //
		//===========================================//

		keyshareReq.AggrKeyshare = "29c861be5016b20f5a4397795e3f086d818b11ad02e0dd8ee28e485988b6cb07"
		k.SetKeyShareRequest(ctx, keyshareReq)

		timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()

		_, err = k.TransmitAggrKeyshareDataPacket(
			ctx,
			types.AggrKeyshareDataPacketData{
				Identity:     keyshareReq.Identity,
				Pubkey:       keyshareReq.Pubkey,
				AggrKeyshare: keyshareReq.AggrKeyshare,
				AggrHeight:   strconv.FormatInt(ctx.BlockHeight(), 10),
				ProposalId:   keyshareReq.ProposalId,
			},
			keyshareReq.IbcInfo.PortID,
			keyshareReq.IbcInfo.ChannelID,
			clienttypes.ZeroHeight(),
			uint64(timeoutTimestamp),
		)
		if err != nil {
			fmt.Println("\n\n\n\nTransmission error: ", err, "\n\n\n\n")
			return packetAck, err
		}
	}

	return packetAck, nil
}

// OnAcknowledgementGetAggrKeysharePacket responds to the the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementGetAggrKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data types.GetAggrKeysharePacketData, ack channeltypes.Acknowledgement) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:

		// TODO: failed acknowledgement logic
		_ = dispatchedAck.Error

		return nil
	case *channeltypes.Acknowledgement_Result:
		// Decode the packet acknowledgment
		var packetAck types.GetAggrKeysharePacketAck

		if err := types.ModuleCdc.UnmarshalJSON(dispatchedAck.Result, &packetAck); err != nil {
			// The counter-party module doesn't implement the correct acknowledgment format
			return errors.New("cannot unmarshal acknowledgment")
		}

		// TODO: successful acknowledgement logic

		return nil
	default:
		// The counter-party module doesn't implement the correct acknowledgment format
		return errors.New("invalid acknowledgment format")
	}
}

// OnTimeoutGetAggrKeysharePacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutGetAggrKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data types.GetAggrKeysharePacketData) error {

	// TODO: packet timeout logic

	return nil
}
