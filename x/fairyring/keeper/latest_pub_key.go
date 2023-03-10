package keeper

import (
	"fairyring/x/fairyring/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetLatestPubKey set a specific public key in the store
func (k Keeper) SetLatestPubKey(ctx sdk.Context, latestPubKey types.LatestPubKey) {
	store := ctx.KVStore(k.storeKey)
	b := k.cdc.MustMarshal(&latestPubKey)
	store.Set(types.KeyPrefix(types.LatestPubKeyPrefix), b)
}

// GetLatestPubKey returns the latest public key
func (k Keeper) GetLatestPubKey(
	ctx sdk.Context,
) (val types.LatestPubKey, found bool) {
	store := ctx.KVStore(k.storeKey)

	b := store.Get(types.KeyPrefix(types.LatestPubKeyPrefix))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)

	return val, true
}
