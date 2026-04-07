package app

import (
	storetypes "cosmossdk.io/store/types"
	zkpmodulekeeper "github.com/Fairblock/fairyring/x/zkp/keeper"
	zkpmodule "github.com/Fairblock/fairyring/x/zkp/module"
	zkptypes "github.com/Fairblock/fairyring/x/zkp/types"
	"github.com/cosmos/cosmos-sdk/runtime"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"
)

func (app *App) registerZkpModule() error {
	if err := app.RegisterStores(
		storetypes.NewKVStoreKey(zkptypes.StoreKey),
	); err != nil {
		panic(err)
	}

	app.ZkpKeeper = zkpmodulekeeper.NewKeeper(
		app.AppCodec(),
		runtime.NewKVStoreService(app.GetKey(zkptypes.StoreKey)),
		app.Logger(),
		authtypes.NewModuleAddress(govtypes.ModuleName).String(),
	)

	if err := app.RegisterModules(
		zkpmodule.NewAppModule(
			app.AppCodec(),
			*app.ZkpKeeper,
		)); err != nil {
		return err
	}

	return nil
}

