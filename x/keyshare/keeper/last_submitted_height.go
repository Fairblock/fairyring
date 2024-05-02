package keeper

import (
	"cosmossdk.io/store/prefix"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"strconv"
)

func (k Keeper) SetLastSubmittedHeight(ctx sdk.Context, validator, height string) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.KeyLastSubmittedHeightPrefix))
	store.Set(types.LastSubmittedHeightKey(validator), []byte(height))
}

func (k Keeper) GetLastSubmittedHeight(ctx sdk.Context, validator string) uint64 {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.KeyLastSubmittedHeightPrefix))
	b := store.Get(types.LastSubmittedHeightKey(validator))
	if len(b) == 0 {
		return 0
	}
	if val, err := strconv.ParseUint(string(b), 10, 64); err != nil {
		return 0
	} else {
		return val
	}
}
