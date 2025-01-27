package app

import (
	storetypes "cosmossdk.io/store/types"
	auctionmodulekeeper "github.com/Fairblock/fairyring/x/auction/keeper"
	auction "github.com/Fairblock/fairyring/x/auction/module"
	auctionmoduletypes "github.com/Fairblock/fairyring/x/auction/types"
	"github.com/cosmos/cosmos-sdk/runtime"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
)

// registerAuctionModule register auction keepers and non dependency inject modules.
func (app *App) registerAuctionModule() error {
	// set up non depinject support modules store keys
	if err := app.RegisterStores(
		storetypes.NewKVStoreKey(auctionmoduletypes.StoreKey),
	); err != nil {
		panic(err)
	}

	scopedAuctionKeeper := app.CapabilityKeeper.ScopeToModule(auctionmoduletypes.ModuleName)

	// The last arguments can contain custom message handlers, and custom query handlers,
	// if we want to allow any custom callbacks
	// availableCapabilities := strings.Join(AllCapabilities(), ",")
	app.AuctionKeeper = auctionmodulekeeper.NewKeeper(
		app.AppCodec(),
		runtime.NewKVStoreService(app.GetKey(auctionmoduletypes.StoreKey)),
		app.Logger(),
		authtypes.NewModuleAddress(auctionmoduletypes.ModuleName).String(),
		app.PepKeeper,
	)

	if err := app.RegisterModules(
		auction.NewAppModule(
			app.AppCodec(),
			app.AuctionKeeper,
			app.AccountKeeper,
			app.BankKeeper,
		),
	); err != nil {
		return err
	}

	app.ScopedAuctionKeeper = scopedAuctionKeeper

	return nil
}
