package keeper

import (
	"context"

	"github.com/cosmos/cosmos-sdk/runtime"

	"github.com/Fairblock/fairyring/x/keyshare/types"

	"cosmossdk.io/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// DecryptionKeyAll returns the paginated list of all decryption keys
func (k Keeper) DecryptionKeyAll(
	goCtx context.Context,
	req *types.QueryDecryptionKeyAllRequest,
) (*types.QueryDecryptionKeyAllResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var decryptionKeys []types.DecryptionKey
	ctx := sdk.UnwrapSDKContext(goCtx)

	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	decryptionKeyStore := prefix.NewStore(store, types.KeyPrefix(types.DecryptionKeyKeyPrefix))

	pageRes, err := query.Paginate(
		decryptionKeyStore,
		req.Pagination,
		func(key []byte, value []byte) error {
			var decryptionKey types.DecryptionKey
			if err := k.cdc.Unmarshal(value, &decryptionKey); err != nil {
				return err
			}

			decryptionKeys = append(decryptionKeys, decryptionKey)
			return nil
		},
	)

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryDecryptionKeyAllResponse{
		DecryptionKeys: decryptionKeys,
		Pagination:     pageRes,
	}, nil
}

// DecryptionKey returns the decryption key for a particular height
func (k Keeper) DecryptionKey(
	goCtx context.Context,
	req *types.QueryDecryptionKeyRequest,
) (*types.QueryDecryptionKeyResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(goCtx)

	val, found := k.GetDecryptionKey(
		ctx,
		req.Height,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryDecryptionKeyResponse{DecryptionKey: val}, nil
}
