package keeper

import (
	"context"
	"cosmossdk.io/store/prefix"
	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/auction/types"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/cosmos/cosmos-sdk/runtime"
)

func (k Keeper) SetRegisteredBidder(ctx context.Context, bidder commontypes.Bidder) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.BidderKeyPrefix))
	b := k.cdc.MustMarshal(&bidder)
	store.Set(types.RegisteredBidderKey(
		bidder.Address,
	), b)
}

func (k Keeper) GetRegisteredBidder(
	ctx context.Context,
	target string,
) (val commontypes.Bidder, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.BidderKeyPrefix))

	b := store.Get(types.RegisteredBidderKey(
		target,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

func (k Keeper) DeactivateBidder(
	ctx context.Context,
	target string,
) (val commontypes.Bidder, updated bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.BidderKeyPrefix))

	b := store.Get(types.RegisteredBidderKey(
		target,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)

	val.Active = false
	k.SetRegisteredBidder(ctx, val)
	return val, true
}

func (k Keeper) RemoveRegisteredBidder(
	ctx context.Context,
	target string,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.BidderKeyPrefix))
	store.Delete(types.RegisteredBidderKey(
		target,
	))
}

func (k Keeper) GetAllRegisteredBidders(ctx context.Context) (list []commontypes.Bidder) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.BidderKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val commontypes.Bidder
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
