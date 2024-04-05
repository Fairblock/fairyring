package keeper

import (
	"context"
	"encoding/json"
	peptypes "github.com/Fairblock/fairyring/x/pep/types"
	"strconv"

	"github.com/Fairblock/fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// OverrideLatestPubKey updates the public key
func (k msgServer) OverrideLatestPubKey(goCtx context.Context, msg *types.MsgOverrideLatestPubKey) (*types.MsgOverrideLatestPubKeyResponse, error) {
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

	if _, found := k.GetActivePubKey(ctx); found {
		k.DeleteActivePubKey(ctx)
	}

	if _, found := k.GetQueuedPubKey(ctx); found {
		k.DeleteQueuedPubKey(ctx)
	}

	encryptedKeyShares, err := json.Marshal(msg.EncryptedKeyShares)
	if err != nil {
		return nil, err
	}

	allValidatorSet := k.GetAllValidatorSet(ctx)
	encSharesExistsValidators := make(map[string]bool, 0)

	for _, encShare := range msg.EncryptedKeyShares {
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

	k.SetActivePubKey(
		ctx,
		types.ActivePubKey{
			Creator:            msg.Creator,
			PublicKey:          msg.PublicKey,
			Expiry:             expHeight,
			NumberOfValidators: msg.NumberOfValidators,
			EncryptedKeyShares: msg.EncryptedKeyShares,
		},
	)

	k.pepKeeper.SetActivePubKey(
		ctx,
		peptypes.ActivePubKey{
			Creator:   msg.Creator,
			PublicKey: msg.PublicKey,
			Expiry:    expHeight,
		},
	)

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.PubKeyOverrodeEventType,
			sdk.NewAttribute(types.PubKeyOverrodeEventActivePubkeyExpiryHeight, strconv.FormatUint(expHeight, 10)),
			sdk.NewAttribute(types.PubKeyOverrodeEventExpiryHeight, strconv.FormatUint(expHeight, 10)),
			sdk.NewAttribute(types.PubKeyOverrodeEventCreator, msg.Creator),
			sdk.NewAttribute(types.PubKeyOverrodeEventPubkey, msg.PublicKey),
			sdk.NewAttribute(types.PubKeyOverrodeEventNumberOfValidators, strconv.FormatUint(msg.NumberOfValidators, 10)),
			sdk.NewAttribute(types.PubKeyOverrodeEventEncryptedShares, string(encryptedKeyShares)),
		),
	)

	return &types.MsgOverrideLatestPubKeyResponse{}, nil
}
