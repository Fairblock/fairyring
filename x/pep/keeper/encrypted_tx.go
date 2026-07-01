package keeper

import (
	"bytes"
	"context"
	"encoding/binary"
	"sort"

	"cosmossdk.io/store/prefix"
	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/runtime"
)

func uint64ToBytes(v uint64) []byte {
	bz := make([]byte, 8)
	binary.BigEndian.PutUint64(bz, v)
	return bz
}

func bytesToUint64(bz []byte) uint64 {
	if len(bz) != 8 {
		return 0
	}
	return binary.BigEndian.Uint64(bz)
}

func (k Keeper) encryptedTxStore(ctx context.Context) storetypes.KVStore {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	return prefix.NewStore(storeAdapter, types.KeyPrefix(types.EncryptedTxKeyPrefix))
}

func (k Keeper) getEncryptedTxCountWithoutMigration(ctx context.Context, height uint64) uint64 {
	store := k.encryptedTxStore(ctx)
	return bytesToUint64(store.Get(types.EncryptedTxCountKey(height)))
}

func (k Keeper) getEncryptedTxCount(ctx context.Context, height uint64) uint64 {
	k.migrateLegacyEncryptedTxBucket(ctx, height)
	return k.getEncryptedTxCountWithoutMigration(ctx, height)
}

func (k Keeper) setEncryptedTxCount(ctx context.Context, height uint64, count uint64) {
	store := k.encryptedTxStore(ctx)
	store.Set(types.EncryptedTxCountKey(height), uint64ToBytes(count))
}

func encryptedTxPrefixForHeight(height uint64) []byte {
	return types.EncryptedTxAllFromHeightKey(height)
}

func encryptedTxItemsPrefixForHeight(height uint64) []byte {
	return append(encryptedTxPrefixForHeight(height), []byte("tx/")...)
}

func isEncryptedTxItemKey(key []byte) bool {
	// New encrypted tx item keys are:
	//   <8-byte height>/tx/<8-byte index>/
	// Count keys are:
	//   <8-byte height>/count/
	// Old array keys are:
	//   <8-byte height>/
	// Filtering by key shape avoids accidentally unmarshalling count bytes or old
	// EncryptedTxArray bytes as a single EncryptedTx.
	if len(key) != 8+1+3+8+1 {
		return false
	}
	if key[8] != '/' {
		return false
	}
	if !bytes.Equal(key[9:12], []byte("tx/")) {
		return false
	}
	return key[len(key)-1] == '/'
}

func isLegacyEncryptedTxArrayKey(key []byte) bool {
	return len(key) == 8+1 && key[8] == '/'
}

func heightFromEncryptedTxItemKey(key []byte) uint64 {
	if len(key) < 8 {
		return 0
	}
	return binary.BigEndian.Uint64(key[:8])
}

func (k Keeper) migrateLegacyEncryptedTxBucket(ctx context.Context, height uint64) {
	store := k.encryptedTxStore(ctx)
	legacyKey := types.EncryptedTxAllFromHeightKey(height)
	b := store.Get(legacyKey)
	if b == nil {
		return
	}

	var arr types.EncryptedTxArray
	if err := k.cdc.Unmarshal(b, &arr); err != nil {
		return
	}

	for i := range arr.EncryptedTxs {
		tx := arr.EncryptedTxs[i]
		tx.TargetHeight = height
		tx.Index = uint64(i)
		store.Set(types.EncryptedTxKey(height, tx.Index), k.cdc.MustMarshal(&tx))
	}

	if uint64(len(arr.EncryptedTxs)) > k.getEncryptedTxCountWithoutMigration(ctx, height) {
		k.setEncryptedTxCount(ctx, height, uint64(len(arr.EncryptedTxs)))
	}
	store.Delete(legacyKey)
}

// AppendEncryptedTx appends a specific encryptedTx in the store.
//
// The old implementation stored all txs for a target height as one protobuf
// array under one KV key. That made the Nth submit read, unmarshal, marshal and
// rewrite all N txs for that height. Under concurrent submissions to the same
// target block, gas therefore rose with the bucket size and eventually failed in
// WritePerByte.
//
// This stores each accepted tx under its own deterministic height/index key and
// uses a tiny per-height counter to assign indexes. Execution order is preserved
// by later iterating/sorting by this accepted index.
func (k Keeper) AppendEncryptedTx(
	ctx context.Context,
	encryptedTx types.EncryptedTx,
) uint64 {
	store := k.encryptedTxStore(ctx)

	index := k.getEncryptedTxCount(ctx, encryptedTx.TargetHeight)
	encryptedTx.Index = index

	store.Set(
		types.EncryptedTxKey(encryptedTx.TargetHeight, encryptedTx.Index),
		k.cdc.MustMarshal(&encryptedTx),
	)
	k.setEncryptedTxCount(ctx, encryptedTx.TargetHeight, index+1)

	return encryptedTx.Index
}

// SetEncryptedTx sets all encrypted txs for a height. This is mainly used by
// genesis import/tests, so rewrite the height bucket into per-tx keys.
func (k Keeper) SetEncryptedTx(
	ctx context.Context,
	height uint64,
	encryptedTxArr types.EncryptedTxArray,
) {
	k.RemoveAllEncryptedTxFromHeight(ctx, height)

	store := k.encryptedTxStore(ctx)
	for i := range encryptedTxArr.EncryptedTxs {
		tx := encryptedTxArr.EncryptedTxs[i]
		tx.TargetHeight = height
		tx.Index = uint64(i)
		store.Set(types.EncryptedTxKey(height, tx.Index), k.cdc.MustMarshal(&tx))
	}
	k.setEncryptedTxCount(ctx, height, uint64(len(encryptedTxArr.EncryptedTxs)))
}

func (k Keeper) SetEncryptedTxProcessedHeight(
	ctx context.Context,
	height uint64,
	index uint64,
	processedHeight uint64,
) {
	k.migrateLegacyEncryptedTxBucket(ctx, height)
	store := k.encryptedTxStore(ctx)
	key := types.EncryptedTxKey(height, index)
	b := store.Get(key)
	if b == nil {
		return
	}

	var tx types.EncryptedTx
	k.cdc.MustUnmarshal(b, &tx)
	tx.ProcessedAtChainHeight = processedHeight
	store.Set(key, k.cdc.MustMarshal(&tx))
}

func (k Keeper) SetAllEncryptedTxExpired(
	ctx context.Context,
	height uint64,
) {
	k.migrateLegacyEncryptedTxBucket(ctx, height)
	store := k.encryptedTxStore(ctx)
	iterator := storetypes.KVStorePrefixIterator(store, encryptedTxItemsPrefixForHeight(height))
	defer iterator.Close()

	updates := make(map[string]types.EncryptedTx)
	for ; iterator.Valid(); iterator.Next() {
		var tx types.EncryptedTx
		k.cdc.MustUnmarshal(iterator.Value(), &tx)
		tx.Expired = true

		key := make([]byte, len(iterator.Key()))
		copy(key, iterator.Key())
		updates[string(key)] = tx
	}

	for key, tx := range updates {
		store.Set([]byte(key), k.cdc.MustMarshal(&tx))
	}
}

// GetEncryptedTx returns a encryptedTx from its index
func (k Keeper) GetEncryptedTx(
	ctx context.Context,
	targetHeight uint64,
	index uint64,
) (val types.EncryptedTx, found bool) {
	k.migrateLegacyEncryptedTxBucket(ctx, targetHeight)
	store := k.encryptedTxStore(ctx)

	b := store.Get(types.EncryptedTxKey(targetHeight, index))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// GetEncryptedTxAllFromHeight returns all encryptedTx from the height provided
func (k Keeper) GetEncryptedTxAllFromHeight(
	ctx context.Context,
	targetHeight uint64,
) types.EncryptedTxArray {
	k.migrateLegacyEncryptedTxBucket(ctx, targetHeight)
	store := k.encryptedTxStore(ctx)
	iterator := storetypes.KVStorePrefixIterator(store, encryptedTxItemsPrefixForHeight(targetHeight))
	defer iterator.Close()

	arr := types.EncryptedTxArray{}
	for ; iterator.Valid(); iterator.Next() {
		var tx types.EncryptedTx
		k.cdc.MustUnmarshal(iterator.Value(), &tx)
		arr.EncryptedTxs = append(arr.EncryptedTxs, tx)
	}

	sort.Slice(arr.EncryptedTxs, func(i, j int) bool {
		return arr.EncryptedTxs[i].Index < arr.EncryptedTxs[j].Index
	})

	return arr
}

// GetAllEncryptedArray returns the list of all encrypted txs
func (k Keeper) GetAllEncryptedArray(ctx context.Context) (arr []types.EncryptedTxArray) {
	store := k.encryptedTxStore(ctx)
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})
	defer iterator.Close()

	byHeight := map[uint64][]types.EncryptedTx{}
	legacyArrays := make([]types.EncryptedTxArray, 0)
	for ; iterator.Valid(); iterator.Next() {
		key := iterator.Key()
		if isLegacyEncryptedTxArrayKey(key) {
			var legacyArr types.EncryptedTxArray
			if err := k.cdc.Unmarshal(iterator.Value(), &legacyArr); err == nil {
				sort.Slice(legacyArr.EncryptedTxs, func(i, j int) bool {
					return legacyArr.EncryptedTxs[i].Index < legacyArr.EncryptedTxs[j].Index
				})
				legacyArrays = append(legacyArrays, legacyArr)
			}
			continue
		}
		if !isEncryptedTxItemKey(key) {
			continue
		}

		var tx types.EncryptedTx
		k.cdc.MustUnmarshal(iterator.Value(), &tx)
		height := heightFromEncryptedTxItemKey(key)
		byHeight[height] = append(byHeight[height], tx)
	}

	heights := make([]uint64, 0, len(byHeight))
	for height := range byHeight {
		heights = append(heights, height)
	}
	sort.Slice(heights, func(i, j int) bool { return heights[i] < heights[j] })

	for _, height := range heights {
		txs := byHeight[height]
		sort.Slice(txs, func(i, j int) bool { return txs[i].Index < txs[j].Index })
		arr = append(arr, types.EncryptedTxArray{EncryptedTxs: txs})
	}
	arr = append(arr, legacyArrays...)

	return arr
}

// RemoveAllEncryptedTxFromHeight removes all encryptedTx from the store for a particular height
func (k Keeper) RemoveAllEncryptedTxFromHeight(
	ctx context.Context,
	targetHeight uint64,
) {
	store := k.encryptedTxStore(ctx)
	iterator := storetypes.KVStorePrefixIterator(store, encryptedTxPrefixForHeight(targetHeight))
	defer iterator.Close()

	keys := make([][]byte, 0)
	for ; iterator.Valid(); iterator.Next() {
		key := make([]byte, len(iterator.Key()))
		copy(key, iterator.Key())
		keys = append(keys, key)
	}
	for _, key := range keys {
		store.Delete(key)
	}
}
