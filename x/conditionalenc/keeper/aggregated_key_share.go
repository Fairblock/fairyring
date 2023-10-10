package keeper

import (
	"fairyring/x/conditionalenc/types"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetAggregatedConditionalKeyShare set a specific aggregatedConditionalKeyShare in the store from its index
func (k Keeper) SetAggregatedConditionalKeyShare(ctx sdk.Context, aggregatedConditionalKeyShare types.AggregatedConditionalKeyShare) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.AggregatedConditionalKeyShareKeyPrefix))
	b := k.cdc.MustMarshal(&aggregatedConditionalKeyShare)
	store.Set(types.AggregatedConditionalKeyShareKey(
		aggregatedConditionalKeyShare.Condition,
	), b)
}

// GetAggregatedConditionalKeyShare returns a aggregatedConditionalKeyShare from its index
func (k Keeper) GetAggregatedConditionalKeyShare(
	ctx sdk.Context,
	condition string,

) (val types.AggregatedConditionalKeyShare, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.AggregatedConditionalKeyShareKeyPrefix))

	b := store.Get(types.AggregatedConditionalKeyShareKey(
		condition,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveAggregatedConditionalKeyShare removes a aggregatedConditionalKeyShare from the store
func (k Keeper) RemoveAggregatedConditionalKeyShare(
	ctx sdk.Context,
	condition string,

) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.AggregatedConditionalKeyShareKeyPrefix))
	store.Delete(types.AggregatedConditionalKeyShareKey(
		condition,
	))
}

// GetAllAggregatedConditionalKeyShare returns all aggregatedConditionalKeyShare
func (k Keeper) GetAllAggregatedConditionalKeyShare(ctx sdk.Context) (list []types.AggregatedConditionalKeyShare) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.AggregatedConditionalKeyShareKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.AggregatedConditionalKeyShare
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
