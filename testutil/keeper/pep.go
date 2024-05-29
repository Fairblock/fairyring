package keeper

import (
	authkeeper "github.com/cosmos/cosmos-sdk/x/auth/keeper"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	bankkeeper "github.com/cosmos/cosmos-sdk/x/bank/keeper"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"
	capabilitykeeper "github.com/cosmos/ibc-go/modules/capability/keeper"

	"testing"

	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"

	"cosmossdk.io/log"
	"cosmossdk.io/store"
	storetypes "cosmossdk.io/store/types"
	dbm "github.com/cometbft/cometbft-db"
	tmproto "github.com/cometbft/cometbft/proto/tendermint/types"
	"github.com/cosmos/cosmos-sdk/codec"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	typesparams "github.com/cosmos/cosmos-sdk/x/params/types"
	capabilitytypes "github.com/cosmos/ibc-go/modules/capability/types"
	clienttypes "github.com/cosmos/ibc-go/v8/modules/core/02-client/types"
	connTypes "github.com/cosmos/ibc-go/v8/modules/core/03-connection/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
	"github.com/stretchr/testify/require"
)

// pepChannelKeeper is a stub of cosmosibckeeper.ChannelKeeper.
type pepChannelKeeper struct{}

func (pepChannelKeeper) GetChannel(ctx sdk.Context, srcPort, srcChan string) (channel channeltypes.Channel, found bool) {
	return channeltypes.Channel{}, false
}
func (pepChannelKeeper) GetNextSequenceSend(ctx sdk.Context, portID, channelID string) (uint64, bool) {
	return 0, false
}

func (pepChannelKeeper) SendPacket(
	ctx sdk.Context,
	channelCap *capabilitytypes.Capability,
	sourcePort string,
	sourceChannel string,
	timeoutHeight clienttypes.Height,
	timeoutTimestamp uint64,
	data []byte,
) (uint64, error) {
	return 0, nil
}

func (pepChannelKeeper) ChanCloseInit(ctx sdk.Context, portID, channelID string, chanCap *capabilitytypes.Capability) error {
	return nil
}

// pepportKeeper is a stub of cosmosibckeeper.PortKeeper
type pepPortKeeper struct{}

func (pepPortKeeper) BindPort(ctx sdk.Context, portID string) *capabilitytypes.Capability {
	return &capabilitytypes.Capability{}
}

type pepconnectionKeeper struct{}

func (pepconnectionKeeper) GetConnection(ctx sdk.Context, connectionID string) (connTypes.ConnectionEnd, bool) {
	return connTypes.ConnectionEnd{}, true
}

func PepKeeper(t testing.TB) (*keeper.Keeper, sdk.Context) {
	logger := log.NewNopLogger()

	storeKey := sdk.NewKVStoreKey(types.StoreKey)
	memStoreKey := storetypes.NewMemoryStoreKey(types.MemStoreKey)

	db := dbm.NewMemDB()
	stateStore := store.NewCommitMultiStore(db)
	stateStore.MountStoreWithDB(storeKey, storetypes.StoreTypeIAVL, db)
	stateStore.MountStoreWithDB(memStoreKey, storetypes.StoreTypeMemory, nil)
	require.NoError(t, stateStore.LoadLatestVersion())

	registry := codectypes.NewInterfaceRegistry()
	appCodec := codec.NewProtoCodec(registry)
	capabilityKeeper := capabilitykeeper.NewKeeper(appCodec, storeKey, memStoreKey)

	paramsSubspace := typesparams.NewSubspace(appCodec,
		types.Amino,
		storeKey,
		memStoreKey,
		"PepParams",
	)

	accountKeeper := authkeeper.NewAccountKeeper(
		appCodec,
		sdk.NewKVStoreKey("acc"),
		authtypes.ProtoBaseAccount,
		map[string][]string{},
		sdk.Bech32PrefixAccAddr,
		authtypes.NewModuleAddress(govtypes.ModuleName).String(),
	)

	bankKeeper := bankkeeper.NewBaseKeeper(
		appCodec,
		sdk.NewKVStoreKey("bank"),
		accountKeeper,
		map[string]bool{},
		authtypes.NewModuleAddress(govtypes.ModuleName).String(),
	)

	k := keeper.NewKeeper(
		appCodec,
		storeKey,
		memStoreKey,
		paramsSubspace,
		pepChannelKeeper{},
		pepPortKeeper{},
		capabilityKeeper.ScopeToModule("pepScopedKeeper"),
		pepconnectionKeeper{},
		bankKeeper,
	)

	ctx := sdk.NewContext(stateStore, tmproto.Header{}, false, logger)

	// Initialize params
	k.SetParams(ctx, types.DefaultParams())

	return k, ctx
}
