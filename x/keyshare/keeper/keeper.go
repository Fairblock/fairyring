package keeper

import (
	"fmt"
	"strconv"

	"github.com/Fairblock/fairyring/x/keyshare/types"

	storetypes "cosmossdk.io/store/types"
	"github.com/cometbft/cometbft/libs/log"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
)

type (
	Keeper struct {
		*types.IBCKeeper
		cdc              codec.BinaryCodec
		storeKey         storetypes.StoreKey
		memKey           storetypes.StoreKey
		paramstore       paramtypes.Subspace
		connectionKeeper types.ConnectionKeeper
		stakingKeeper    types.StakingKeeper
		pepKeeper        types.PepKeeper
		govKeeper        types.GovKeeper
	}
)

func NewKeeper(
	cdc codec.BinaryCodec,
	storeKey,
	memKey storetypes.StoreKey,
	ps paramtypes.Subspace,
	channelKeeper types.ChannelKeeper,
	portKeeper types.PortKeeper,
	scopedKeeper types.ScopedKeeper,
	connectionKeeper types.ConnectionKeeper,
	pk types.PepKeeper,
	stakingKeeper types.StakingKeeper,
	govKeeper types.GovKeeper,
) *Keeper {
	// set KeyTable if it has not already been set
	if !ps.HasKeyTable() {
		ps = ps.WithKeyTable(types.ParamKeyTable())
	}

	return &Keeper{
		IBCKeeper: types.NewIBCKeeper(
			types.PortKey,
			storeKey,
			channelKeeper,
			portKeeper,
			scopedKeeper,
		),
		cdc:              cdc,
		storeKey:         storeKey,
		memKey:           memKey,
		paramstore:       ps,
		pepKeeper:        pk,
		stakingKeeper:    stakingKeeper,
		connectionKeeper: connectionKeeper,
		govKeeper:        govKeeper,
	}
}

func (k Keeper) StakingKeeper() types.StakingKeeper {
	return k.stakingKeeper
}

func (k Keeper) Logger(ctx sdk.Context) log.Logger {
	return ctx.Logger().With("module", fmt.Sprintf("x/%s", types.ModuleName))
}

// GetRequestCount returns the request count
func (k Keeper) GetRequestCount(ctx sdk.Context) string {
	store := ctx.KVStore(k.storeKey)
	return string(store.Get(types.RequestsCountKey))
}

// SetRequestCount sets RequestCount
func (k Keeper) SetRequestCount(ctx sdk.Context, requestNumber uint64) {
	store := ctx.KVStore(k.storeKey)
	store.Set(types.RequestsCountKey, []byte(strconv.FormatUint(requestNumber, 10)))
}
