package keeper

import (
	storetypes "cosmossdk.io/store/types"
	"errors"
	"github.com/cosmos/cosmos-sdk/runtime"

	kstypes "github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/Fairblock/fairyring/x/pep/types"

	"cosmossdk.io/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
)

// SetAggregatedKeyShare set a specific aggregatedKeyShare in the store from its index
func (k Keeper) SetAggregatedKeyShare(ctx sdk.Context, aggregatedKeyShare types.AggregatedKeyShare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AggregatedKeyShareKeyPrefix))
	b := k.cdc.MustMarshal(&aggregatedKeyShare)
	store.Set(types.AggregatedKeyShareKey(
		aggregatedKeyShare.Height,
	), b)
}

// GetAggregatedKeyShare returns a aggregatedKeyShare from its index
func (k Keeper) GetAggregatedKeyShare(
	ctx sdk.Context,
	height uint64,

) (val types.AggregatedKeyShare, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AggregatedKeyShareKeyPrefix))

	b := store.Get(types.AggregatedKeyShareKey(
		height,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveAggregatedKeyShare removes a aggregatedKeyShare from the store
func (k Keeper) RemoveAggregatedKeyShare(
	ctx sdk.Context,
	height uint64,

) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AggregatedKeyShareKeyPrefix))
	store.Delete(types.AggregatedKeyShareKey(
		height,
	))
}

// GetAllAggregatedKeyShare returns all aggregatedKeyShare
func (k Keeper) GetAllAggregatedKeyShare(ctx sdk.Context) (list []types.AggregatedKeyShare) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AggregatedKeyShareKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.AggregatedKeyShare
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}

// OnRecvAggrKeyshareDataPacket processes packet reception
func (k Keeper) OnRecvAggrKeyshareDataPacket(ctx sdk.Context, packet channeltypes.Packet, data kstypes.AggrKeyshareDataPacketData) (packetAck kstypes.AggrKeyshareDataPacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	entry, found := k.GetEntry(ctx, data.RequestId)
	if !found {
		return packetAck, errors.New("request not found for this id")
	}

	entry.AggrKeyshare = data.AggrKeyshare

	k.SetExecutionQueueEntry(ctx, entry)
	k.RemoveEntry(ctx, data.RequestId)

	return packetAck, nil
}
