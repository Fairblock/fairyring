package keeper

import (
	authkeeper "github.com/cosmos/cosmos-sdk/x/auth/keeper"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	bankkeeper "github.com/cosmos/cosmos-sdk/x/bank/keeper"
	stakingkeeper "github.com/cosmos/cosmos-sdk/x/staking/keeper"
	"testing"

	"fairyring/x/keyshare/keeper"
	"fairyring/x/keyshare/types"

	"github.com/cosmos/cosmos-sdk/codec"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"
	"github.com/cosmos/cosmos-sdk/store"
	storetypes "github.com/cosmos/cosmos-sdk/store/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	typesparams "github.com/cosmos/cosmos-sdk/x/params/types"
	"github.com/stretchr/testify/require"
	"github.com/tendermint/tendermint/libs/log"
	tmproto "github.com/tendermint/tendermint/proto/tendermint/types"
	tmdb "github.com/tendermint/tm-db"
)

func KeyshareKeeper(t testing.TB) (*keeper.Keeper, sdk.Context) {
	storeKey := sdk.NewKVStoreKey(types.StoreKey)
	memStoreKey := storetypes.NewMemoryStoreKey(types.MemStoreKey)

	db := tmdb.NewMemDB()
	stateStore := store.NewCommitMultiStore(db)
	stateStore.MountStoreWithDB(storeKey, storetypes.StoreTypeIAVL, db)
	stateStore.MountStoreWithDB(memStoreKey, storetypes.StoreTypeMemory, nil)
	require.NoError(t, stateStore.LoadLatestVersion())

	registry := codectypes.NewInterfaceRegistry()
	cdc := codec.NewProtoCodec(registry)

	paramsSubspace := typesparams.NewSubspace(cdc,
		types.Amino,
		storeKey,
		memStoreKey,
		"FairyringParams",
	)

	accountKeeper := authkeeper.NewAccountKeeper(
		cdc,
		sdk.NewKVStoreKey("acc"),
		typesparams.NewSubspace(cdc,
			types.Amino,
			storeKey,
			memStoreKey,
			"acc",
		),
		authtypes.ProtoBaseAccount,
		map[string][]string{},
		sdk.Bech32PrefixAccAddr,
	)

	bankKeeper := bankkeeper.NewBaseKeeper(
		cdc,
		sdk.NewKVStoreKey("bank"),
		accountKeeper,
		typesparams.NewSubspace(cdc,
			types.Amino,
			storeKey,
			memStoreKey,
			"bank",
		),
		map[string]bool{},
	)

	stakingKeeper := stakingkeeper.NewKeeper(
		cdc,
		sdk.NewKVStoreKey("staking"),
		accountKeeper,
		bankKeeper,
		typesparams.NewSubspace(cdc,
			types.Amino,
			storeKey,
			memStoreKey,
			"staking",
		),
	)

	pepKeeper, _ := PepKeeper(t)

	k := keeper.NewKeeper(
		cdc,
		storeKey,
		memStoreKey,
		paramsSubspace,
		*pepKeeper,
		stakingKeeper,
	)

	ctx := sdk.NewContext(stateStore, tmproto.Header{}, false, log.NewNopLogger())

	// Initialize params
	k.SetParams(ctx, types.DefaultParams())

	return k, ctx
}
