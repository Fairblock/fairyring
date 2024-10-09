package keeper

import (
	"cosmossdk.io/log"
	"cosmossdk.io/store"
	"cosmossdk.io/store/metrics"
	storetypes "cosmossdk.io/store/types"
	pepkeeper "github.com/Fairblock/fairyring/x/pep/keeper"
	peptypes "github.com/Fairblock/fairyring/x/pep/types"
	cmtproto "github.com/cometbft/cometbft/proto/tendermint/types"
	dbm "github.com/cosmos/cosmos-db"
	"github.com/cosmos/cosmos-sdk/codec"
	"github.com/cosmos/cosmos-sdk/codec/address"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"
	"github.com/cosmos/cosmos-sdk/runtime"
	simtestutil "github.com/cosmos/cosmos-sdk/testutil/sims"
	sdk "github.com/cosmos/cosmos-sdk/types"
	keeper2 "github.com/cosmos/cosmos-sdk/x/auth/keeper"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	bankkeeper "github.com/cosmos/cosmos-sdk/x/bank/keeper"
	banktypes "github.com/cosmos/cosmos-sdk/x/bank/types"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"
	stakingkeeper "github.com/cosmos/cosmos-sdk/x/staking/keeper"
	stakingtypes "github.com/cosmos/cosmos-sdk/x/staking/types"
	capabilitykeeper "github.com/cosmos/ibc-go/modules/capability/keeper"
	portkeeper "github.com/cosmos/ibc-go/v8/modules/core/05-port/keeper"
	ibcexported "github.com/cosmos/ibc-go/v8/modules/core/exported"
	ibckeeper "github.com/cosmos/ibc-go/v8/modules/core/keeper"
	"github.com/stretchr/testify/require"
	"testing"

	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
)

var (
	bondedAcc    = authtypes.NewEmptyModuleAccount(stakingtypes.BondedPoolName)
	notBondedAcc = authtypes.NewEmptyModuleAccount(stakingtypes.NotBondedPoolName)
	PKs          = simtestutil.CreateTestPubKeys(500)
)

func KeyshareKeeper(t testing.TB) (keeper.Keeper, sdk.Context, pepkeeper.Keeper, *stakingkeeper.Keeper) {
	storeKey := storetypes.NewKVStoreKey(types.StoreKey)
	pepStoreKey := storetypes.NewKVStoreKey(peptypes.StoreKey)
	stakingStoreKey := storetypes.NewKVStoreKey(stakingtypes.StoreKey)
	memStoreKey := storetypes.NewMemoryStoreKey(types.MemStoreKey)
	pepMemStoreKey := storetypes.NewMemoryStoreKey(peptypes.MemStoreKey)
	bankStoreKey := storetypes.NewKVStoreKey(banktypes.StoreKey)
	authStoreKey := storetypes.NewKVStoreKey(authtypes.StoreKey)

	db := dbm.NewMemDB()
	stateStore := store.NewCommitMultiStore(db, log.NewNopLogger(), metrics.NewNoOpMetrics())
	stateStore.MountStoreWithDB(storeKey, storetypes.StoreTypeIAVL, db)
	stateStore.MountStoreWithDB(pepStoreKey, storetypes.StoreTypeIAVL, db)
	stateStore.MountStoreWithDB(stakingStoreKey, storetypes.StoreTypeIAVL, db)
	stateStore.MountStoreWithDB(memStoreKey, storetypes.StoreTypeMemory, nil)
	stateStore.MountStoreWithDB(pepMemStoreKey, storetypes.StoreTypeMemory, nil)
	stateStore.MountStoreWithDB(bankStoreKey, storetypes.StoreTypeIAVL, db)
	stateStore.MountStoreWithDB(authStoreKey, storetypes.StoreTypeIAVL, db)
	require.NoError(t, stateStore.LoadLatestVersion())

	registry := codectypes.NewInterfaceRegistry()
	appCodec := codec.NewProtoCodec(registry)

	capabilityKeeper := capabilitykeeper.NewKeeper(appCodec, storeKey, memStoreKey)
	authority := authtypes.NewModuleAddress(govtypes.ModuleName)
	scopedKeeper := capabilityKeeper.ScopeToModule(ibcexported.ModuleName)
	portKeeper := portkeeper.NewKeeper(scopedKeeper)

	pepCapabilityKeeper := capabilitykeeper.NewKeeper(appCodec, pepStoreKey, pepMemStoreKey)
	pepScopedKeeper := pepCapabilityKeeper.ScopeToModule(ibcexported.ModuleName)
	pepPortKeeper := portkeeper.NewKeeper(pepScopedKeeper)

	accountKeeper := keeper2.NewAccountKeeper(
		appCodec,
		runtime.NewKVStoreService(authStoreKey),
		authtypes.ProtoBaseAccount,
		make(map[string][]string, 0),
		address.NewBech32Codec("cosmos"),
		sdk.Bech32PrefixAccAddr,
		authority.String(),
	)

	bankKeeper := bankkeeper.NewBaseKeeper(
		appCodec, runtime.NewKVStoreService(bankStoreKey),
		accountKeeper,
		make(map[string]bool, 0),
		authority.String(),
		log.NewNopLogger(),
	)

	pepKeeper := pepkeeper.NewKeeper(
		appCodec,
		runtime.NewKVStoreService(pepStoreKey),
		log.NewNopLogger(),
		authority.String(),
		func() *ibckeeper.Keeper {
			return &ibckeeper.Keeper{
				PortKeeper: &pepPortKeeper,
			}
		},
		pepScopedKeeper,
		accountKeeper,
		bankKeeper,
		nil,
		nil,
		nil,
		nil,
	)

	stakingKeeper := stakingkeeper.NewKeeper(
		appCodec,
		runtime.NewKVStoreService(stakingStoreKey),
		accountKeeper,
		bankKeeper,
		authority.String(),
		address.NewBech32Codec("cosmosvaloper"),
		address.NewBech32Codec("cosmosvalcons"),
	)

	k := keeper.NewKeeper(
		appCodec,
		runtime.NewKVStoreService(storeKey),
		log.NewNopLogger(),
		authority.String(),
		func() *ibckeeper.Keeper {
			return &ibckeeper.Keeper{
				PortKeeper: &portKeeper,
			}
		},
		scopedKeeper,
		//func(string) capabilitykeeper.ScopedKeeper {
		//	return scopeModule
		//},
		accountKeeper,
		nil,
		pepKeeper,
		nil,
		stakingKeeper,
		nil,
	)

	ctx := sdk.NewContext(stateStore, cmtproto.Header{}, false, log.NewNopLogger())

	// Initialize params
	if err := k.SetParams(ctx, types.DefaultParams()); err != nil {
		panic(err)
	}
	// Initialize params
	if err := pepKeeper.SetParams(ctx, peptypes.DefaultParams()); err != nil {
		panic(err)
	}
	if err := stakingKeeper.SetParams(ctx, stakingtypes.DefaultParams()); err != nil {
		panic(err)
	}

	return k, ctx, pepKeeper, stakingKeeper
}
