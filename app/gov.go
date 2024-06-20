package app

import (
	storetypes "cosmossdk.io/store/types"
	"github.com/cosmos/cosmos-sdk/runtime"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	"github.com/cosmos/cosmos-sdk/x/gov"
	govkeeper "github.com/cosmos/cosmos-sdk/x/gov/keeper"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"
	govv1beta1 "github.com/cosmos/cosmos-sdk/x/gov/types/v1beta1"
	ibcfee "github.com/cosmos/ibc-go/v8/modules/apps/29-fee"
	porttypes "github.com/cosmos/ibc-go/v8/modules/core/05-port/types"
)

func (app *App) registerGovModule() (porttypes.IBCModule, error) {
	// set up non depinject support modules store keys
	if err := app.RegisterStores(
		storetypes.NewKVStoreKey(govtypes.StoreKey),
	); err != nil {
		panic(err)
	}

	scopedGovKeeper := app.CapabilityKeeper.ScopeToModule(govtypes.ModuleName)

	govConfig := govtypes.DefaultConfig()
	// The last arguments can contain custom message handlers, and custom query handlers,
	// if we want to allow any custom callbacks
	// availableCapabilities := strings.Join(AllCapabilities(), ",")
	govKeeper := govkeeper.NewKeeper(
		app.AppCodec(),
		runtime.NewKVStoreService(app.GetKey(govtypes.StoreKey)),
		app.AccountKeeper,
		app.BankKeeper,
		app.StakingKeeper,
		app.DistrKeeper,
		app.MsgServiceRouter(),
		govConfig,
		authtypes.NewModuleAddress(govtypes.ModuleName).String(),
		app.GetIBCKeeper,
		scopedGovKeeper,
	)

	govRouter := govv1beta1.NewRouter()
	govRouter.
		AddRoute(govtypes.RouterKey, govv1beta1.ProposalHandler)
	// .AddRoute(paramproposal.RouterKey, params.NewParamChangeProposalHandler(app.ParamsKeeper))

	govKeeper.SetLegacyRouter(govRouter)
	govKeeper = govKeeper.SetHooks(
		govtypes.NewMultiGovHooks(
		// register the governance hooks
		),
	)

	app.GovKeeper = govKeeper

	// register IBC modules
	if err := app.RegisterModules(
		gov.NewAppModule(
			app.AppCodec(),
			govKeeper,
			app.AccountKeeper,
			app.BankKeeper,
			app.GetSubspace(govtypes.ModuleName),
		)); err != nil {
		return nil, err
	}

	app.ScopedGovKeeper = scopedGovKeeper

	// Create fee enabled wasm ibc Stack
	var govStack porttypes.IBCModule
	govStack = gov.NewIBCModule(*app.GovKeeper)
	govStack = ibcfee.NewIBCMiddleware(govStack, app.IBCFeeKeeper)

	return govStack, nil
}
