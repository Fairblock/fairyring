package app

import (
	storetypes "cosmossdk.io/store/types"
	zkpmodulekeeper "github.com/Fairblock/fairyring/x/zkp/keeper"
	zkpmodule "github.com/Fairblock/fairyring/x/zkp/module"
	zkptypes "github.com/Fairblock/fairyring/x/zkp/types"
	"github.com/cosmos/cosmos-sdk/runtime"
)

// registerZkpModule register ZKP keepers and non dependency inject modules.
func (app *App) registerZkpModule() error {
	// set up non depinject support modules store keys
	if err := app.RegisterStores(
		storetypes.NewKVStoreKey(zkptypes.StoreKey),
	); err != nil {
		panic(err)
	}

	// The last arguments can contain custom message handlers, and custom query handlers,
	// if we want to allow any custom callbacks
	app.ZkpKeeper = zkpmodulekeeper.NewKeeper(
		app.AppCodec(),
		runtime.NewKVStoreService(app.GetKey(zkptypes.StoreKey)),
		app.Logger(),
	)

	// register modules
	if err := app.RegisterModules(
		zkpmodule.NewAppModule(
			app.AppCodec(),
			*app.ZkpKeeper,
		)); err != nil {
		return err
	}

	return nil
}

