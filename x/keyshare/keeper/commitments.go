package keeper

import (
	"github.com/Fairblock/fairyring/x/keyshare/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetActiveCommitments set a specific public key to active in the store
func (k Keeper) SetActiveCommitments(ctx sdk.Context, commits types.Commitments) {
	store := ctx.KVStore(k.storeKey)
	b := k.cdc.MustMarshal(&commits)
	store.Set(types.KeyPrefix(types.ActiveCommitmentsPrefix), b)
}

// SetQueuedCommitments set a specific public key in the store
func (k Keeper) SetQueuedCommitments(ctx sdk.Context, commits types.Commitments) {
	store := ctx.KVStore(k.storeKey)
	b := k.cdc.MustMarshal(&commits)
	store.Set(types.KeyPrefix(types.QueuedCommitmentsPrefix), b)
}

// GetActiveCommitments returns the Active public key
func (k Keeper) GetActiveCommitments(
	ctx sdk.Context,
) (val types.Commitments, found bool) {
	store := ctx.KVStore(k.storeKey)

	b := store.Get(types.KeyPrefix(types.ActiveCommitmentsPrefix))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)

	return val, true
}

// GetQueuedCommitments returns the Queued public key
func (k Keeper) GetQueuedCommitments(
	ctx sdk.Context,
) (val types.Commitments, found bool) {
	store := ctx.KVStore(k.storeKey)

	b := store.Get(types.KeyPrefix(types.QueuedCommitmentsPrefix))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)

	return val, true
}

// DeleteActiveCommitments deletes the active public key in the store
func (k Keeper) DeleteActiveCommitments(ctx sdk.Context) {
	store := ctx.KVStore(k.storeKey)
	store.Delete(types.KeyPrefix(types.ActiveCommitmentsPrefix))
}

// DeleteQueuedCommitments deletes the queued public key in the store
func (k Keeper) DeleteQueuedCommitments(ctx sdk.Context) {
	store := ctx.KVStore(k.storeKey)
	store.Delete(types.KeyPrefix(types.QueuedCommitmentsPrefix))
}
