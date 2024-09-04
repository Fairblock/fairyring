package keeper

import (
	"context"
	"errors"
	"time"

	sdkerrors "cosmossdk.io/errors"
	"cosmossdk.io/math"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	kstypes "github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	clienttypes "github.com/cosmos/ibc-go/v8/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v8/modules/core/24-host"
)

func (k msgServer) GetPrivateKeyshares(goCtx context.Context, msg *types.MsgGetPrivateKeyshares) (*types.MsgGetPrivateKeysharesResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	entry, found := k.GetPrivateRequest(ctx, msg.ReqId)
	if !found {
		pubkey, found := k.GetActivePubKey(ctx)
		if !found {
			return &types.MsgGetPrivateKeysharesResponse{}, errors.New("entry and pubkey not found")
		}

		entry.Creator = ""
		entry.Amount = sdk.NewCoin("ufairy", math.NewInt(0))
		entry.EncryptedKeyshares = make(map[string]*commontypes.KeyshareList)
		entry.Pubkey = pubkey.PublicKey
		entry.ReqId = msg.ReqId

		k.SetPrivateRequest(ctx, entry)
	} else {
		if !entry.Amount.IsNil() || !entry.Amount.IsZero() {
			requester := sdk.MustAccAddressFromBech32(msg.Creator)
			creator := sdk.MustAccAddressFromBech32(entry.Creator)
			err := k.bankKeeper.SendCoins(ctx, requester, creator, sdk.NewCoins(entry.Amount))
			if err != nil {
				return &types.MsgGetPrivateKeysharesResponse{}, errors.New("failed to send fees to creator")
			}
		}
	}

	params := k.GetParams(ctx)
	if params.IsSourceChain {
		var qentry = commontypes.GetPrivateKeyshare{
			RequestId:    msg.ReqId,
			Identity:     msg.ReqId,
			Requester:    msg.Creator,
			Rsa_64Pubkey: msg.Rsa_64Pubkey,
		}

		k.SetPrivateSignalQueueEntry(ctx, qentry)
		return &types.MsgGetPrivateKeysharesResponse{}, nil
	} else {
		packetData := kstypes.GetPrivateKeysharePacketData{
			Identity:     msg.ReqId,
			Requester:    msg.Creator,
			Rsa_64Pubkey: msg.Rsa_64Pubkey,
		}

		sPort := k.GetPort(ctx)
		timeoutTimestamp := ctx.BlockTime().Add(time.Second * 20).UnixNano()
		_, _ = k.TransmitGetPrivateKeysharePacket(
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
				sdk.NewAttribute(types.AttributeKeyRequestID, msg.ReqId),
			),
		)
	}

	return &types.MsgGetPrivateKeysharesResponse{}, nil
}

// TransmitGetPrivateKeysharePacket transmits the packet over IBC with the specified source port and source channel
func (k Keeper) TransmitGetPrivateKeysharePacket(
	ctx sdk.Context,
	packetData kstypes.GetPrivateKeysharePacketData,
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

// OnAcknowledgementGetPrivateKeysharePacket responds to the the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementGetPrivateKeysharePacket(ctx sdk.Context, packet channeltypes.Packet, data kstypes.GetPrivateKeysharePacketData, ack channeltypes.Acknowledgement) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:

		// TODO: failed acknowledgement logic
		_ = dispatchedAck.Error
		return nil
	case *channeltypes.Acknowledgement_Result:
		// Decode the packet acknowledgment
		var packetAck kstypes.GetPrivateKeysharePacketAck

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
