package keeper

import (
	"cosmossdk.io/collections"
	"cosmossdk.io/core/store"
	"cosmossdk.io/store/prefix"
	"fmt"
	"github.com/cosmos/cosmos-sdk/runtime"
	"strconv"

	"github.com/Fairblock/fairyring/x/keyshare/types"

	"cosmossdk.io/log"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

type (
	Keeper struct {
		*types.IBCKeeper
		cdc          codec.BinaryCodec
		storeService store.KVStoreService
		logger       log.Logger

		// the address capable of executing a MsgUpdateParams message. Typically, this
		// should be the x/gov module account.
		authority string

		slashingKeeper   types.SlashingKeeper
		stakingKeeper    types.StakingKeeper
		pepKeeper        types.PepKeeper
		govKeeper        types.GovKeeper
		connectionKeeper types.ConnectionKeeper

		params collections.Item[types.Params]
	}
)

func NewKeeper(
	cdc codec.BinaryCodec,
	storeService store.KVStoreService,
	logger log.Logger,
	authority string,
	pk types.PepKeeper,
	slashingKeeper types.SlashingKeeper,
	stakingKeeper types.StakingKeeper,
	govKeeper types.GovKeeper,
	channelKeeper types.ChannelKeeper,
	portKeeper types.PortKeeper,
	scopedKeeper types.ScopedKeeper,
	connectionKeeper types.ConnectionKeeper,
) Keeper {
	sb := collections.NewSchemaBuilder(storeService)
	return Keeper{
		cdc:              cdc,
		storeService:     storeService,
		logger:           logger,
		authority:        authority,
		pepKeeper:        pk,
		slashingKeeper:   slashingKeeper,
		stakingKeeper:    stakingKeeper,
		govKeeper:        govKeeper,
		connectionKeeper: connectionKeeper,
		IBCKeeper: types.NewIBCKeeper(
			types.PortKey,
			storeService,
			channelKeeper,
			portKeeper,
			scopedKeeper,
		),
		params: collections.NewItem(sb, types.ParamsKey, "params", codec.CollValue[types.Params](cdc)),
	}
}

func (k Keeper) SlashingKeeper() types.SlashingKeeper {
	return k.slashingKeeper
}

func (k Keeper) Logger(ctx sdk.Context) log.Logger {
	return ctx.Logger().With("module", fmt.Sprintf("x/%s", types.ModuleName))
}

// GetRequestCount returns the request count
func (k Keeper) GetRequestCount(ctx sdk.Context) string {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	return string(store.Get(types.RequestsCountKey))
}

// SetRequestCount sets RequestCount
func (k Keeper) SetRequestCount(ctx sdk.Context, requestNumber uint64) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	store.Set(types.RequestsCountKey, []byte(strconv.FormatUint(requestNumber, 10)))
}
