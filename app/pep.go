package app

import (
	storetypes "cosmossdk.io/store/types"
	pepmodulekeeper "github.com/Fairblock/fairyring/x/pep/keeper"
	pepmodule "github.com/Fairblock/fairyring/x/pep/module"
	peptypes "github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/runtime"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	ibcfee "github.com/cosmos/ibc-go/v8/modules/apps/29-fee"
	porttypes "github.com/cosmos/ibc-go/v8/modules/core/05-port/types"
)

// registerPepModule register Pep keepers and non dependency inject modules.
func (app *App) registerPepModule() (porttypes.IBCModule, error) {
	// set up non depinject support modules store keys
	if err := app.RegisterStores(
		storetypes.NewKVStoreKey(peptypes.StoreKey),
	); err != nil {
		panic(err)
	}

	scopedPepKeeper := app.CapabilityKeeper.ScopeToModule(peptypes.ModuleName)

	// The last arguments can contain custom message handlers, and custom query handlers,
	// if we want to allow any custom callbacks
	// availableCapabilities := strings.Join(AllCapabilities(), ",")
	app.PepKeeper = pepmodulekeeper.NewKeeper(
		app.AppCodec(),
		runtime.NewKVStoreService(app.GetKey(peptypes.StoreKey)),
		app.Logger(),
		authtypes.NewModuleAddress(peptypes.ModuleName).String(),
		app.GetIBCKeeper,
		scopedPepKeeper,
		app.AccountKeeper,
		app.BankKeeper,
	)

	// register IBC modules
	if err := app.RegisterModules(
		pepmodule.NewAppModule(
			app.AppCodec(),
			app.PepKeeper,
			app.AccountKeeper,
			app.BankKeeper,
			app.MsgServiceRouter(),
			app.txConfig,
			app.SimCheck,
		)); err != nil {
		return nil, err
	}

	app.ScopedPepKeeper = scopedPepKeeper

	// Create fee enabled wasm ibc Stack
	var pepStack porttypes.IBCModule
	pepStack = pepmodule.NewIBCModule(app.PepKeeper)
	pepStack = ibcfee.NewIBCMiddleware(pepStack, app.IBCFeeKeeper)

	return pepStack, nil
}
