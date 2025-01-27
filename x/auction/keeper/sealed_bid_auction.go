package keeper

import (
	"context"
	storetypes "cosmossdk.io/store/types"
	"fmt"
	"github.com/Fairblock/fairyring/x/auction/types"
	common "github.com/Fairblock/fairyring/x/common/types"
	"github.com/cosmos/cosmos-sdk/runtime"

	"cosmossdk.io/store/prefix"
)

// AppendAuctionDetail append a specific auction in the store
func (k Keeper) AppendAuctionDetail(
	ctx context.Context,
	auction common.AuctionDetail,
) common.AuctionDetail {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AuctionDetailListKeyPrefix))
	var allAuctionsFromHeight common.AuctionDetailList
	b := store.Get(types.AuctionDetailsFromHeightKey(
		auction.ResolveAt,
	))

	k.cdc.MustUnmarshal(b, &allAuctionsFromHeight)

	auction.AuctionId = uint64(len(allAuctionsFromHeight.GetAuctionDetail()))
	auction.Identity = fmt.Sprintf("auction/%s/%d/%d", auction.Creator, auction.ResolveAt, auction.AuctionId)

	allAuctionsFromHeight.AuctionDetail = append(allAuctionsFromHeight.AuctionDetail, auction)

	parsedEncryptedTxArr := k.cdc.MustMarshal(&allAuctionsFromHeight)

	store.Set(types.AuctionDetailsFromHeightKey(
		auction.ResolveAt,
	), parsedEncryptedTxArr)

	return auction
}

func (k Keeper) SetAuctionDetailList(
	ctx context.Context,
	targetHeight uint64,
	auctionDetailList common.AuctionDetailList,
) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AuctionDetailListKeyPrefix))

	parsedAuctionDetailList := k.cdc.MustMarshal(&auctionDetailList)

	store.Set(types.AuctionDetailsFromHeightKey(
		targetHeight,
	), parsedAuctionDetailList)
}

func (k Keeper) AppendBidToAuction(
	ctx context.Context,
	height uint64,
	id uint64,
	bid common.Bid,
) {
	arr := k.GetAllAuctionsFromHeight(ctx, height)

	for i := range arr.AuctionDetail {
		if arr.AuctionDetail[i].AuctionId == id {
			if arr.AuctionDetail[i].Bids == nil || len(arr.AuctionDetail[i].Bids) == 0 {
				arr.AuctionDetail[i].Bids = make([]*common.Bid, 0)
			}

			arr.AuctionDetail[i].Bids = append(arr.AuctionDetail[i].Bids, &bid)

			break
		}
	}

	k.SetAuctionDetailList(ctx, height, arr)
}

func (k Keeper) SetAllAuctionResolved(
	ctx context.Context,
	height uint64,
) {
	arr := k.GetAllAuctionsFromHeight(ctx, height)

	for i := range arr.AuctionDetail {
		arr.AuctionDetail[i].IsResolved = true
	}

	k.SetAuctionDetailList(ctx, height, arr)
}

// GetAuctionDetail returns an auction detail from its index
func (k Keeper) GetAuctionDetail(
	ctx context.Context,
	targetHeight uint64,
	index uint64,

) (val common.AuctionDetail, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AuctionDetailListKeyPrefix))

	b := store.Get(types.AuctionDetailsFromHeightKey(
		targetHeight,
	))
	if b == nil {
		return val, false
	}

	var arr common.AuctionDetailList
	k.cdc.MustUnmarshal(b, &arr)

	auctions := arr.GetAuctionDetail()

	if uint64(len(auctions)) <= index {
		return val, false
	}

	return auctions[index], true
}

// GetAllAuctionsFromHeight returns all auction_detail from the height provided
func (k Keeper) GetAllAuctionsFromHeight(
	ctx context.Context,
	targetHeight uint64,
) common.AuctionDetailList {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AuctionDetailListKeyPrefix))

	b := store.Get(types.AuctionDetailsFromHeightKey(
		targetHeight,
	))

	var arr common.AuctionDetailList
	k.cdc.MustUnmarshal(b, &arr)

	return arr
}

// GetAllAuctionDetailList returns the list of all auction detail list
func (k Keeper) GetAllAuctionDetailList(ctx context.Context) (arr []common.AuctionDetailList) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AuctionDetailListKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val common.AuctionDetailList
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		arr = append(arr, val)
	}

	return
}

// RemoveAllAuctionsFromHeight removes all auction from the store for a particular height
//func (k Keeper) RemoveAllAuctionsFromHeight(
//	ctx context.Context,
//	targetHeight uint64,
//) {
//	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
//	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.AuctionDetailListKeyPrefix))
//	store.Delete(types.AuctionDetailsFromHeightKey(
//		targetHeight,
//	))
//}
