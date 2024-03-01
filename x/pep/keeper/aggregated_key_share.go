package keeper

import (
	"errors"

	kstypes "github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/Fairblock/fairyring/x/pep/types"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
)

// SetAggregatedKeyShare set a specific aggregatedKeyShare in the store from its index
func (k Keeper) SetAggregatedKeyShare(ctx sdk.Context, aggregatedKeyShare types.AggregatedKeyShare) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.AggregatedKeyShareKeyPrefix))
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
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.AggregatedKeyShareKeyPrefix))

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
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.AggregatedKeyShareKeyPrefix))
	store.Delete(types.AggregatedKeyShareKey(
		height,
	))
}

// GetAllAggregatedKeyShare returns all aggregatedKeyShare
func (k Keeper) GetAllAggregatedKeyShare(ctx sdk.Context) (list []types.AggregatedKeyShare) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.AggregatedKeyShareKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

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

	reqQueueEntry, found := k.GetQueueEntry(ctx, data.Identity)
	if !found {
		return packetAck, errors.New("Request not found for this identity")
	}

	k.ExecuteGenEncTxs(reqQueueEntry, data.AggrKeyshare, data.Pubkey)
	k.RemoveQueueEntry(ctx, data.Identity)

	return packetAck, nil
}
