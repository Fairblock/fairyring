package app

import (
	storetypes "cosmossdk.io/store/types"
	keysharemodulekeeper "github.com/Fairblock/fairyring/x/keyshare/keeper"
	keysharemodule "github.com/Fairblock/fairyring/x/keyshare/module"
	keysharemoduletypes "github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/runtime"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	ibcfee "github.com/cosmos/ibc-go/v8/modules/apps/29-fee"
	porttypes "github.com/cosmos/ibc-go/v8/modules/core/05-port/types"
)

// registerKeyshareModule register Keyshare keepers and non dependency inject modules.
func (app *App) registerKeyshareModule() (porttypes.IBCModule, error) {
	// set up non depinject support modules store keys
	if err := app.RegisterStores(
		storetypes.NewKVStoreKey(keysharemoduletypes.StoreKey),
	); err != nil {
		panic(err)
	}

	scopedKeyshareKeeper := app.CapabilityKeeper.ScopeToModule(keysharemoduletypes.ModuleName)

	// The last arguments can contain custom message handlers, and custom query handlers,
	// if we want to allow any custom callbacks
	// availableCapabilities := strings.Join(AllCapabilities(), ",")
	app.KeyshareKeeper = keysharemodulekeeper.NewKeeper(
		app.AppCodec(),
		runtime.NewKVStoreService(app.GetKey(keysharemoduletypes.StoreKey)),
		app.Logger(),
		authtypes.NewModuleAddress(keysharemoduletypes.ModuleName).String(),
		app.GetIBCKeeper,
		scopedKeyshareKeeper,
		app.AccountKeeper,
		app.BankKeeper,
		app.PepKeeper,
		app.SlashingKeeper,
		app.StakingKeeper,
		app.GovKeeper,
	)

	// register IBC modules
	if err := app.RegisterModules(
		keysharemodule.NewAppModule(
			app.AppCodec(),
			app.KeyshareKeeper,
			app.AccountKeeper,
			app.BankKeeper,
			app.PepKeeper,
			app.StakingKeeper,
		)); err != nil {
		return nil, err
	}

	app.ScopedKeyshareKeeper = scopedKeyshareKeeper

	// Create fee enabled wasm ibc Stack
	var keyshareStack porttypes.IBCModule
	keyshareStack = keysharemodule.NewIBCModule(app.KeyshareKeeper)
	keyshareStack = ibcfee.NewIBCMiddleware(keyshareStack, app.IBCFeeKeeper)

	return keyshareStack, nil
}
