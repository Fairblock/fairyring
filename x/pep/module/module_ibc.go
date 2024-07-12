package pep

import (
	"fmt"

	kstypes "github.com/Fairblock/fairyring/x/keyshare/types"
	v1 "github.com/cosmos/cosmos-sdk/x/gov/types/v1"

	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"

	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	capabilitytypes "github.com/cosmos/ibc-go/modules/capability/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
	porttypes "github.com/cosmos/ibc-go/v8/modules/core/05-port/types"
	host "github.com/cosmos/ibc-go/v8/modules/core/24-host"
	ibcexported "github.com/cosmos/ibc-go/v8/modules/core/exported"
)

// IBCModule implements the ICS26 interface for interchain accounts host chains
type IBCModule struct {
	keeper keeper.Keeper
}

// NewIBCModule creates a new IBCModule given the associated keeper
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

	fmt.Println("\n\n\n\n OnChanOpenInit pep\n\n\n\n")

	// Require portID is the portID module is bound to
	boundPort := im.keeper.GetPort(ctx)
	if boundPort != portID {
		return "", errorsmod.Wrapf(porttypes.ErrInvalidPort, "invalid port: %s, expected %s", portID, boundPort)
	}

	if version != types.KeyshareVersion {
		return "", errorsmod.Wrapf(types.ErrInvalidVersion, "got %s, expected %s", version, types.KeyshareVersion)
	}

	// Claim channel capability passed back by IBC module
	if err := im.keeper.ClaimCapability(ctx, chanCap, host.ChannelCapabilityPath(portID, channelID)); err != nil {
		return "", err
	}

	fmt.Println("\n\n\n\n OnChanOpenInit pep\n\n\n\n", version)

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

	fmt.Println("\n\n\n\n OnChanOpenTry pep\n\n\n\n")
	// Require portID is the portID module is bound to
	boundPort := im.keeper.GetPort(ctx)
	if boundPort != portID {
		return "", errorsmod.Wrapf(porttypes.ErrInvalidPort, "invalid port: %s, expected %s", portID, boundPort)
	}

	if counterpartyVersion != types.KeyshareVersion {
		return "", errorsmod.Wrapf(types.ErrInvalidVersion, "invalid counterparty version: got: %s, expected %s", counterpartyVersion, types.KeyshareVersion)
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
	fmt.Println("\n\n\n\n OnChanOpenTry pep \n\n\n\n")

	return types.KeyshareVersion, nil
}

// OnChanOpenAck implements the IBCModule interface
func (im IBCModule) OnChanOpenAck(
	ctx sdk.Context,
	portID,
	channelID string,
	_,
	counterpartyVersion string,
) error {
	fmt.Println("\n\n\n\n OnChanOpenAck pep\n\n\n\n")

	if counterpartyVersion != types.KeyshareVersion {
		return errorsmod.Wrapf(types.ErrInvalidVersion, "invalid counterparty version: %s, expected %s", counterpartyVersion, types.KeyshareVersion)
	}
	fmt.Println("\n\n\n\n OnChanOpenAck pep\n\n\n\n")

	return nil
}

// OnChanOpenConfirm implements the IBCModule interface
func (im IBCModule) OnChanOpenConfirm(
	ctx sdk.Context,
	portID,
	channelID string,
) error {
	fmt.Println("\n\n\n\n OnChanOpenConfirm pep\n\n\n\n")

	return nil
}

// OnChanCloseInit implements the IBCModule interface
func (im IBCModule) OnChanCloseInit(
	ctx sdk.Context,
	portID,
	channelID string,
) error {
	// Disallow user-initiated channel closing for channels
	return errorsmod.Wrap(sdkerrors.ErrInvalidRequest, "user cannot close channel")
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
	var ack channeltypes.Acknowledgement
	var ksModulePacketData kstypes.KeysharePacketData

	if err := types.ModuleCdc.UnmarshalJSON(modulePacket.GetData(), &ksModulePacketData); err == nil {
		// Dispatch packet
		switch packet := ksModulePacketData.Packet.(type) {

		case *kstypes.KeysharePacketData_AggrKeyshareDataPacket:
			packetAck, err := im.keeper.OnRecvAggrKeyshareDataPacket(ctx, modulePacket, *packet.AggrKeyshareDataPacket)
			if err != nil {
				ack = channeltypes.NewErrorAcknowledgement(err)
			} else {
				// Encode packet acknowledgment
				packetAckBytes := v1.MustProtoMarshalJSON(&packetAck)
				ack = channeltypes.NewResultAcknowledgement(sdk.MustSortJSON(packetAckBytes))
			}
			ctx.EventManager().EmitEvent(
				sdk.NewEvent(
					kstypes.EventTypeAggrKeyshareDataPacket,
					sdk.NewAttribute(sdk.AttributeKeyModule, types.ModuleName),
					sdk.NewAttribute(kstypes.AttributeKeyAckSuccess, fmt.Sprintf("%t", err != nil)),
				),
			)
			return ack
		// this line is used by starport scaffolding # ibc/packet/module/recv
		default:
			err := fmt.Errorf("unrecognized %s packet type: %T", types.ModuleName, packet)
			return channeltypes.NewErrorAcknowledgement(err)
		}
	} else {
		return channeltypes.NewErrorAcknowledgement(errorsmod.Wrapf(sdkerrors.ErrUnknownRequest, "cannot unmarshal packet data: %s", err.Error()))
	}
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
		return errorsmod.Wrapf(sdkerrors.ErrUnknownRequest, "cannot unmarshal packet acknowledgement: %v", err)
	}

	// this line is used by starport scaffolding # oracle/packet/module/ack

	var ksModulePacketData kstypes.KeysharePacketData

	if err := types.ModuleCdc.UnmarshalJSON(modulePacket.GetData(), &ksModulePacketData); err == nil {
		var eventType string

		// Dispatch packet
		switch packet := ksModulePacketData.Packet.(type) {

		case *kstypes.KeysharePacketData_CurrentKeysPacket:
			err := im.keeper.OnAcknowledgementCurrentKeysPacket(ctx, modulePacket, *packet.CurrentKeysPacket, ack)
			if err != nil {
				return err
			}
			eventType = types.EventTypeCurrentKeysPacket
			// this line is used by starport scaffolding # ibc/packet/module/ack

			ctx.EventManager().EmitEvent(
				sdk.NewEvent(
					eventType,
					sdk.NewAttribute(sdk.AttributeKeyModule, types.ModuleName),
					sdk.NewAttribute(types.AttributeKeyAck, fmt.Sprintf("%v", ack)),
				),
			)

		case *kstypes.KeysharePacketData_RequestAggrKeysharePacket:
			err := im.keeper.OnAcknowledgementRequestAggrKeysharePacket(ctx, modulePacket, *packet.RequestAggrKeysharePacket, ack)
			if err != nil {
				return err
			}
			eventType = kstypes.EventTypeRequestAggrKeysharePacket
		case *kstypes.KeysharePacketData_GetAggrKeysharePacket:
			err := im.keeper.OnAcknowledgementGetAggrKeysharePacket(ctx, modulePacket, *packet.GetAggrKeysharePacket, ack)
			if err != nil {
				return err
			}
			eventType = kstypes.EventTypeGetAggrKeysharePacket

		// this line is used by starport scaffolding # ibc/packet/module/ack
		default:
			errMsg := fmt.Sprintf("unrecognized %s packet type: %T", types.ModuleName, packet)
			return errorsmod.Wrap(sdkerrors.ErrUnknownRequest, errMsg)
		}

		ctx.EventManager().EmitEvent(
			sdk.NewEvent(
				eventType,
				sdk.NewAttribute(sdk.AttributeKeyModule, types.ModuleName),
				sdk.NewAttribute(kstypes.AttributeKeyAck, fmt.Sprintf("%v", ack)),
			),
		)

		switch resp := ack.Response.(type) {
		case *channeltypes.Acknowledgement_Result:
			ctx.EventManager().EmitEvent(
				sdk.NewEvent(
					eventType,
					sdk.NewAttribute(kstypes.AttributeKeyAckSuccess, string(resp.Result)),
				),
			)
		case *channeltypes.Acknowledgement_Error:
			ctx.EventManager().EmitEvent(
				sdk.NewEvent(
					eventType,
					sdk.NewAttribute(kstypes.AttributeKeyAckError, resp.Error),
				),
			)
		}
	} else {
		return errorsmod.Wrapf(sdkerrors.ErrUnknownRequest, "cannot unmarshal packet data: %s", err.Error())
	}
	return nil
}

// OnTimeoutPacket implements the IBCModule interface
func (im IBCModule) OnTimeoutPacket(
	ctx sdk.Context,
	modulePacket channeltypes.Packet,
	relayer sdk.AccAddress,
) error {
	var modulePacketData kstypes.KeysharePacketData
	if err := modulePacketData.Unmarshal(modulePacket.GetData()); err != nil {
		return errorsmod.Wrapf(sdkerrors.ErrUnknownRequest, "cannot unmarshal packet data: %s", err.Error())
	}

	// Dispatch packet
	switch packet := modulePacketData.Packet.(type) {
	case *kstypes.KeysharePacketData_CurrentKeysPacket:
		err := im.keeper.OnTimeoutCurrentKeysPacket(ctx, modulePacket, *packet.CurrentKeysPacket)
		if err != nil {
			return err
		}
		// this line is used by starport scaffolding # ibc/packet/module/timeout
	default:
		errMsg := fmt.Sprintf("unrecognized %s packet type: %T", types.ModuleName, packet)
		return errorsmod.Wrap(sdkerrors.ErrUnknownRequest, errMsg)
	}

	return nil
}
