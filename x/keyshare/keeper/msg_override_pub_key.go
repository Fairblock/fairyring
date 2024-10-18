package keeper

import (
	"context"
	"encoding/json"
	"strconv"

	commontypes "github.com/Fairblock/fairyring/x/common/types"

	"github.com/Fairblock/fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// OverrideLatestPubkey updates the public key
func (k msgServer) OverrideLatestPubkey(
	goCtx context.Context,
	msg *types.MsgOverrideLatestPubkey,
) (*types.MsgOverrideLatestPubkeyResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	params := k.GetParams(ctx)

	trustedAddresses := params.TrustedAddresses
	if !contains(trustedAddresses, msg.Creator) {
		return nil, types.ErrAddressNotTrusted.Wrap(msg.Creator)
	}

	commitments := types.Commitments{
		Commitments: msg.Commitments,
	}

	expHeight := params.KeyExpiry + uint64(ctx.BlockHeight())

	if _, found := k.GetActivePubkey(ctx); found {
		k.DeleteActivePubkey(ctx)
	}

	if _, found := k.GetQueuedPubkey(ctx); found {
		k.DeleteQueuedPubkey(ctx)
	}

	encryptedKeyShares, err := json.Marshal(msg.EncryptedKeyshares)
	if err != nil {
		return nil, err
	}

	allValidatorSet := k.GetAllValidatorSet(ctx)
	encSharesExistsValidators := make(map[string]bool, 0)

	for _, encShare := range msg.EncryptedKeyshares {
		encSharesExistsValidators[encShare.Validator] = true
	}

	for _, v := range allValidatorSet {
		if _, exists := encSharesExistsValidators[v.Validator]; !exists {
			k.RemoveValidatorSet(ctx, v.Validator)
		}
	}

	k.SetActiveCommitments(
		ctx,
		commitments,
	)

	k.SetActivePubkey(
		ctx,
		types.ActivePubkey{
			Creator:            msg.Creator,
			PublicKey:          msg.PublicKey,
			Expiry:             expHeight,
			NumberOfValidators: msg.NumberOfValidators,
			EncryptedKeyshares: msg.EncryptedKeyshares,
		},
	)

	k.pepKeeper.SetActivePubkey(
		ctx,
		commontypes.ActivePublicKey{
			Creator:   msg.Creator,
			PublicKey: msg.PublicKey,
			Expiry:    expHeight,
		},
	)

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.PubkeyOverrodeEventType,
			sdk.NewAttribute(types.PubkeyOverrodeEventActivePubkeyExpiryHeight, strconv.FormatUint(expHeight, 10)),
			sdk.NewAttribute(types.PubkeyOverrodeEventExpiryHeight, strconv.FormatUint(expHeight, 10)),
			sdk.NewAttribute(types.PubkeyOverrodeEventCreator, msg.Creator),
			sdk.NewAttribute(types.PubkeyOverrodeEventPubkey, msg.PublicKey),
			sdk.NewAttribute(types.PubkeyOverrodeEventNumberOfValidators, strconv.FormatUint(msg.NumberOfValidators, 10)),
			sdk.NewAttribute(types.PubkeyOverrodeEventEncryptedShares, string(encryptedKeyShares)),
		),
	)

	return &types.MsgOverrideLatestPubkeyResponse{}, nil
}
