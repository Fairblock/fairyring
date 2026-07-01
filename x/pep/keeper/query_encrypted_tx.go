package keeper

import (
	"context"
	"encoding/binary"

	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func encryptedTxPageKey(offset uint64) []byte {
	bz := make([]byte, 8)
	binary.BigEndian.PutUint64(bz, offset)
	return bz
}

func encryptedTxPageOffset(key []byte) uint64 {
	if len(key) != 8 {
		return 0
	}
	return binary.BigEndian.Uint64(key)
}

func paginateEncryptedTxArrays(
	encryptedTxs []types.EncryptedTxArray,
	pagination *query.PageRequest,
) ([]types.EncryptedTxArray, *query.PageResponse) {
	pageRes := &query.PageResponse{}
	if pagination == nil {
		pageRes.Total = uint64(len(encryptedTxs))
		return encryptedTxs, pageRes
	}

	items := encryptedTxs
	if pagination.Reverse {
		items = make([]types.EncryptedTxArray, len(encryptedTxs))
		copy(items, encryptedTxs)
		for i, j := 0, len(items)-1; i < j; i, j = i+1, j-1 {
			items[i], items[j] = items[j], items[i]
		}
	}

	start := pagination.Offset
	if len(pagination.Key) > 0 {
		start = encryptedTxPageOffset(pagination.Key)
	}
	if start > uint64(len(items)) {
		start = uint64(len(items))
	}

	end := uint64(len(items))
	if pagination.Limit > 0 && start+pagination.Limit < end {
		end = start + pagination.Limit
		pageRes.NextKey = encryptedTxPageKey(end)
	}

	if pagination.CountTotal {
		pageRes.Total = uint64(len(items))
	}

	return items[int(start):int(end)], pageRes
}

// EncryptedTxAll returns the paginated list of all encrypted Txs.
func (k Keeper) EncryptedTxAll(
	c context.Context,
	req *types.QueryEncryptedTxAllRequest,
) (*types.QueryEncryptedTxAllResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(c)
	encryptedTxs := k.GetAllEncryptedArray(ctx)
	pageItems, pageRes := paginateEncryptedTxArrays(encryptedTxs, req.Pagination)

	return &types.QueryEncryptedTxAllResponse{
		EncryptedTxArray: pageItems,
		Pagination:       pageRes,
	}, nil
}

// EncryptedTxAllFromHeight returns all the encrypted TXs for a particular height.
func (k Keeper) EncryptedTxAllFromHeight(
	c context.Context,
	req *types.QueryEncryptedTxAllFromHeightRequest,
) (*types.QueryEncryptedTxAllFromHeightResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(c)
	val := k.GetEncryptedTxAllFromHeight(ctx, req.TargetHeight)

	return &types.QueryEncryptedTxAllFromHeightResponse{
		EncryptedTxArray: val,
	}, nil
}

// EncryptedTx returns a singe encrypted Tx by index.
func (k Keeper) EncryptedTx(
	c context.Context,
	req *types.QueryEncryptedTxRequest,
) (*types.QueryEncryptedTxResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(c)

	val, found := k.GetEncryptedTx(
		ctx,
		req.TargetHeight,
		req.Index,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryEncryptedTxResponse{EncryptedTx: val}, nil
}
