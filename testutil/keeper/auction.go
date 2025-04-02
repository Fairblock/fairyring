package keeper

import (
	"testing"

	"github.com/cosmos/cosmos-sdk/codec/address"
	keeper2 "github.com/cosmos/cosmos-sdk/x/auth/keeper"
	bankkeeper "github.com/cosmos/cosmos-sdk/x/bank/keeper"
	banktypes "github.com/cosmos/cosmos-sdk/x/bank/types"

	"cosmossdk.io/log"
	"cosmossdk.io/store"
	"cosmossdk.io/store/metrics"
	storetypes "cosmossdk.io/store/types"
	cmtproto "github.com/cometbft/cometbft/proto/tendermint/types"
	dbm "github.com/cosmos/cosmos-db"
	"github.com/cosmos/cosmos-sdk/codec"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"
	"github.com/cosmos/cosmos-sdk/runtime"
	sdk "github.com/cosmos/cosmos-sdk/types"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"
	"github.com/stretchr/testify/require"

	"github.com/Fairblock/fairyring/x/auction/keeper"
	"github.com/Fairblock/fairyring/x/auction/types"
)

func AuctionKeeper(t testing.TB) (keeper.Keeper, sdk.Context) {
	storeKey := storetypes.NewKVStoreKey(types.StoreKey)

	db := dbm.NewMemDB()
	stateStore := store.NewCommitMultiStore(db, log.NewNopLogger(), metrics.NewNoOpMetrics())
	stateStore.MountStoreWithDB(storeKey, storetypes.StoreTypeIAVL, db)
	require.NoError(t, stateStore.LoadLatestVersion())

	registry := codectypes.NewInterfaceRegistry()
	cdc := codec.NewProtoCodec(registry)
	authority := authtypes.NewModuleAddress(govtypes.ModuleName)
	pep, _ := PepKeeper(t)

	ctx := sdk.NewContext(stateStore, cmtproto.Header{}, false, log.NewNopLogger())

	appCodec := codec.NewProtoCodec(registry)
	bankStoreKey := storetypes.NewKVStoreKey(banktypes.StoreKey)
	authStoreKey := storetypes.NewKVStoreKey(authtypes.StoreKey)

	accountKeeper := keeper2.NewAccountKeeper(
		appCodec,
		runtime.NewKVStoreService(authStoreKey),
		authtypes.ProtoBaseAccount,
		make(map[string][]string, 0),
		address.NewBech32Codec("cosmos"),
		sdk.Bech32PrefixAccAddr,
		authority.String(),
	)

	moduleAcc := authtypes.NewEmptyModuleAccount(types.ModuleName, authtypes.Minter, authtypes.Burner)
	accountKeeper.SetModuleAccount(ctx, moduleAcc)

	bankKeeper := bankkeeper.NewBaseKeeper(
		appCodec, runtime.NewKVStoreService(bankStoreKey),
		accountKeeper,
		make(map[string]bool, 0),
		authority.String(),
		log.NewNopLogger(),
	)

	k := keeper.NewKeeper(
		cdc,
		runtime.NewKVStoreService(storeKey),
		log.NewNopLogger(),
		authority.String(),
		bankKeeper,
		pep,
	)

	// Initialize params
	if err := k.SetParams(ctx, types.DefaultParams()); err != nil {
		panic(err)
	}

	return k, ctx
}
