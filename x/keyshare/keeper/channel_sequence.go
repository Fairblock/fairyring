package keeper

import (
	"fairyring/x/keyshare/types"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetLastSequence set a specific channel sequence in the store by its index
func (k Keeper) SetLastSequence(ctx sdk.Context, lastSequence types.LastProcessedSequence) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.SequenceKeyPrefix))
	key := []byte(lastSequence.ChannelId + lastSequence.PortId)
	b := k.cdc.MustMarshal(&lastSequence)
	store.Set(key, b)
}

// GetLastSequence returns a channel sequence from its index
func (k Keeper) GetLastSequence(
	ctx sdk.Context,
	channelID string,
	portID string,
) (val types.LastProcessedSequence, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.SequenceKeyPrefix))

	b := store.Get([]byte(channelID + portID))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveLastSequence removes a channel sequence from the store
func (k Keeper) RemoveLastSequence(
	ctx sdk.Context,
	channelID string,
	portID string,
) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.SequenceKeyPrefix))
	store.Delete([]byte(channelID + portID))
}

// GetAllLastSequences returns all the sequences of all channels
func (k Keeper) GetAllLastSequences(ctx sdk.Context) (list []types.LastProcessedSequence) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.SequenceKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.LastProcessedSequence
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
