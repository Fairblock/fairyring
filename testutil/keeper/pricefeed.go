package keeper

import (
	"testing"

	"github.com/cosmos/cosmos-sdk/codec"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"
	"github.com/cosmos/cosmos-sdk/store"
	storetypes "github.com/cosmos/cosmos-sdk/store/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	capabilitykeeper "github.com/cosmos/cosmos-sdk/x/capability/keeper"
	capabilitytypes "github.com/cosmos/cosmos-sdk/x/capability/types"
	typesparams "github.com/cosmos/cosmos-sdk/x/params/types"
	channeltypes "github.com/cosmos/ibc-go/v5/modules/core/04-channel/types"
	ibcexported "github.com/cosmos/ibc-go/v5/modules/core/exported"
	"github.com/stretchr/testify/require"
	"github.com/tendermint/tendermint/libs/log"
	tmproto "github.com/tendermint/tendermint/proto/tendermint/types"
	tmdb "github.com/tendermint/tm-db"

	"fairyring/x/pricefeed/keeper"
	"fairyring/x/pricefeed/types"
)

// priceFeedChannelKeeper is a stub of cosmosibckeeper.ChannelKeeper.
type priceFeedChannelKeeper struct{}

func (priceFeedChannelKeeper) GetChannel(
	ctx sdk.Context,
	srcPort, srcChan string,
) (channel channeltypes.Channel, found bool) {
	return channeltypes.Channel{}, false
}
func (priceFeedChannelKeeper) GetNextSequenceSend(ctx sdk.Context, portID, channelID string) (uint64, bool) {
	return 0, false
}

func (priceFeedChannelKeeper) SendPacket(
	ctx sdk.Context,
	channelCap *capabilitytypes.Capability,
	packet ibcexported.PacketI,
) error {
	return nil
}

func (priceFeedChannelKeeper) ChanCloseInit(
	ctx sdk.Context,
	portID, channelID string,
	chanCap *capabilitytypes.Capability,
) error {
	return nil
}

// priceFeedportKeeper is a stub of cosmosibckeeper.PortKeeper
type priceFeedPortKeeper struct{}

func (priceFeedPortKeeper) BindPort(ctx sdk.Context, portID string) *capabilitytypes.Capability {
	return &capabilitytypes.Capability{}
}

func PriceFeedKeeper(t testing.TB) (keeper.Keeper, sdk.Context) {
	logger := log.NewNopLogger()

	storeKey := sdk.NewKVStoreKey(types.StoreKey)
	memKeys := storetypes.NewMemoryStoreKey(capabilitytypes.MemStoreKey)
	tPricefeedKey := sdk.NewTransientStoreKey("transient_test")

	db := tmdb.NewMemDB()
	stateStore := store.NewCommitMultiStore(db)
	stateStore.MountStoreWithDB(storeKey, storetypes.StoreTypeIAVL, db)
	stateStore.MountStoreWithDB(memKeys, storetypes.StoreTypeMemory, nil)
	stateStore.MountStoreWithDB(tPricefeedKey, storetypes.StoreTypeTransient, nil)
	require.NoError(t, stateStore.LoadLatestVersion())

	registry := codectypes.NewInterfaceRegistry()
	cdc := codec.NewProtoCodec(registry)
	amino := codec.NewLegacyAmino()
	capabilityKeeper := capabilitykeeper.NewKeeper(cdc, storeKey, memKeys)

	paramsSubspace := typesparams.NewSubspace(
		cdc,
		amino,
		storeKey,
		tPricefeedKey,
		"PriceFeedParams",
	)
	k := keeper.NewKeeper(
		cdc,
		storeKey,
		paramsSubspace,
		priceFeedChannelKeeper{},
		priceFeedChannelKeeper{},
		priceFeedPortKeeper{},
		capabilityKeeper.ScopeToModule("PriceFeedScopedKeeper"),
	)

	ctx := sdk.NewContext(stateStore, tmproto.Header{}, false, logger)

	// Initialize params
	k.SetParams(ctx, types.DefaultParams())

	return k, ctx
}
