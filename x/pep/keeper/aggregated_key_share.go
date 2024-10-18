package keeper

import (
	"context"
	"errors"

	storetypes "cosmossdk.io/store/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	kstypes "github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/Fairblock/fairyring/x/pep/types"

	"cosmossdk.io/store/prefix"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
)

// SetDecryptionKey set a specific decryption key in the store from its index
func (k Keeper) SetDecryptionKey(ctx context.Context, aggregatedKeyShare types.DecryptionKey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyKeyPrefix))
	b := k.cdc.MustMarshal(&aggregatedKeyShare)
	store.Set(types.DecryptionKeyKey(
		aggregatedKeyShare.Height,
	), b)
}

// GetDecryptionKey returns a decryption key from its index
func (k Keeper) GetDecryptionKey(
	ctx context.Context,
	height uint64,

) (val types.DecryptionKey, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyKeyPrefix))

	b := store.Get(types.DecryptionKeyKey(
		height,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveDecryptionKey removes a decryption key from the store
func (k Keeper) RemoveDecryptionKey(
	ctx context.Context,
	height uint64,

) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyKeyPrefix))
	store.Delete(types.DecryptionKeyKey(
		height,
	))
}

// GetAllDecryptionKeys returns all decryption keys
func (k Keeper) GetAllDecryptionKeys(ctx context.Context) (list []types.DecryptionKey) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.DecryptionKeyKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.DecryptionKey
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}

// OnRecvDecryptionKeyDataPacket processes packet reception
func (k Keeper) OnRecvDecryptionKeyDataPacket(
	ctx context.Context,
	packet channeltypes.Packet,
	data kstypes.DecryptionKeyDataPacketData,
) (packetAck kstypes.DecryptionKeyPacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	entry, found := k.GetEntry(ctx, data.RequestId)
	if !found {
		return packetAck, errors.New("request not found for this id")
	}

	entry.DecryptionKey = data.DecryptionKey

	k.SetExecutionQueueEntry(ctx, entry)
	k.SetEntry(ctx, entry)

	return packetAck, nil
}

// OnRecvEncKeyshareDataPacket processes packet reception
func (k Keeper) OnRecvPrivDecryptionKeyDataPacket(
	ctx context.Context,
	packet channeltypes.Packet,
	data kstypes.PrivateDecryptionKeyDataPacketData,
) (packetAck kstypes.PrivateDecryptionKeyPacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	entry, found := k.GetPrivateRequest(ctx, data.RequestId)
	if !found {
		return packetAck, errors.New("request not found for this id")
	}

	entry.PrivateDecryptionKeys = data.PrivateDecryptionKey
	k.SetPrivateRequest(ctx, entry)

	return packetAck, nil
}
