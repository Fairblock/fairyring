package keeper

import (
	"context"
	"strconv"

	"fairyring/x/keyshare/types"
	peptypes "fairyring/x/pep/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// CreateLatestPubKey updates the public key
func (k msgServer) CreateLatestPubKey(goCtx context.Context, msg *types.MsgCreateLatestPubKey) (*types.MsgCreateLatestPubKeyResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	params := k.GetParams(ctx)

	trustedAddresses := params.TrustedAddresses
	if !contains(trustedAddresses, msg.Creator) {
		return nil, types.ErrAddressNotTrusted.Wrap(msg.Creator)
	}

	_, found := k.GetQueuedPubKey(ctx)
	if found {
		return nil, types.ErrQueuedKeyAlreadyExists.Wrap(msg.Creator)
	}

	expHeight := params.KeyExpiry + uint64(ctx.BlockHeight())
	ak, found := k.GetActivePubKey(ctx)
	if found {
		expHeight = ak.Expiry + params.KeyExpiry
	}
	var queuedPubKey = peptypes.QueuedPubKey{
		Creator:   msg.Creator,
		PublicKey: msg.PublicKey,
		Expiry:    expHeight,
	}

	k.SetQueuedPubKey(
		ctx,
		queuedPubKey,
	)

	k.pepKeeper.SetQueuedPubKey(
		ctx,
		queuedPubKey,
	)

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.QueuedPubKeyCreatedEventType,
			sdk.NewAttribute(types.QueuedPubKeyCreatedEventActivePubkeyExpiryHeight, strconv.FormatUint(ak.Expiry, 10)),
			sdk.NewAttribute(types.QueuedPubKeyCreatedEventExpiryHeight, strconv.FormatUint(expHeight, 10)),
			sdk.NewAttribute(types.QueuedPubKeyCreatedEventCreator, msg.Creator),
			sdk.NewAttribute(types.QueuedPubKeyCreatedEventPubkey, msg.PublicKey),
		),
	)

	return &types.MsgCreateLatestPubKeyResponse{}, nil
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
