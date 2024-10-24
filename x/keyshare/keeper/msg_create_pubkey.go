package keeper

import (
	"context"
	"encoding/json"
	"strconv"

	commontypes "github.com/Fairblock/fairyring/x/common/types"

	"github.com/Fairblock/fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// CreateLatestPubkey updates the public key
func (k msgServer) CreateLatestPubkey(
	goCtx context.Context,
	msg *types.MsgCreateLatestPubkey,
) (*types.MsgCreateLatestPubkeyResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	params := k.GetParams(ctx)

	trustedAddresses := params.TrustedAddresses
	if !contains(trustedAddresses, msg.Creator) {
		return nil, types.ErrAddressNotTrusted.Wrap(msg.Creator)
	}

	_, found := k.GetQueuedPubkey(ctx)
	if found {
		return nil, types.ErrQueuedKeyAlreadyExists.Wrap(msg.Creator)
	}

	commitments := types.Commitments{
		Commitments: msg.Commitments,
	}

	expHeight := params.KeyExpiry + uint64(ctx.BlockHeight())
	ak, found := k.GetActivePubkey(ctx)
	if found {
		expHeight = ak.Expiry + params.KeyExpiry
	}

	queuedPubkey := types.QueuedPubkey{
		Creator:            msg.Creator,
		PublicKey:          msg.PublicKey,
		Expiry:             expHeight,
		NumberOfValidators: msg.NumberOfValidators,
		EncryptedKeyshares: msg.EncryptedKeyshares,
	}

	encryptedKeyshares, err := json.Marshal(msg.EncryptedKeyshares)
	if err != nil {
		return nil, err
	}

	k.SetQueuedCommitments(
		ctx,
		commitments,
	)

	k.SetQueuedPubkey(
		ctx,
		queuedPubkey,
	)

	k.pepKeeper.SetQueuedPubkey(
		ctx,
		commontypes.QueuedPublicKey{
			Creator:   msg.Creator,
			PublicKey: msg.PublicKey,
			Expiry:    expHeight,
		},
	)

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.QueuedPubkeyCreatedEventType,
			sdk.NewAttribute(types.QueuedPubkeyCreatedEventActivePubkeyExpiryHeight, strconv.FormatUint(ak.Expiry, 10)),
			sdk.NewAttribute(types.QueuedPubkeyCreatedEventExpiryHeight, strconv.FormatUint(expHeight, 10)),
			sdk.NewAttribute(types.QueuedPubkeyCreatedEventCreator, msg.Creator),
			sdk.NewAttribute(types.QueuedPubkeyCreatedEventPubkey, msg.PublicKey),
			sdk.NewAttribute(types.QueuedPubkeyCreatedEventNumberOfValidators, strconv.FormatUint(msg.NumberOfValidators, 10)),
			sdk.NewAttribute(types.QueuedPubkeyCreatedEventEncryptedShares, string(encryptedKeyshares)),
		),
	)

	return &types.MsgCreateLatestPubkeyResponse{}, nil
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
