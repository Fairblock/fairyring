package keyshare

import (
	"fairyring/x/keyshare/keeper"
	"fairyring/x/keyshare/types"
	"fmt"

	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
	capabilitytypes "github.com/cosmos/cosmos-sdk/x/capability/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
	porttypes "github.com/cosmos/ibc-go/v7/modules/core/05-port/types"
	host "github.com/cosmos/ibc-go/v7/modules/core/24-host"
	ibcexported "github.com/cosmos/ibc-go/v7/modules/core/exported"
)

type IBCModule struct {
	keeper keeper.Keeper
}

func NewIBCModule(k keeper.Keeper) IBCModule {
	return IBCModule{
		keeper: k,
	}
}

// OnChanOpenInit implements the IBCModule interface
func (im IBCModule) OnChanOpenInit(
	ctx sdk.Context,
	order channeltypes.Order,
	connectionHops []string,
	portID string,
	channelID string,
	chanCap *capabilitytypes.Capability,
	counterparty channeltypes.Counterparty,
	version string,
) (string, error) {

	fmt.Println("\n\nOnChanOpenInit\n\n")

	// Require portID is the portID module is bound to
	boundPort := im.keeper.GetPort(ctx)
	if boundPort != portID {
		return "", sdkerrors.Wrapf(porttypes.ErrInvalidPort, "invalid port: %s, expected %s", portID, boundPort)
	}

	if version != types.Version {
		return "", sdkerrors.Wrapf(types.ErrInvalidVersion, "got %s, expected %s", version, types.Version)
	}

	// Claim channel capability passed back by IBC module
	if err := im.keeper.ClaimCapability(ctx, chanCap, host.ChannelCapabilityPath(portID, channelID)); err != nil {
		return "", err
	}

	return version, nil
}

// OnChanOpenTry implements the IBCModule interface
func (im IBCModule) OnChanOpenTry(
	ctx sdk.Context,
	order channeltypes.Order,
	connectionHops []string,
	portID,
	channelID string,
	chanCap *capabilitytypes.Capability,
	counterparty channeltypes.Counterparty,
	counterpartyVersion string,
) (string, error) {

	fmt.Println("\n\nOnChanOpenTry\n\n")

	// Require portID is the portID module is bound to
	boundPort := im.keeper.GetPort(ctx)
	if boundPort != portID {
		return "", sdkerrors.Wrapf(porttypes.ErrInvalidPort, "invalid port: %s, expected %s", portID, boundPort)
	}

	if counterpartyVersion != types.Version {
		return "", sdkerrors.Wrapf(types.ErrInvalidVersion, "invalid counterparty version: got: %s, expected %s", counterpartyVersion, types.Version)
	}

	// Module may have already claimed capability in OnChanOpenInit in the case of crossing hellos
	// (ie chainA and chainB both call ChanOpenInit before one of them calls ChanOpenTry)
	// If module can already authenticate the capability then module already owns it so we don't need to claim
	// Otherwise, module does not have channel capability and we must claim it from IBC
	if !im.keeper.AuthenticateCapability(ctx, chanCap, host.ChannelCapabilityPath(portID, channelID)) {
		// Only claim channel capability passed back by IBC module if we do not already own it
		if err := im.keeper.ClaimCapability(ctx, chanCap, host.ChannelCapabilityPath(portID, channelID)); err != nil {
			return "", err
		}
	}

	return types.Version, nil
}

// OnChanOpenAck implements the IBCModule interface
func (im IBCModule) OnChanOpenAck(
	ctx sdk.Context,
	portID,
	channelID string,
	_,
	counterpartyVersion string,
) error {
	fmt.Println("\n\nOnChanOpenAck\n\n")

	if counterpartyVersion != types.Version {
		return sdkerrors.Wrapf(types.ErrInvalidVersion, "invalid counterparty version: %s, expected %s", counterpartyVersion, types.Version)
	}
	return nil
}

// OnChanOpenConfirm implements the IBCModule interface
func (im IBCModule) OnChanOpenConfirm(
	ctx sdk.Context,
	portID,
	channelID string,
) error {
	fmt.Println("\n\nOnChanOpenConfirm\n\n")

	// im.keeper.SetChannel(ctx, channelID)
	return nil
}

// OnChanCloseInit implements the IBCModule interface
func (im IBCModule) OnChanCloseInit(
	ctx sdk.Context,
	portID,
	channelID string,
) error {
	// Disallow user-initiated channel closing for channels
	return sdkerrors.Wrap(cosmoserror.ErrInvalidRequest, "user cannot close channel")
}

// OnChanCloseConfirm implements the IBCModule interface
func (im IBCModule) OnChanCloseConfirm(
	ctx sdk.Context,
	portID,
	channelID string,
) error {
	return nil
}

// OnRecvPacket implements the IBCModule interface
func (im IBCModule) OnRecvPacket(
	ctx sdk.Context,
	modulePacket channeltypes.Packet,
	relayer sdk.AccAddress,
) ibcexported.Acknowledgement {
	fmt.Println("\n\nOnRecvPacket\n\n")

	var ack channeltypes.Acknowledgement

	var modulePacketData types.KeysharePacketData
	if err := types.ModuleCdc.UnmarshalJSON(modulePacket.GetData(), &modulePacketData); err != nil {
		fmt.Println("Unmarshalling failed: ", err)
		return channeltypes.NewErrorAcknowledgement(sdkerrors.Wrapf(cosmoserror.ErrUnknownRequest, "cannot unmarshal packet data: %s", err.Error()))
	}

	fmt.Println("\n\nCurrent Block Height: ", ctx.BlockHeight())
	lastProcessedSeq, found := im.keeper.GetLastSequence(ctx, modulePacket.SourceChannel, modulePacket.SourcePort)
	if !found {
		fmt.Println("\n\n\nlastProcessedSeq not found\n\n\n")
		lastProcessedSeq.PortId = modulePacket.SourcePort
		lastProcessedSeq.ChannelId = modulePacket.SourceChannel
	} else {
		fmt.Println("\n\n\nlastProcessedSeq found\n\n\n")
		fmt.Println("last seq: ", lastProcessedSeq.SeqNo, "   current seq: ", modulePacket.Sequence)
		if lastProcessedSeq.SeqNo >= modulePacket.Sequence {
			fmt.Println("\n\n\nPacket already prcessed. Skipping\n\n\n")
			return channeltypes.NewErrorAcknowledgement(sdkerrors.Wrapf(cosmoserror.ErrInvalidSequence, "already processed packet with seq: %d", modulePacket.Sequence))
		}
	}
	lastProcessedSeq.SeqNo = modulePacket.Sequence
	fmt.Println("\n\nSetting lastProcessedSeq: \nChannel: ", lastProcessedSeq.ChannelId, "   Port: ", lastProcessedSeq.PortId, "   SeqNo: ", lastProcessedSeq.SeqNo)
	im.keeper.SetLastSequence(ctx, lastProcessedSeq)

	// For Testing if set
	testSeq, found := im.keeper.GetLastSequence(ctx, modulePacket.SourceChannel, modulePacket.SourcePort)
	if !found {
		fmt.Println("\n\n\nlastProcessedSeq not found\n\n\n")
	} else {
		fmt.Println("\n\n\nlastProcessedSeq found\n\n\n")
		fmt.Println("last seq: ", testSeq.SeqNo)
	}

	// Dispatch packet
	switch packet := modulePacketData.Packet.(type) {

	case *types.KeysharePacketData_RequestAggrKeysharePacket:
		packetAck, err := im.keeper.OnRecvRequestAggrKeysharePacket(ctx, modulePacket, *packet.RequestAggrKeysharePacket)
		if err != nil {
			ack = channeltypes.NewErrorAcknowledgement(err)
		} else {
			// Encode packet acknowledgment
			packetAckBytes := types.MustProtoMarshalJSON(&packetAck)
			// packetAckBytes, err := types.ModuleCdc.MarshalJSON(&packetAck)
			// if err != nil {
			// 	return channeltypes.NewErrorAcknowledgement(sdkerrors.Wrap(cosmoserror.ErrJSONMarshal, err.Error()))
			// }
			ack = channeltypes.NewResultAcknowledgement(sdk.MustSortJSON(packetAckBytes))
		}
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(
				types.EventTypeRequestAggrKeysharePacket,
				sdk.NewAttribute(sdk.AttributeKeyModule, types.ModuleName),
				sdk.NewAttribute(types.AttributeKeyAckSuccess, fmt.Sprintf("%t", err != nil)),
				sdk.NewAttribute(types.AttributeKeyAckIdentity, packetAck.Identity),
				sdk.NewAttribute(types.AttributeKeyAckPubkey, packetAck.Pubkey),
			),
		)

	case *types.KeysharePacketData_GetAggrKeysharePacket:
		packetAck, err := im.keeper.OnRecvGetAggrKeysharePacket(ctx, modulePacket, *packet.GetAggrKeysharePacket)
		if err != nil {
			ack = channeltypes.NewErrorAcknowledgement(err)
		} else {
			// Encode packet acknowledgment
			packetAckBytes := types.MustProtoMarshalJSON(&packetAck)
			// packetAckBytes, err := types.ModuleCdc.MarshalJSON(&packetAck)
			// if err != nil {
			// 	return channeltypes.NewErrorAcknowledgement(sdkerrors.Wrap(cosmoserror.ErrJSONMarshal, err.Error()))
			// }
			ack = channeltypes.NewResultAcknowledgement(sdk.MustSortJSON(packetAckBytes))
		}
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(
				types.EventTypeGetAggrKeysharePacket,
				sdk.NewAttribute(sdk.AttributeKeyModule, types.ModuleName),
				sdk.NewAttribute(types.AttributeKeyAckSuccess, fmt.Sprintf("%t", err != nil)),
			),
		)

	// case *types.KeysharePacketData_AggrKeyshareDataPacket:
	// 	packetAck, err := im.keeper.OnRecvAggrKeyshareDataPacket(ctx, modulePacket, *packet.AggrKeyshareDataPacket)
	// 	if err != nil {
	// 		ack = channeltypes.NewErrorAcknowledgement(err)
	// 	} else {
	// 		// Encode packet acknowledgment
	// 		packetAckBytes, err := types.ModuleCdc.MarshalJSON(&packetAck)
	// 		if err != nil {
	// 			return channeltypes.NewErrorAcknowledgement(sdkerrors.Wrap(cosmoserror.ErrJSONMarshal, err.Error()))
	// 		}
	// 		ack = channeltypes.NewResultAcknowledgement(sdk.MustSortJSON(packetAckBytes))
	// 	}
	// 	ctx.EventManager().EmitEvent(
	// 		sdk.NewEvent(
	// 			types.EventTypeAggrKeyshareDataPacket,
	// 			sdk.NewAttribute(sdk.AttributeKeyModule, types.ModuleName),
	// 			sdk.NewAttribute(types.AttributeKeyAckSuccess, fmt.Sprintf("%t", err != nil)),
	// 		),
	// 	)
	// this line is used by starport scaffolding # ibc/packet/module/recv
	default:
		err := fmt.Errorf("unrecognized %s packet type: %T", types.ModuleName, packet)
		return channeltypes.NewErrorAcknowledgement(err)
	}

	// NOTE: acknowledgement will be written synchronously during IBC handler execution.
	return ack
}

// OnAcknowledgementPacket implements the IBCModule interface
func (im IBCModule) OnAcknowledgementPacket(
	ctx sdk.Context,
	modulePacket channeltypes.Packet,
	acknowledgement []byte,
	relayer sdk.AccAddress,
) error {
	var ack channeltypes.Acknowledgement
	if err := types.ModuleCdc.UnmarshalJSON(acknowledgement, &ack); err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrUnknownRequest, "cannot unmarshal packet acknowledgement: %v", err)
	}

	// this line is used by starport scaffolding # oracle/packet/module/ack

	var modulePacketData types.KeysharePacketData
	if err := types.ModuleCdc.UnmarshalJSON(modulePacket.GetData(), &modulePacketData); err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrUnknownRequest, "cannot unmarshal packet data: %s", err.Error())
	}

	var eventType string

	// Dispatch packet
	switch packet := modulePacketData.Packet.(type) {
	// case *types.KeysharePacketData_RequestAggrKeysharePacket:
	// 	err := im.keeper.OnAcknowledgementRequestAggrKeysharePacket(ctx, modulePacket, *packet.RequestAggrKeysharePacket, ack)
	// 	if err != nil {
	// 		return err
	// 	}
	// 	eventType = types.EventTypeRequestAggrKeysharePacket
	// case *types.KeysharePacketData_GetAggrKeysharePacket:
	// 	err := im.keeper.OnAcknowledgementGetAggrKeysharePacket(ctx, modulePacket, *packet.GetAggrKeysharePacket, ack)
	// 	if err != nil {
	// 		return err
	// 	}
	// 	eventType = types.EventTypeGetAggrKeysharePacket

	case *types.KeysharePacketData_AggrKeyshareDataPacket:
		err := im.keeper.OnAcknowledgementAggrKeyshareDataPacket(ctx, modulePacket, *packet.AggrKeyshareDataPacket, ack)
		if err != nil {
			return err
		}
		eventType = types.EventTypeAggrKeyshareDataPacket
		// this line is used by starport scaffolding # ibc/packet/module/ack
	default:
		errMsg := fmt.Sprintf("unrecognized %s packet type: %T", types.ModuleName, packet)
		return sdkerrors.Wrap(cosmoserror.ErrUnknownRequest, errMsg)
	}

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(
			eventType,
			sdk.NewAttribute(sdk.AttributeKeyModule, types.ModuleName),
			sdk.NewAttribute(types.AttributeKeyAck, fmt.Sprintf("%v", ack)),
		),
	)

	switch resp := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Result:
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(
				eventType,
				sdk.NewAttribute(types.AttributeKeyAckSuccess, string(resp.Result)),
			),
		)
	case *channeltypes.Acknowledgement_Error:
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(
				eventType,
				sdk.NewAttribute(types.AttributeKeyAckError, resp.Error),
			),
		)
	}

	return nil
}

// OnTimeoutPacket implements the IBCModule interface
func (im IBCModule) OnTimeoutPacket(
	ctx sdk.Context,
	modulePacket channeltypes.Packet,
	relayer sdk.AccAddress,
) error {
	var modulePacketData types.KeysharePacketData
	if err := modulePacketData.Unmarshal(modulePacket.GetData()); err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrUnknownRequest, "cannot unmarshal packet data: %s", err.Error())
	}

	// Dispatch packet
	switch packet := modulePacketData.Packet.(type) {

	case *types.KeysharePacketData_RequestAggrKeysharePacket:
		err := im.keeper.OnTimeoutRequestAggrKeysharePacket(ctx, modulePacket, *packet.RequestAggrKeysharePacket)
		if err != nil {
			return err
		}

	case *types.KeysharePacketData_GetAggrKeysharePacket:
		err := im.keeper.OnTimeoutGetAggrKeysharePacket(ctx, modulePacket, *packet.GetAggrKeysharePacket)
		if err != nil {
			return err
		}

	case *types.KeysharePacketData_AggrKeyshareDataPacket:
		err := im.keeper.OnTimeoutAggrKeyshareDataPacket(ctx, modulePacket, *packet.AggrKeyshareDataPacket)
		if err != nil {
			return err
		}
		// this line is used by starport scaffolding # ibc/packet/module/timeout
	default:
		errMsg := fmt.Sprintf("unrecognized %s packet type: %T", types.ModuleName, packet)
		return sdkerrors.Wrap(cosmoserror.ErrUnknownRequest, errMsg)
	}

	return nil
}
