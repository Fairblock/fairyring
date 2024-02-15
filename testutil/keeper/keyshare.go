package keeper

import (
	"testing"

	capabilitykeeper "github.com/cosmos/cosmos-sdk/x/capability/keeper"
	capabilitytypes "github.com/cosmos/cosmos-sdk/x/capability/types"
	clienttypes "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	connTypes "github.com/cosmos/ibc-go/v7/modules/core/03-connection/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"

	"fairyring/x/keyshare/keeper"
	"fairyring/x/keyshare/types"

	baseapp "github.com/cosmos/cosmos-sdk/baseapp"
	authkeeper "github.com/cosmos/cosmos-sdk/x/auth/keeper"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	bankkeeper "github.com/cosmos/cosmos-sdk/x/bank/keeper"
	govkeeper "github.com/cosmos/cosmos-sdk/x/gov/keeper"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"
	stakingkeeper "github.com/cosmos/cosmos-sdk/x/staking/keeper"

	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"

	dbm "github.com/cometbft/cometbft-db"
	"github.com/cometbft/cometbft/libs/log"
	tmproto "github.com/cometbft/cometbft/proto/tendermint/types"
	"github.com/cosmos/cosmos-sdk/codec"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"
	"github.com/cosmos/cosmos-sdk/store"
	storetypes "github.com/cosmos/cosmos-sdk/store/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	typesparams "github.com/cosmos/cosmos-sdk/x/params/types"

	"github.com/stretchr/testify/require"
)

type keyshareChannelKeeper struct{}

func (keyshareChannelKeeper) GetChannel(ctx sdk.Context, srcPort, srcChan string) (channel channeltypes.Channel, found bool) {
	return channeltypes.Channel{}, false
}
func (keyshareChannelKeeper) GetNextSequenceSend(ctx sdk.Context, portID, channelID string) (uint64, bool) {
	return 0, false
}

func (keyshareChannelKeeper) SendPacket(
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

func (keyshareChannelKeeper) ChanCloseInit(ctx sdk.Context, portID, channelID string, chanCap *capabilitytypes.Capability) error {
	return nil
}

// pepportKeeper is a stub of cosmosibckeeper.PortKeeper
type keysharePortKeeper struct{}

func (keysharePortKeeper) BindPort(ctx sdk.Context, portID string) *capabilitytypes.Capability {
	return &capabilitytypes.Capability{}
}

type keyshareconnectionKeeper struct{}

func (keyshareconnectionKeeper) GetConnection(ctx sdk.Context, connectionID string) (connTypes.ConnectionEnd, bool) {
	return connTypes.ConnectionEnd{}, true
}

func KeyshareKeeper(t testing.TB) (*keeper.Keeper, sdk.Context) {
	storeKey := sdk.NewKVStoreKey(types.StoreKey)
	memStoreKey := storetypes.NewMemoryStoreKey(types.MemStoreKey)

	db := dbm.NewMemDB()
	stateStore := store.NewCommitMultiStore(db)
	stateStore.MountStoreWithDB(storeKey, storetypes.StoreTypeIAVL, db)
	stateStore.MountStoreWithDB(memStoreKey, storetypes.StoreTypeMemory, nil)
	require.NoError(t, stateStore.LoadLatestVersion())

	registry := codectypes.NewInterfaceRegistry()
	cdc := codec.NewProtoCodec(registry)

	capabilityKeeper := capabilitykeeper.NewKeeper(cdc, storeKey, memStoreKey)

	paramsSubspace := typesparams.NewSubspace(cdc,
		types.Amino,
		storeKey,
		memStoreKey,
		"FairyringParams",
	)

	accountKeeper := authkeeper.NewAccountKeeper(
		cdc,
		sdk.NewKVStoreKey("acc"),
		authtypes.ProtoBaseAccount,
		map[string][]string{},
		sdk.Bech32PrefixAccAddr,
		authtypes.NewModuleAddress(govtypes.ModuleName).String(),
	)

	bankKeeper := bankkeeper.NewBaseKeeper(
		cdc,
		sdk.NewKVStoreKey("bank"),
		accountKeeper,
		map[string]bool{},
		authtypes.NewModuleAddress(govtypes.ModuleName).String(),
	)

	stakingKeeper := stakingkeeper.NewKeeper(
		cdc,
		sdk.NewKVStoreKey("staking"),
		accountKeeper,
		bankKeeper,
		authtypes.NewModuleAddress(govtypes.ModuleName).String(),
	)

	govConfig := govtypes.DefaultConfig()
	scopedGovkeeper := capabilityKeeper.ScopeToModule(govtypes.ModuleName)
	msgServiceRouter := baseapp.NewMsgServiceRouter()

	var keyshareKeeper *keeper.Keeper

	govKeeper := govkeeper.NewKeeper(
		cdc,
		sdk.NewKVStoreKey("gov"),
		accountKeeper,
		bankKeeper,
		stakingKeeper,
		msgServiceRouter,
		govConfig,
		authtypes.NewModuleAddress(govtypes.ModuleName).String(),
		keyshareChannelKeeper{},
		keysharePortKeeper{},
		scopedGovkeeper,
		keyshareconnectionKeeper{},
		keyshareKeeper,
	)

	pepKeeper, _ := PepKeeper(t)

	keyshareKeeper = keeper.NewKeeper(
		cdc,
		storeKey,
		memStoreKey,
		paramsSubspace,
		keyshareChannelKeeper{},
		keysharePortKeeper{},
		capabilityKeeper.ScopeToModule("keyshareScopedKeeper"),

		keyshareconnectionKeeper{},
		*pepKeeper,
		stakingKeeper,
		govKeeper,
	)

	ctx := sdk.NewContext(stateStore, tmproto.Header{}, false, log.NewNopLogger())

	// Initialize params
	keyshareKeeper.SetParams(ctx, types.DefaultParams())

	return keyshareKeeper, ctx
}
