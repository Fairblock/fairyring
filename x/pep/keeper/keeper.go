package keeper

import (
	"cosmossdk.io/collections"
	"cosmossdk.io/core/store"
	"cosmossdk.io/store/prefix"
	"fmt"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/runtime"
	"strconv"

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
		authority        string
		bankKeeper       types.BankKeeper
		connectionKeeper types.ConnectionKeeper

		params collections.Item[types.Params]
	}
)

func NewKeeper(
	cdc codec.BinaryCodec,
	storeService store.KVStoreService,
	logger log.Logger,
	authority string,
	bankKeeper types.BankKeeper,
	channelKeeper types.ChannelKeeper,
	portKeeper types.PortKeeper,
	scopedKeeper types.ScopedKeeper,
	connectionKeeper types.ConnectionKeeper,
) Keeper {
	sb := collections.NewSchemaBuilder(storeService)
	if _, err := sdk.AccAddressFromBech32(authority); err != nil {
		panic(fmt.Sprintf("invalid authority address: %s", authority))
	}

	return Keeper{
		IBCKeeper: types.NewIBCKeeper(
			types.PortKey,
			storeService,
			channelKeeper,
			portKeeper,
			scopedKeeper,
		),
		cdc:              cdc,
		storeService:     storeService,
		logger:           logger,
		authority:        authority,
		bankKeeper:       bankKeeper,
		connectionKeeper: connectionKeeper,
		params:           collections.NewItem(sb, types.ParamsKey, "params", codec.CollValue[types.Params](cdc)),
	}
}

// GetAuthority returns the module's authority.
func (k Keeper) GetAuthority() string {
	return k.authority
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
