package keeper

import (
	"fairyring/x/fairyring/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetLatestPubKey set a specific public key in the store
func (k Keeper) SetLatestPubKey(ctx sdk.Context, latestPubKey types.LatestPubKey) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.LatestPubKeyPrefix))
	b := k.cdc.MustMarshal(&latestPubKey)
	store.Set(types.KeyPrefix(types.LatestPubKeyPrefix), b)
}

// GetLatestPubKey returns the latest public key
func (k Keeper) GetLatestPubKey(
	ctx sdk.Context,
) (val types.LatestPubKey, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.LatestPubKeyPrefix))

	b := store.Get(types.KeyPrefix(types.LatestPubKeyPrefix))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}
