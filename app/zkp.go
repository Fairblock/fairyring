package app

import (
	storetypes "cosmossdk.io/store/types"
	zkpmodulekeeper "github.com/Fairblock/fairyring/x/zkp/keeper"
	zkpmodule "github.com/Fairblock/fairyring/x/zkp/module"
	zkptypes "github.com/Fairblock/fairyring/x/zkp/types"
	"github.com/cosmos/cosmos-sdk/runtime"
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
