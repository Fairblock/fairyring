package pricefeed

import (
	"fmt"
	"strings"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	capabilitytypes "github.com/cosmos/cosmos-sdk/x/capability/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
	porttypes "github.com/cosmos/ibc-go/v7/modules/core/05-port/types"
	host "github.com/cosmos/ibc-go/v7/modules/core/24-host"
	ibcexported "github.com/cosmos/ibc-go/v7/modules/core/exported"

	bandtypes "fairyring/types/band"
	"fairyring/x/pricefeed/keeper"
	"fairyring/x/pricefeed/types"
)

type IBCModule struct {
	keeper keeper.Keeper
}

func NewIBCModule(k keeper.Keeper) IBCModule {
	return IBCModule{
		keeper: k,
	}
}

// ValidatePricefeedChannelParams does validation of a newly created priefeed channel. A pricefeed
// channel must be UNORDERED, use the correct port (by default 'pricefeed'),
func ValidatePricefeedChannelParams(
	ctx sdk.Context,
	keeper keeper.Keeper,
	order channeltypes.Order,
	portID string,
	channelID string,
) error {
	_, err := channeltypes.ParseChannelSequence(channelID)
	if err != nil {
		return err
	}

	if order != channeltypes.UNORDERED {
		return sdkerrors.Wrapf(
			channeltypes.ErrInvalidChannelOrdering,
			"expected %s channel, got %s ",
			channeltypes.UNORDERED,
			order,
		)
	}

	// Require portID is the portID pricefeed module is bound to
	boundPort := keeper.GetPort(ctx)
	if boundPort != portID {
		return sdkerrors.Wrapf(porttypes.ErrInvalidPort, "invalid port: %s, expected %s", portID, boundPort)
	}

	return nil
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
	if err := ValidatePricefeedChannelParams(ctx, im.keeper, order, portID, channelID); err != nil {
		return "", err
	}

	if strings.TrimSpace(version) == "" {
		version = types.Version
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
	if err := ValidatePricefeedChannelParams(ctx, im.keeper, order, portID, channelID); err != nil {
		return "", err
	}

	if counterpartyVersion != types.Version {
		return "", sdkerrors.Wrapf(
			types.ErrInvalidVersion,
			"invalid counterparty version: got: %s, expected %s",
			counterpartyVersion,
			types.Version,
		)
	}

	// OpenTry must claim the channelCapability that IBC passes into the callback
	if err := im.keeper.ClaimCapability(ctx, chanCap, host.ChannelCapabilityPath(portID, channelID)); err != nil {
		return "", err
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
	if counterpartyVersion != types.Version {
		return sdkerrors.Wrapf(
			types.ErrInvalidVersion,
			"invalid counterparty version: %s, expected %s",
			counterpartyVersion,
			types.Version,
		)
	}
	return nil
}

// OnChanOpenConfirm implements the IBCModule interface
func (im IBCModule) OnChanOpenConfirm(
	ctx sdk.Context,
	portID,
	channelID string,
) error {
	return nil
}

// OnChanCloseInit implements the IBCModule interface
func (im IBCModule) OnChanCloseInit(
	ctx sdk.Context,
	portID,
	channelID string,
) error {
	// Disallow user-initiated channel closing for channels
	return sdkerrors.Wrap(sdkerrors.ErrInvalidRequest, "user cannot close channel")
}

// OnChanCloseConfirm implements the IBCModule interface
func (im IBCModule) OnChanCloseConfirm(
	ctx sdk.Context,
	portID,
	channelID string,
) error {
	return nil
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
		return sdkerrors.Wrapf(sdkerrors.ErrUnknownRequest, "cannot unmarshal packet acknowledgement: %v", err)
	}

	// Check the type of response in the acknowledgement packet.
	switch resp := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Result:
		// If the response is of type Result, unmarshal the result into a
		// bandtypes.OracleRequestPacketAcknowledgement object.
		var oracleAck bandtypes.OracleRequestPacketAcknowledgement
		if err := types.ModuleCdc.UnmarshalJSON(resp.Result, &oracleAck); err != nil {
			return sdkerrors.Wrapf(sdkerrors.ErrUnknownRequest, "cannot unmarshal packet data: %s", err.Error())
		}

		// Emit a new event with the EventTypeRequestPacket and AckSuccess with request id.
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(
				types.EventTypeRequestPacket,
				sdk.NewAttribute(types.AttributeKeyAckSuccess, fmt.Sprintf("%d", oracleAck.RequestID)),
			),
		)
	case *channeltypes.Acknowledgement_Error:
		// Emit a new event with the AttributeKeyAckError and AckError with error message.
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(
				types.AttributeKeyAckError,
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
	// Do nothing for out-going packet
	return nil
}

// OnRecvPacket implements the IBCModule interface
func (im IBCModule) OnRecvPacket(
	ctx sdk.Context,
	modulePacket channeltypes.Packet,
	relayer sdk.AccAddress,
) ibcexported.Acknowledgement {
	var packet bandtypes.OracleResponsePacketData

	// Unmarshal the data from the module packet into the OracleResponsePacketData object.
	if err := types.ModuleCdc.UnmarshalJSON(modulePacket.GetData(), &packet); err != nil {
		return channeltypes.NewErrorAcknowledgement(err)
	}

	// Request has been resolved and relayed to pricefeed module
	ctx.EventManager().EmitEvent(sdk.NewEvent(
		types.EventTypeResponsePacket,
		sdk.NewAttribute(types.AttributeKeyRequestID, fmt.Sprintf("%d", packet.RequestID)),
	))

	if packet.ResolveStatus != bandtypes.RESOLVE_STATUS_SUCCESS {
		return channeltypes.NewErrorAcknowledgement(types.ErrResolveStatusNotSuccess)
	}

	if err := im.keeper.StoreOracleResponsePacket(ctx, packet); err != nil {
		return channeltypes.NewErrorAcknowledgement(err)
	}

	return channeltypes.NewResultAcknowledgement(nil)
}
