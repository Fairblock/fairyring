package app

import (
	_ "cosmossdk.io/api/cosmos/tx/config/v1" // import for side-effects
	"cosmossdk.io/depinject"
	"cosmossdk.io/log"
	storetypes "cosmossdk.io/store/types"
	_ "cosmossdk.io/x/circuit" // import for side-effects
	circuitkeeper "cosmossdk.io/x/circuit/keeper"
	_ "cosmossdk.io/x/evidence" // import for side-effects
	evidencekeeper "cosmossdk.io/x/evidence/keeper"
	feegrantkeeper "cosmossdk.io/x/feegrant/keeper"
	_ "cosmossdk.io/x/feegrant/module" // import for side-effects
	nftkeeper "cosmossdk.io/x/nft/keeper"
	_ "cosmossdk.io/x/nft/module" // import for side-effects
	_ "cosmossdk.io/x/upgrade"    // import for side-effects
	upgradekeeper "cosmossdk.io/x/upgrade/keeper"
	"encoding/json"
	abci "github.com/cometbft/cometbft/abci/types"
	tmproto "github.com/cometbft/cometbft/proto/tendermint/types"
	dbm "github.com/cosmos/cosmos-db"
	"github.com/cosmos/cosmos-sdk/baseapp"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/grpc/cmtservice"
	nodeservice "github.com/cosmos/cosmos-sdk/client/grpc/node"
	"github.com/cosmos/cosmos-sdk/codec"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"
	"github.com/cosmos/cosmos-sdk/runtime"
	"github.com/cosmos/cosmos-sdk/server"
	"github.com/cosmos/cosmos-sdk/server/api"
	"github.com/cosmos/cosmos-sdk/server/config"
	servertypes "github.com/cosmos/cosmos-sdk/server/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	"github.com/cosmos/cosmos-sdk/x/auth"
	_ "github.com/cosmos/cosmos-sdk/x/auth" // import for side-effects
	authkeeper "github.com/cosmos/cosmos-sdk/x/auth/keeper"
	authsims "github.com/cosmos/cosmos-sdk/x/auth/simulation"
	authtx "github.com/cosmos/cosmos-sdk/x/auth/tx"
	_ "github.com/cosmos/cosmos-sdk/x/auth/tx/config" // import for side-effects
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	_ "github.com/cosmos/cosmos-sdk/x/auth/vesting" // import for side-effects
	authzkeeper "github.com/cosmos/cosmos-sdk/x/authz/keeper"
	_ "github.com/cosmos/cosmos-sdk/x/authz/module" // import for side-effects
	_ "github.com/cosmos/cosmos-sdk/x/bank"         // import for side-effects
	bankkeeper "github.com/cosmos/cosmos-sdk/x/bank/keeper"
	banktypes "github.com/cosmos/cosmos-sdk/x/bank/types"
	_ "github.com/cosmos/cosmos-sdk/x/consensus" // import for side-effects
	consensuskeeper "github.com/cosmos/cosmos-sdk/x/consensus/keeper"
	_ "github.com/cosmos/cosmos-sdk/x/crisis" // import for side-effects
	crisiskeeper "github.com/cosmos/cosmos-sdk/x/crisis/keeper"
	crisistypes "github.com/cosmos/cosmos-sdk/x/crisis/types"
	_ "github.com/cosmos/cosmos-sdk/x/distribution" // import for side-effects
	distrkeeper "github.com/cosmos/cosmos-sdk/x/distribution/keeper"
	distrtypes "github.com/cosmos/cosmos-sdk/x/distribution/types"
	"github.com/cosmos/cosmos-sdk/x/genutil"
	genutiltypes "github.com/cosmos/cosmos-sdk/x/genutil/types"
	"github.com/cosmos/cosmos-sdk/x/gov"
	govclient "github.com/cosmos/cosmos-sdk/x/gov/client"
	govkeeper "github.com/cosmos/cosmos-sdk/x/gov/keeper"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"
	govv1 "github.com/cosmos/cosmos-sdk/x/gov/types/v1"
	groupkeeper "github.com/cosmos/cosmos-sdk/x/group/keeper"
	_ "github.com/cosmos/cosmos-sdk/x/group/module" // import for side-effects
	_ "github.com/cosmos/cosmos-sdk/x/mint"         // import for side-effects
	mintkeeper "github.com/cosmos/cosmos-sdk/x/mint/keeper"
	minttypes "github.com/cosmos/cosmos-sdk/x/mint/types"
	_ "github.com/cosmos/cosmos-sdk/x/params" // import for side-effects
	paramsclient "github.com/cosmos/cosmos-sdk/x/params/client"
	paramskeeper "github.com/cosmos/cosmos-sdk/x/params/keeper"
	paramstypes "github.com/cosmos/cosmos-sdk/x/params/types"
	_ "github.com/cosmos/cosmos-sdk/x/slashing" // import for side-effects
	slashingkeeper "github.com/cosmos/cosmos-sdk/x/slashing/keeper"
	slashingtypes "github.com/cosmos/cosmos-sdk/x/slashing/types"
	_ "github.com/cosmos/cosmos-sdk/x/staking" // import for side-effects
	stakingkeeper "github.com/cosmos/cosmos-sdk/x/staking/keeper"
	stakingtypes "github.com/cosmos/cosmos-sdk/x/staking/types"
	_ "github.com/cosmos/ibc-go/modules/capability" // import for side-effects
	capabilitykeeper "github.com/cosmos/ibc-go/modules/capability/keeper"
	_ "github.com/cosmos/ibc-go/v8/modules/apps/27-interchain-accounts" // import for side-effects
	icacontrollerkeeper "github.com/cosmos/ibc-go/v8/modules/apps/27-interchain-accounts/controller/keeper"
	icacontrollertypes "github.com/cosmos/ibc-go/v8/modules/apps/27-interchain-accounts/controller/types"
	icahostkeeper "github.com/cosmos/ibc-go/v8/modules/apps/27-interchain-accounts/host/keeper"
	icahosttypes "github.com/cosmos/ibc-go/v8/modules/apps/27-interchain-accounts/host/types"
	_ "github.com/cosmos/ibc-go/v8/modules/apps/29-fee" // import for side-effects
	ibctransferkeeper "github.com/cosmos/ibc-go/v8/modules/apps/transfer/keeper"
	ibctransfertypes "github.com/cosmos/ibc-go/v8/modules/apps/transfer/types"
	ibcexported "github.com/cosmos/ibc-go/v8/modules/core/exported"
	ibckeeper "github.com/cosmos/ibc-go/v8/modules/core/keeper"
	ibctestingtypes "github.com/cosmos/ibc-go/v8/testing/types"
	"io"
	"os"
	"path/filepath"
	"sort"

	wasmkeeper "github.com/CosmWasm/wasmd/x/wasm/keeper"
	blockbusterabci "github.com/Fairblock/fairyring/blockbuster/abci"
	keysharemodulekeeper "github.com/Fairblock/fairyring/x/keyshare/keeper"
	keysharemoduletypes "github.com/Fairblock/fairyring/x/keyshare/types"
	pepmodulekeeper "github.com/Fairblock/fairyring/x/pep/keeper"
	pepmoduletypes "github.com/Fairblock/fairyring/x/pep/types"
	ibcfeekeeper "github.com/cosmos/ibc-go/v8/modules/apps/29-fee/keeper"

	// this line is used by starport scaffolding # stargate/app/moduleImport

	"github.com/Fairblock/fairyring/docs"
)

const (
	AccountAddressPrefix = "fairy"
	Name                 = "fairyring"
	ChainID              = "fairyring-tesnet-1"
)

// this line is used by starport scaffolding # stargate/wasm/app/enabledProposals

func getGovProposalHandlers() []govclient.ProposalHandler {
	var govProposalHandlers []govclient.ProposalHandler
	// this line is used by starport scaffolding # stargate/app/govProposalHandlers

	govProposalHandlers = append(govProposalHandlers,
		paramsclient.ProposalHandler,
		// this line is used by starport scaffolding # stargate/app/govProposalHandler
	)

	return govProposalHandlers
}

var (
	// DefaultNodeHome default home directories for the application daemon
	DefaultNodeHome string

	// EmptyWasmOpts defines a type alias for a list of wasm options.
	EmptyWasmOpts []wasmkeeper.Option
)

var (
	_ runtime.AppI            = (*App)(nil)
	_ servertypes.Application = (*App)(nil)
)

func init() {
	userHomeDir, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}

	DefaultNodeHome = filepath.Join(userHomeDir, "."+Name)
}

// App extends an ABCI application, but with most of its parameters exported.
// They are exported for convenience in creating helper functions, as object
// capabilities aren't needed for testing.
type App struct {
	*runtime.App

	cdc               *codec.LegacyAmino
	appCodec          codec.Codec
	txConfig          client.TxConfig
	interfaceRegistry codectypes.InterfaceRegistry

	invCheckPeriod uint

	// keys to access the substores
	keys    map[string]*storetypes.KVStoreKey
	tkeys   map[string]*storetypes.TransientStoreKey
	memKeys map[string]*storetypes.MemoryStoreKey

	// keepers
	AccountKeeper         authkeeper.AccountKeeper
	BankKeeper            bankkeeper.Keeper
	StakingKeeper         *stakingkeeper.Keeper
	DistrKeeper           distrkeeper.Keeper
	ConsensusParamsKeeper consensuskeeper.Keeper

	SlashingKeeper slashingkeeper.Keeper
	MintKeeper     mintkeeper.Keeper
	GovKeeper      *govkeeper.Keeper
	CrisisKeeper   *crisiskeeper.Keeper
	UpgradeKeeper  *upgradekeeper.Keeper
	ParamsKeeper   paramskeeper.Keeper
	AuthzKeeper    authzkeeper.Keeper
	EvidenceKeeper evidencekeeper.Keeper
	FeeGrantKeeper feegrantkeeper.Keeper
	GroupKeeper    groupkeeper.Keeper
	CircuitKeeper  circuitkeeper.Keeper
	NFTKeeper      nftkeeper.Keeper

	IBCKeeper           *ibckeeper.Keeper // IBC Keeper must be a pointer in the app, so we can SetRouter on it correctly
	CapabilityKeeper    *capabilitykeeper.Keeper
	IBCFeeKeeper        ibcfeekeeper.Keeper
	ICAControllerKeeper icacontrollerkeeper.Keeper
	ICAHostKeeper       icahostkeeper.Keeper
	TransferKeeper      ibctransferkeeper.Keeper

	WasmKeeper     wasmkeeper.Keeper
	KeyshareKeeper keysharemodulekeeper.Keeper
	PepKeeper      pepmodulekeeper.Keeper

	// Scoped IBC
	ScopedIBCKeeper           capabilitykeeper.ScopedKeeper
	ScopedIBCTransferKeeper   capabilitykeeper.ScopedKeeper
	ScopedICAControllerKeeper capabilitykeeper.ScopedKeeper
	ScopedICAHostKeeper       capabilitykeeper.ScopedKeeper
	ScopedPepKeeper           capabilitykeeper.ScopedKeeper
	ScopedKeyshareKeeper      capabilitykeeper.ScopedKeeper
	ScopedWasmKeeper          capabilitykeeper.ScopedKeeper
	ScopedGovkeeper           capabilitykeeper.ScopedKeeper

	// the module manager
	ModuleManager      *module.Manager
	BasicModuleManager module.BasicManager

	// this line is used by starport scaffolding # stargate/app/keeperDeclaration

	// sm is the simulation manager
	sm           *module.SimulationManager
	configurator module.Configurator

	// Custom checkTx handler
	checkTxHandler blockbusterabci.CheckTx
}

// AppConfig returns the default app config.
func AppConfig() depinject.Config {
	return depinject.Configs(
		appConfig,
		// Loads the app config from a YAML file.
		// appconfig.LoadYAML(AppConfigYAML),
		depinject.Supply(
			// supply custom module basics
			map[string]module.AppModuleBasic{
				genutiltypes.ModuleName: genutil.NewAppModuleBasic(genutiltypes.DefaultMessageValidator),
				govtypes.ModuleName:     gov.NewAppModuleBasic(getGovProposalHandlers()),
				// this line is used by starport scaffolding # stargate/appConfig/moduleBasic
			},
		),
	)
}

func New(
	logger log.Logger,
	db dbm.DB,
	traceStore io.Writer,
	loadLatest bool,
	appOpts servertypes.AppOptions,
	baseAppOptions ...func(*baseapp.BaseApp),
) (*App, error) {
	var (
		app        = &App{}
		appBuilder *runtime.AppBuilder

		// merge the AppConfig and other configuration in one config
		appConfig = depinject.Configs(
			AppConfig(),
			depinject.Supply(
				// Supply the application options
				appOpts,
				// Supply with IBC keeper getter for the IBC modules with App Wiring.
				// The IBC Keeper cannot be passed because it has not been initiated yet.
				// Passing the getter, the app IBC Keeper will always be accessible.
				// This needs to be removed after IBC supports App Wiring.
				app.GetIBCKeeper,
				app.GetCapabilityScopedKeeper,
				app.SimCheck,
				// Supply the logger
				logger,

				// ADVANCED CONFIGURATION
				//
				// AUTH
				//
				// For providing a custom function required in auth to generate custom account types
				// add it below. By default the auth module uses simulation.RandomGenesisAccounts.
				//
				// authtypes.RandomGenesisAccountsFn(simulation.RandomGenesisAccounts),
				//
				// For providing a custom a base account type add it below.
				// By default the auth module uses authtypes.ProtoBaseAccount().
				//
				// func() sdk.AccountI { return authtypes.ProtoBaseAccount() },
				//
				// For providing a different address codec, add it below.
				// By default the auth module uses a Bech32 address codec,
				// with the prefix defined in the auth module configuration.
				//
				// func() address.Codec { return <- custom address codec type -> }

				//
				// STAKING
				//
				// For provinding a different validator and consensus address codec, add it below.
				// By default the staking module uses the bech32 prefix provided in the auth config,
				// and appends "valoper" and "valcons" for validator and consensus addresses respectively.
				// When providing a custom address codec in auth, custom address codecs must be provided here as well.
				//
				// func() runtime.ValidatorAddressCodec { return <- custom validator address codec type -> }
				// func() runtime.ConsensusAddressCodec { return <- custom consensus address codec type -> }

				//
				// MINT
				//

				// For providing a custom inflation function for x/mint add here your
				// custom function that implements the minttypes.InflationCalculationFn
				// interface.
			),
		)
	)

	if err := depinject.Inject(appConfig,
		&appBuilder,
		&app.appCodec,
		&app.cdc,
		&app.txConfig,
		&app.interfaceRegistry,
		&app.AccountKeeper,
		&app.BankKeeper,
		&app.StakingKeeper,
		&app.DistrKeeper,
		&app.ConsensusParamsKeeper,
		&app.SlashingKeeper,
		&app.MintKeeper,
		&app.GovKeeper,
		&app.CrisisKeeper,
		&app.UpgradeKeeper,
		&app.ParamsKeeper,
		&app.AuthzKeeper,
		&app.EvidenceKeeper,
		&app.FeeGrantKeeper,
		&app.NFTKeeper,
		&app.GroupKeeper,
		&app.CircuitKeeper,
		&app.KeyshareKeeper,
		&app.PepKeeper,
		// this line is used by starport scaffolding # stargate/app/keeperDefinition
	); err != nil {
		panic(err)
	}

	// Below we could construct and set an application specific mempool and
	// ABCI 1.0 PrepareProposal and ProcessProposal handlers. These defaults are
	// already set in the SDK's BaseApp, this shows an example of how to override
	// them.
	//
	// Example:
	//
	// app.App = appBuilder.Build(...)
	// nonceMempool := mempool.NewSenderNonceMempool()
	// abciPropHandler := NewDefaultProposalHandler(nonceMempool, app.App.BaseApp)
	//
	// app.App.BaseApp.SetMempool(nonceMempool)
	// app.App.BaseApp.SetPrepareProposal(abciPropHandler.PrepareProposalHandler())
	// app.App.BaseApp.SetProcessProposal(abciPropHandler.ProcessProposalHandler())
	//
	// Alternatively, you can construct BaseApp options, append those to
	// baseAppOptions and pass them to the appBuilder.
	//
	// Example:
	//
	// prepareOpt = func(app *baseapp.BaseApp) {
	// 	abciPropHandler := baseapp.NewDefaultProposalHandler(nonceMempool, app)
	// 	app.SetPrepareProposal(abciPropHandler.PrepareProposalHandler())
	// }
	// baseAppOptions = append(baseAppOptions, prepareOpt)
	//
	// create and set vote extension handler
	// voteExtOp := func(bApp *baseapp.BaseApp) {
	// 	voteExtHandler := NewVoteExtensionHandler()
	// 	voteExtHandler.SetHandlers(bApp)
	// }

	app.App = appBuilder.Build(db, traceStore, baseAppOptions...)

	// Register legacy modules
	if err := app.registerIBCModules(appOpts); err != nil {
		return nil, err
	}

	// register streaming services
	if err := app.RegisterStreamingServices(appOpts, app.kvStoreKeys()); err != nil {
		return nil, err
	}

	/****  Module Options ****/

	app.ModuleManager.RegisterInvariants(app.CrisisKeeper)

	// create the simulation manager and define the order of the modules for deterministic simulations
	//
	// NOTE: this is not required apps that don't use the simulator for fuzz testing transactions
	overrideModules := map[string]module.AppModuleSimulation{
		authtypes.ModuleName: auth.NewAppModule(app.appCodec, app.AccountKeeper, authsims.RandomGenesisAccounts, app.GetSubspace(authtypes.ModuleName)),
	}
	app.sm = module.NewSimulationManagerFromAppModules(app.ModuleManager.Modules, overrideModules)
	app.sm.RegisterStoreDecoders()

	// A custom InitChainer can be set if extra pre-init-genesis logic is required.
	// By default, when using app wiring enabled module, this is not required.
	// For instance, the upgrade module will set automatically the module version map in its init genesis thanks to app wiring.
	// However, when registering a module manually (i.e. that does not support app wiring), the module version map
	// must be set manually as follow. The upgrade module will de-duplicate the module version map.
	//
	// app.SetInitChainer(func(ctx sdk.Context, req *abci.RequestInitChain) (*abci.ResponseInitChain, error) {
	// 	app.UpgradeKeeper.SetModuleVersionMap(ctx, app.ModuleManager.GetVersionMap())
	// 	return app.App.InitChainer(ctx, req)
	// })

	if err := app.Load(loadLatest); err != nil {
		return nil, err
	}

	return app, app.WasmKeeper.InitializePinnedCodes(app.NewUncachedContext(true, tmproto.Header{}))

}

// New returns a reference to an initialized blockchain app
//func New(
//	logger log.Logger,
//	db dbm.DB,
//	traceStore io.Writer,
//	loadLatest bool,
//	appOpts servertypes.AppOptions,
//	wasmOpts []wasmkeeper.Option,
//	baseAppOptions ...func(*baseapp.BaseApp),
//) *App {
//	var (
//		app        = &App{}
//		appBuilder *runtime.AppBuilder
//
//		// merge the AppConfig and other configuration in one config
//		appConfig = depinject.Configs(
//			AppConfig(),
//			depinject.Supply(
//				// Supply the application options
//				appOpts,
//				// Supply with IBC keeper getter for the IBC modules with App Wiring.
//				// The IBC Keeper cannot be passed because it has not been initiated yet.
//				// Passing the getter, the app IBC Keeper will always be accessible.
//				// This needs to be removed after IBC supports App Wiring.
//				app.GetIBCKeeper,
//				app.GetCapabilityScopedKeeper,
//				app.SimCheck,
//				// Supply the logger
//				logger,
//
//				// ADVANCED CONFIGURATION
//				//
//				// AUTH
//				//
//				// For providing a custom function required in auth to generate custom account types
//				// add it below. By default the auth module uses simulation.RandomGenesisAccounts.
//				//
//				// authtypes.RandomGenesisAccountsFn(simulation.RandomGenesisAccounts),
//				//
//				// For providing a custom a base account type add it below.
//				// By default the auth module uses authtypes.ProtoBaseAccount().
//				//
//				// func() sdk.AccountI { return authtypes.ProtoBaseAccount() },
//				//
//				// For providing a different address codec, add it below.
//				// By default the auth module uses a Bech32 address codec,
//				// with the prefix defined in the auth module configuration.
//				//
//				// func() address.Codec { return <- custom address codec type -> }
//
//				//
//				// STAKING
//				//
//				// For provinding a different validator and consensus address codec, add it below.
//				// By default the staking module uses the bech32 prefix provided in the auth config,
//				// and appends "valoper" and "valcons" for validator and consensus addresses respectively.
//				// When providing a custom address codec in auth, custom address codecs must be provided here as well.
//				//
//				// func() runtime.ValidatorAddressCodec { return <- custom validator address codec type -> }
//				// func() runtime.ConsensusAddressCodec { return <- custom consensus address codec type -> }
//
//				//
//				// MINT
//				//
//
//				// For providing a custom inflation function for x/mint add here your
//				// custom function that implements the minttypes.InflationCalculationFn
//				// interface.
//			),
//		)
//	)
//
//	if err := depinject.Inject(appConfig,
//		&appBuilder,
//		&app.appCodec,
//		&app.cdc,
//		&app.txConfig,
//		&app.interfaceRegistry,
//		&app.AccountKeeper,
//		&app.BankKeeper,
//		&app.StakingKeeper,
//		&app.DistrKeeper,
//		&app.ConsensusParamsKeeper,
//		&app.SlashingKeeper,
//		&app.MintKeeper,
//		&app.GovKeeper,
//		&app.CrisisKeeper,
//		&app.UpgradeKeeper,
//		&app.ParamsKeeper,
//		&app.AuthzKeeper,
//		&app.EvidenceKeeper,
//		&app.FeeGrantKeeper,
//		&app.NFTKeeper,
//		&app.GroupKeeper,
//		&app.CircuitKeeper,
//		&app.KeyshareKeeper,
//		&app.PepKeeper,
//		// this line is used by starport scaffolding # stargate/app/keeperDefinition
//	); err != nil {
//		panic(err)
//	}
//
//	app.App = appBuilder.Build(db, traceStore, baseAppOptions...)
//
//	// Register legacy modules
//	if err := app.registerIBCModules(appOpts); err != nil {
//		panic(err)
//	}
//
//	interfaceRegistry, err := codectypes.NewInterfaceRegistryWithOptions(codectypes.InterfaceRegistryOptions{
//		ProtoFiles: proto.HybridResolver,
//		SigningOptions: signing.Options{
//			AddressCodec: address.Bech32Codec{
//				Bech32Prefix: sdk.GetConfig().GetBech32AccountAddrPrefix(),
//			},
//			ValidatorAddressCodec: address.Bech32Codec{
//				Bech32Prefix: sdk.GetConfig().GetBech32ValidatorAddrPrefix(),
//			},
//		},
//	})
//	if err != nil {
//		panic(err)
//	}
//
//	appCodec := codec.NewProtoCodec(interfaceRegistry)
//	cdc := codec.NewLegacyAmino()
//	txConfig := authtx.NewTxConfig(appCodec, authtx.DefaultSignModes)
//
//	std.RegisterLegacyAminoCodec(cdc)
//	std.RegisterInterfaces(interfaceRegistry)
//
//	bApp := baseapp.NewBaseApp(Name, logger, db, txConfig.TxDecoder(), baseAppOptions...)
//	bApp.SetCommitMultiStoreTracer(traceStore)
//	bApp.SetVersion(version.Version)
//	bApp.SetInterfaceRegistry(interfaceRegistry)
//	bApp.SetTxEncoder(txConfig.TxEncoder())
//
//	keys := storetypes.NewKVStoreKeys(
//		authtypes.StoreKey, authz.ModuleName, banktypes.StoreKey, stakingtypes.StoreKey,
//		crisistypes.StoreKey, minttypes.StoreKey, distrtypes.StoreKey, slashingtypes.StoreKey,
//		govtypes.StoreKey, paramstypes.StoreKey, ibcexported.StoreKey, upgradetypes.StoreKey,
//		feegrant.StoreKey, evidencetypes.StoreKey, ibctransfertypes.StoreKey, icahosttypes.StoreKey,
//		capabilitytypes.StoreKey, group.StoreKey, icacontrollertypes.StoreKey, consensusparamtypes.StoreKey,
//		keysharemoduletypes.StoreKey, nftkeeper.StoreKey,
//		pepmoduletypes.StoreKey,
//		wasmtypes.StoreKey,
//		// this line is used by starport scaffolding # stargate/app/storeKey
//	)
//	tkeys := storetypes.NewTransientStoreKeys(paramstypes.TStoreKey)
//	memKeys := storetypes.NewMemoryStoreKeys(capabilitytypes.MemStoreKey)
//	//
//	//invCheckPeriod := cast.ToUint(appOpts.Get(server.FlagInvCheckPeriod))
//
//	//app = &App{
//	//	BaseApp:           bApp,
//	//	cdc:               cdc,
//	//	appCodec:          appCodec,
//	//	interfaceRegistry: interfaceRegistry,
//	//	txConfig:          txConfig,
//	//	invCheckPeriod:    invCheckPeriod,
//	//	keys:              keys,
//	//	tkeys:             tkeys,
//	//	memKeys:           memKeys,
//	//}
//
//	//app.ParamsKeeper = initParamsKeeper(
//	//	appCodec,
//	//	cdc,
//	//	keys[paramstypes.StoreKey],
//	//	tkeys[paramstypes.TStoreKey],
//	//)
//	//
//	//// set the BaseApp's parameter store
//	//app.ConsensusParamsKeeper = consensuskeeper.NewKeeper(
//	//	appCodec,
//	//	runtime.NewKVStoreService(keys[consensusparamtypes.StoreKey]),
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//	runtime.EventService{},
//	//)
//	//bApp.SetParamStore(app.ConsensusParamsKeeper.ParamsStore)
//	//
//	//// add capability keeper and ScopeToModule for ibc module
//	//app.CapabilityKeeper = capabilitykeeper.NewKeeper(
//	//	appCodec,
//	//	keys[capabilitytypes.StoreKey],
//	//	memKeys[capabilitytypes.MemStoreKey],
//	//)
//
//	// grant capabilities for the ibc and ibc-transfer modules
//	//scopedIBCKeeper := app.CapabilityKeeper.ScopeToModule(ibcexported.ModuleName)
//	//scopedICAHostKeeper := app.CapabilityKeeper.ScopeToModule(icahosttypes.SubModuleName)
//	//scopedICAControllerKeeper := app.CapabilityKeeper.ScopeToModule(icacontrollertypes.SubModuleName)
//	//scopedTransferKeeper := app.CapabilityKeeper.ScopeToModule(ibctransfertypes.ModuleName)
//	//scopedWasmKeeper := app.CapabilityKeeper.ScopeToModule(wasmtypes.ModuleName)
//	//scopedGovkeeper := app.CapabilityKeeper.ScopeToModule(govtypes.ModuleName)
//	// app.CapabilityKeeper.Seal()
//
//	// this line is used by starport scaffolding # stargate/app/scopedKeeper
//
//	// add keepers
//	//app.AccountKeeper = authkeeper.NewAccountKeeper(
//	//	appCodec,
//	//	runtime.NewKVStoreService(keys[authtypes.StoreKey]),
//	//	authtypes.ProtoBaseAccount,
//	//	maccPerms,
//	//	authcodec.NewBech32Codec(sdk.GetConfig().GetBech32AccountAddrPrefix()),
//	//	sdk.GetConfig().GetBech32AccountAddrPrefix(),
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//)
//	//app.BankKeeper = bankkeeper.NewBaseKeeper(
//	//	appCodec,
//	//	runtime.NewKVStoreService(keys[banktypes.StoreKey]),
//	//	app.AccountKeeper,
//	//	BlockedAddresses(),
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//	logger,
//	//)
//
//	// optional: enable sign mode textual by overwriting the default tx config (after setting the bank keeper)
//	// enabledSignModes := append(tx.DefaultSignModes, sigtypes.SignMode_SIGN_MODE_TEXTUAL)
//	// txConfigOpts := tx.ConfigOptions{
//	//	 EnabledSignModes:           enabledSignModes,
//	//	 TextualCoinMetadataQueryFn: txmodule.NewBankKeeperCoinMetadataQueryFn(app.BankKeeper),
//	// }
//	// txConfig, err := tx.NewTxConfigWithOptions(
//	// 	 appCodec,
//	// 	 txConfigOpts,
//	// )
//	// if err != nil {
//	//	 panic(err)
//	// }
//	// app.txConfig = txConfig
//
//	//app.StakingKeeper = stakingkeeper.NewKeeper(
//	//	appCodec,
//	//	runtime.NewKVStoreService(keys[stakingtypes.StoreKey]),
//	//	app.AccountKeeper,
//	//	app.BankKeeper,
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//	authcodec.NewBech32Codec(sdk.GetConfig().GetBech32ValidatorAddrPrefix()),
//	//	authcodec.NewBech32Codec(sdk.GetConfig().GetBech32ConsensusAddrPrefix()),
//	//)
//	//app.MintKeeper = mintkeeper.NewKeeper(
//	//	appCodec,
//	//	runtime.NewKVStoreService(keys[minttypes.StoreKey]),
//	//	app.StakingKeeper,
//	//	app.AccountKeeper,
//	//	app.BankKeeper,
//	//	authtypes.FeeCollectorName,
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//)
//	//
//	//app.DistrKeeper = distrkeeper.NewKeeper(
//	//	appCodec,
//	//	runtime.NewKVStoreService(keys[distrtypes.StoreKey]),
//	//	app.AccountKeeper,
//	//	app.BankKeeper,
//	//	app.StakingKeeper,
//	//	authtypes.FeeCollectorName,
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//)
//	//
//	//app.SlashingKeeper = slashingkeeper.NewKeeper(
//	//	appCodec,
//	//	cdc,
//	//	runtime.NewKVStoreService(keys[slashingtypes.StoreKey]),
//	//	app.StakingKeeper,
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//)
//	//
//	//app.CrisisKeeper = crisiskeeper.NewKeeper(
//	//	appCodec,
//	//	runtime.NewKVStoreService(keys[crisistypes.StoreKey]),
//	//	invCheckPeriod,
//	//	app.BankKeeper,
//	//	authtypes.FeeCollectorName,
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//	app.AccountKeeper.AddressCodec(),
//	//)
//	//
//	//app.FeeGrantKeeper = feegrantkeeper.NewKeeper(appCodec, runtime.NewKVStoreService(keys[feegrant.StoreKey]), app.AccountKeeper)
//
//	// register the staking hooks
//	// NOTE: stakingKeeper above is passed by reference, so that it will contain these hooks
//	//app.StakingKeeper.SetHooks(
//	//	stakingtypes.NewMultiStakingHooks(app.DistrKeeper.Hooks(), app.SlashingKeeper.Hooks()),
//	//)
//
//	//app.CircuitKeeper = circuitkeeper.NewKeeper(
//	//	appCodec,
//	//	runtime.NewKVStoreService(keys[circuittypes.StoreKey]),
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//	app.AccountKeeper.AddressCodec(),
//	//)
//	//app.BaseApp.SetCircuitBreaker(&app.CircuitKeeper)
//	//
//	//app.AuthzKeeper = authzkeeper.NewKeeper(
//	//	runtime.NewKVStoreService(keys[authzkeeper.StoreKey]),
//	//	appCodec,
//	//	app.MsgServiceRouter(),
//	//	app.AccountKeeper,
//	//)
//	//
//	//groupConfig := group.DefaultConfig()
//	///*
//	//	Example of setting group params:
//	//	groupConfig.MaxMetadataLen = 1000
//	//*/
//	//app.GroupKeeper = groupkeeper.NewKeeper(
//	//	keys[group.StoreKey],
//	//	// runtime.NewKVStoreService(keys[group.StoreKey]),
//	//	appCodec,
//	//	app.MsgServiceRouter(),
//	//	app.AccountKeeper,
//	//	groupConfig,
//	//)
//	//
//	//// get skipUpgradeHeights from the app options
//	//skipUpgradeHeights := map[int64]bool{}
//	//for _, h := range cast.ToIntSlice(appOpts.Get(server.FlagUnsafeSkipUpgrades)) {
//	//	skipUpgradeHeights[int64(h)] = true
//	//}
//	//homePath := cast.ToString(appOpts.Get(flags.FlagHome))
//	//// set the governance module account as the authority for conducting upgrades
//	//app.UpgradeKeeper = upgradekeeper.NewKeeper(
//	//	skipUpgradeHeights,
//	//	runtime.NewKVStoreService(keys[upgradetypes.StoreKey]),
//	//	appCodec,
//	//	homePath,
//	//	app.BaseApp,
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//)
//
//	//app.IBCKeeper = ibckeeper.NewKeeper(
//	//	appCodec,
//	//	keys[ibcexported.StoreKey],
//	//	app.GetSubspace(ibcexported.ModuleName),
//	//	app.StakingKeeper,
//	//	app.UpgradeKeeper,
//	//	scopedIBCKeeper,
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//)
//
//	// create evidence keeper with router
//	evidenceKeeper := evidencekeeper.NewKeeper(
//		appCodec,
//		runtime.NewKVStoreService(keys[evidencetypes.StoreKey]),
//		app.StakingKeeper,
//		app.SlashingKeeper,
//		app.AccountKeeper.AddressCodec(),
//		runtime.ProvideCometInfoService(),
//	)
//	// If evidence needs to be handled for the app, set routes in router here and seal
//	app.EvidenceKeeper = *evidenceKeeper
//
//	app.NFTKeeper = nftkeeper.NewKeeper(
//		runtime.NewKVStoreService(keys[nftkeeper.StoreKey]),
//		appCodec,
//		app.AccountKeeper,
//		app.BankKeeper,
//	)
//
//	// IBC Fee Module keeper
//	//app.IBCFeeKeeper = ibcfeekeeper.NewKeeper(
//	//	appCodec, keys[ibcfeetypes.StoreKey],
//	//	app.IBCKeeper.ChannelKeeper, // may be replaced with IBC middleware
//	//	app.IBCKeeper.ChannelKeeper,
//	//	app.IBCKeeper.PortKeeper, app.AccountKeeper, app.BankKeeper,
//	//)
//	//
//	//// Create Transfer Keepers
//	//app.TransferKeeper = ibctransferkeeper.NewKeeper(
//	//	appCodec,
//	//	keys[ibctransfertypes.StoreKey],
//	//	app.GetSubspace(ibctransfertypes.ModuleName),
//	//	app.IBCFeeKeeper, // ISC4 Wrapper: fee IBC middleware
//	//	app.IBCKeeper.ChannelKeeper,
//	//	app.IBCKeeper.PortKeeper,
//	//	app.AccountKeeper,
//	//	app.BankKeeper,
//	//	scopedTransferKeeper,
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//)
//	//
//	//app.ICAHostKeeper = icahostkeeper.NewKeeper(
//	//	appCodec,
//	//	keys[icahosttypes.StoreKey],
//	//	app.GetSubspace(icahosttypes.SubModuleName),
//	//	app.IBCFeeKeeper, // use ics29 fee as ics4Wrapper in middleware stack
//	//	app.IBCKeeper.ChannelKeeper,
//	//	app.IBCKeeper.PortKeeper,
//	//	app.AccountKeeper,
//	//	scopedICAHostKeeper,
//	//	app.MsgServiceRouter(),
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//)
//	//app.ICAControllerKeeper = icacontrollerkeeper.NewKeeper(
//	//	appCodec,
//	//	keys[icacontrollertypes.StoreKey],
//	//	app.GetSubspace(icacontrollertypes.SubModuleName),
//	//	app.IBCFeeKeeper, // use ics29 fee as ics4Wrapper in middleware stack
//	//	app.IBCKeeper.ChannelKeeper,
//	//	app.IBCKeeper.PortKeeper,
//	//	scopedICAControllerKeeper,
//	//	app.MsgServiceRouter(),
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//)
//
//	// wasmDir := filepath.Join(homePath, "wasm")
//	wasmConfig, err := wasm.ReadWasmConfig(appOpts)
//	if err != nil {
//		panic(fmt.Sprintf("error while reading wasm config: %s", err))
//	}
//
//	// The last arguments can contain custom message handlers, and custom query handlers,
//	// if we want to allow any custom callbacks
//	//app.WasmKeeper = wasmkeeper.NewKeeper(
//	//	appCodec,
//	//	runtime.NewKVStoreService(keys[wasmtypes.StoreKey]),
//	//	app.AccountKeeper,
//	//	app.BankKeeper,
//	//	app.StakingKeeper,
//	//	distrkeeper.NewQuerier(app.DistrKeeper),
//	//	app.IBCFeeKeeper, // ISC4 Wrapper: fee IBC middleware
//	//	app.IBCKeeper.ChannelKeeper,
//	//	app.IBCKeeper.PortKeeper,
//	//	scopedWasmKeeper,
//	//	app.TransferKeeper,
//	//	app.MsgServiceRouter(),
//	//	app.GRPCQueryRouter(),
//	//	wasmDir,
//	//	wasmConfig,
//	//	wasmkeeper.BuiltInCapabilities(),
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//	wasmOpts...,
//	//)
//
//	// Register the proposal types
//	// Deprecated: Avoid adding new handlers, instead use the new proposal flow
//	// by granting the governance module the right to execute the message.
//	// See: https://docs.cosmos.network/main/modules/gov#proposal-messages
//	//govRouter := govv1beta1.NewRouter()
//	//govRouter.AddRoute(govtypes.RouterKey, govv1beta1.ProposalHandler).
//	//	AddRoute(paramproposal.RouterKey, params.NewParamChangeProposalHandler(app.ParamsKeeper))
//	//govConfig := govtypes.DefaultConfig()
//	///*
//	//	Example of setting gov params:
//	//	govConfig.MaxMetadataLen = 10000
//	//*/
//	//govKeeper := govkeeper.NewKeeper(
//	//	appCodec,
//	//	runtime.NewKVStoreService(keys[govtypes.StoreKey]),
//	//	app.AccountKeeper,
//	//	app.BankKeeper,
//	//	app.StakingKeeper,
//	//	app.DistrKeeper,
//	//	app.MsgServiceRouter(),
//	//	govConfig,
//	//	authtypes.NewModuleAddress(govtypes.ModuleName).String(),
//	//	app.IBCKeeper.ChannelKeeper,
//	//	app.IBCKeeper.PortKeeper,
//	//	scopedIBCKeeper,
//	//	app.IBCKeeper.ConnectionKeeper,
//	//)
//	//
//	//// Set legacy router for backwards compatibility with gov v1beta1
//	//govKeeper.SetLegacyRouter(govRouter)
//	//
//	//app.GovKeeper = govKeeper.SetHooks(
//	//	govtypes.NewMultiGovHooks(
//	//	// register the governance hooks
//	//	),
//	//)
//	//
//	//scopedPepKeeper := app.CapabilityKeeper.ScopeToModule(pepmoduletypes.ModuleName)
//	//app.PepKeeper = pepmodulekeeper.NewKeeper(
//	//	appCodec,
//	//	runtime.NewKVStoreService(keys[pepmoduletypes.StoreKey]),
//	//	logger,
//	//	authtypes.NewModuleAddress(pepmoduletypes.ModuleName).String(),
//	//	app.BankKeeper,
//	//	app.IBCKeeper.ChannelKeeper,
//	//	app.IBCKeeper.PortKeeper,
//	//	scopedPepKeeper,
//	//	app.IBCKeeper.ConnectionKeeper,
//	//)
//	//
//	//scopedKeyshareKeeper := app.CapabilityKeeper.ScopeToModule(keysharemoduletypes.ModuleName)
//	//app.KeyshareKeeper = keysharemodulekeeper.NewKeeper(
//	//	appCodec,
//	//	runtime.NewKVStoreService(keys[keysharemoduletypes.StoreKey]),
//	//	logger,
//	//	authtypes.NewModuleAddress(keysharemoduletypes.ModuleName).String(),
//	//	app.PepKeeper,
//	//	app.SlashingKeeper,
//	//	app.StakingKeeper,
//	//	app.GovKeeper,
//	//	app.IBCKeeper.ChannelKeeper,
//	//	app.IBCKeeper.PortKeeper,
//	//	scopedKeyshareKeeper,
//	//	app.IBCKeeper.ConnectionKeeper,
//	//)
//	//
//	//pepModule := pepmodule.NewAppModule(
//	//	appCodec,
//	//	app.PepKeeper,
//	//	app.AccountKeeper,
//	//	app.BankKeeper,
//	//	app.MsgServiceRouter(),
//	//	txConfig,
//	//	app.SimCheck,
//	//)
//	//
//	//keyshareModule := keysharemodule.NewAppModule(
//	//	appCodec,
//	//	app.KeyshareKeeper,
//	//	app.AccountKeeper,
//	//	app.BankKeeper,
//	//	app.PepKeeper,
//	//	app.StakingKeeper,
//	//)
//	//
//	//app.CapabilityKeeper.Seal()
//
//	// ---------------------------------------------------------------------------- //
//	// ------------------------- Begin Custom Code -------------------------------- //
//	// ---------------------------------------------------------------------------- //
//
//	// Set fairyring's mempool into the app.
//	config := blockbuster.BaseLaneConfig{
//		Logger:        app.Logger(),
//		TxEncoder:     app.txConfig.TxEncoder(),
//		TxDecoder:     app.txConfig.TxDecoder(),
//		MaxBlockSpace: sdkmath.LegacyZeroDec(),
//	}
//
//	// Create the lanes.
//	//
//	// NOTE: The lanes are ordered by priority. The first lane is the highest priority
//	// lane and the last lane is the lowest priority lane.
//
//	// Keyshare lane allows for CreateAggrgatedKeyShare transactions to be processed before others.
//	keyshareLane := keyshare.NewKeyShareLane(
//		config,
//		0,
//		keyshare.NewDefaultKeyshareFactory(app.txConfig.TxDecoder()),
//	)
//
//	// Default lane accepts all other transactions.
//	defaultConfig := blockbuster.BaseLaneConfig{
//		Logger:        app.Logger(),
//		TxEncoder:     app.txConfig.TxEncoder(),
//		TxDecoder:     app.txConfig.TxDecoder(),
//		MaxBlockSpace: sdkmath.LegacyZeroDec(),
//		IgnoreList: []blockbuster.Lane{
//			keyshareLane,
//		},
//	}
//	defaultLane := base.NewDefaultLane(defaultConfig)
//
//	lanes := []blockbuster.Lane{
//		keyshareLane,
//		defaultLane,
//	}
//
//	mempool := blockbuster.NewMempool(lanes...)
//	app.BaseApp.SetMempool(mempool)
//
//	// Create a global ante handler that will be called on each transaction when
//	// proposals are being built and verified.
//	handlerOptions := ante.HandlerOptions{
//		AccountKeeper:   app.AccountKeeper,
//		BankKeeper:      app.BankKeeper,
//		FeegrantKeeper:  app.FeeGrantKeeper,
//		SigGasConsumer:  ante.DefaultSigVerificationGasConsumer,
//		SignModeHandler: app.txConfig.SignModeHandler(),
//	}
//	options := FairyringHandlerOptions{
//		BaseOptions:           handlerOptions,
//		wasmConfig:            wasmConfig,
//		txCounterStoreService: runtime.NewKVStoreService(keys[wasmtypes.ModuleName]),
//		PepKeeper:             app.PepKeeper,
//		TxDecoder:             app.txConfig.TxDecoder(),
//		TxEncoder:             app.txConfig.TxEncoder(),
//		KeyShareLane:          keyshareLane,
//		Mempool:               mempool,
//	}
//	anteHandler := NewFairyringAnteHandler(options)
//
//	// Set the lane config on the lanes.
//	for _, lane := range lanes {
//		lane.SetAnteHandler(anteHandler)
//	}
//
//	// Set the proposal handlers on the BaseApp along with the custom antehandler.
//	proposalHandlers := blockbusterabci.NewProposalHandler(
//		app.Logger(),
//		app.txConfig.TxDecoder(),
//		mempool,
//	)
//	app.BaseApp.SetPrepareProposal(proposalHandlers.PrepareProposalHandler())
//	app.BaseApp.SetProcessProposal(proposalHandlers.ProcessProposalHandler())
//	app.BaseApp.SetAnteHandler(anteHandler)
//
//	// Set the custom CheckTx handler on BaseApp.
//	checkTxHandler := blockbusterabci.NewCheckTxHandler(
//		app.BaseApp,
//		app.txConfig.TxDecoder(),
//		keyshareLane,
//		anteHandler,
//		ChainID,
//	)
//	app.SetCheckTx(checkTxHandler.CheckTx())
//
//	// ---------------------------------------------------------------------------- //
//	// ------------------------- End Custom Code ---------------------------------- //
//	// ---------------------------------------------------------------------------- //
//
//	// this line is used by starport scaffolding # stargate/app/keeperDefinition
//
//	// Create Transfer Stack
//	//var transferStack porttypes.IBCModule
//	//transferStack = transfer.NewIBCModule(app.TransferKeeper)
//	//transferStack = ibcfee.NewIBCMiddleware(transferStack, app.IBCFeeKeeper)
//	//
//	//// Create Interchain Accounts Stack
//	//// SendPacket, since it is originating from the application to core IBC:
//	//// icaAuthModuleKeeper.SendTx -> icaController.SendPacket -> fee.SendPacket -> channel.SendPacket
//	//var icaControllerStack porttypes.IBCModule
//	//// integration point for custom authentication modules
//	//// see https://medium.com/the-interchain-foundation/ibc-go-v6-changes-to-interchain-accounts-and-how-it-impacts-your-chain-806c185300d7
//	//var noAuthzModule porttypes.IBCModule
//	//icaControllerStack = icacontroller.NewIBCMiddleware(noAuthzModule, app.ICAControllerKeeper)
//	//icaControllerStack = ibcfee.NewIBCMiddleware(icaControllerStack, app.IBCFeeKeeper)
//	//
//	//// RecvPacket, message that originates from core IBC and goes down to app, the flow is:
//	//// channel.RecvPacket -> fee.OnRecvPacket -> icaHost.OnRecvPacket
//	//var icaHostStack porttypes.IBCModule
//	//icaHostStack = icahost.NewIBCModule(app.ICAHostKeeper)
//	//icaHostStack = ibcfee.NewIBCMiddleware(icaHostStack, app.IBCFeeKeeper)
//	//
//	//// Create fee enabled wasm ibc Stack
//	//var wasmStack porttypes.IBCModule
//	//wasmStack = wasm.NewIBCHandler(app.WasmKeeper, app.IBCKeeper.ChannelKeeper, app.IBCFeeKeeper)
//	//wasmStack = ibcfee.NewIBCMiddleware(wasmStack, app.IBCFeeKeeper)
//	//
//	//var pepStack porttypes.IBCModule
//	//pepStack = pepmodule.NewIBCModule(app.PepKeeper)
//	//pepStack = ibcfee.NewIBCMiddleware(pepStack, app.IBCFeeKeeper)
//	//
//	//var govStack porttypes.IBCModule
//	//govStack = gov.NewIBCModule(*app.GovKeeper)
//	//govStack = ibcfee.NewIBCMiddleware(govStack, app.IBCFeeKeeper)
//	//
//	//var keyshareStack porttypes.IBCModule
//	//keyshareStack = keysharemodule.NewIBCModule(app.KeyshareKeeper)
//	//keyshareStack = ibcfee.NewIBCMiddleware(keyshareStack, app.IBCFeeKeeper)
//	//
//	//// Create static IBC router, add app routes, then set and seal it
//	//ibcRouter := porttypes.NewRouter().
//	//	AddRoute(ibctransfertypes.ModuleName, transferStack).
//	//	AddRoute(wasmtypes.ModuleName, wasmStack).
//	//	AddRoute(icacontrollertypes.SubModuleName, icaControllerStack).
//	//	AddRoute(icahosttypes.SubModuleName, icaHostStack).
//	//	AddRoute(pepmoduletypes.ModuleName, pepStack).
//	//	AddRoute(keysharemoduletypes.ModuleName, keyshareStack).
//	//	AddRoute(govtypes.ModuleName, govStack)
//	//
//	//app.IBCKeeper.SetRouter(ibcRouter)
//	//
//	//// register hooks after all modules have been initialized
//	//
//	//app.StakingKeeper.SetHooks(
//	//	stakingtypes.NewMultiStakingHooks(
//	//		// insert staking hooks receivers here
//	//		app.DistrKeeper.Hooks(),
//	//		app.SlashingKeeper.Hooks(),
//	//	),
//	//)
//
//	/****  Module Options ****/
//
//	// NOTE: we may consider parsing `appOpts` inside module constructors. For the moment
//	// we prefer to be more strict in what arguments the modules expect.
//	skipGenesisInvariants := cast.ToBool(appOpts.Get(crisis.FlagSkipGenesisInvariants))
//
//	// NOTE: Any module instantiated in the module manager that is later modified
//	// must be passed by reference here.
//
//	app.ModuleManager = module.NewManager(
//		genutil.NewAppModule(
//			app.AccountKeeper, app.StakingKeeper, app,
//			txConfig,
//		),
//		auth.NewAppModule(appCodec, app.AccountKeeper, authsims.RandomGenesisAccounts, app.GetSubspace(authtypes.ModuleName)),
//		authzmodule.NewAppModule(appCodec, app.AuthzKeeper, app.AccountKeeper, app.BankKeeper, app.interfaceRegistry),
//		vesting.NewAppModule(app.AccountKeeper, app.BankKeeper),
//		bank.NewAppModule(appCodec, app.BankKeeper, app.AccountKeeper, app.GetSubspace(banktypes.ModuleName)),
//		capability.NewAppModule(appCodec, *app.CapabilityKeeper, false),
//		feegrantmodule.NewAppModule(appCodec, app.AccountKeeper, app.BankKeeper, app.FeeGrantKeeper, app.interfaceRegistry),
//		groupmodule.NewAppModule(appCodec, app.GroupKeeper, app.AccountKeeper, app.BankKeeper, app.interfaceRegistry),
//		gov.NewAppModule(appCodec, app.GovKeeper, app.AccountKeeper, app.BankKeeper, app.GetSubspace(govtypes.ModuleName)),
//		mint.NewAppModule(appCodec, app.MintKeeper, app.AccountKeeper, nil, app.GetSubspace(minttypes.ModuleName)),
//		slashing.NewAppModule(appCodec, app.SlashingKeeper, app.AccountKeeper, app.BankKeeper, app.StakingKeeper, app.GetSubspace(slashingtypes.ModuleName), app.interfaceRegistry),
//		distr.NewAppModule(appCodec, app.DistrKeeper, app.AccountKeeper, app.BankKeeper, app.StakingKeeper, app.GetSubspace(distrtypes.ModuleName)),
//		staking.NewAppModule(appCodec, app.StakingKeeper, app.AccountKeeper, app.BankKeeper, app.GetSubspace(stakingtypes.ModuleName)),
//		upgrade.NewAppModule(app.UpgradeKeeper, app.AccountKeeper.AddressCodec()),
//		evidence.NewAppModule(app.EvidenceKeeper),
//		nftmodule.NewAppModule(appCodec, app.NFTKeeper, app.AccountKeeper, app.BankKeeper, app.interfaceRegistry),
//		consensus.NewAppModule(appCodec, app.ConsensusParamsKeeper),
//		wasm.NewAppModule(appCodec, &app.WasmKeeper, app.StakingKeeper, app.AccountKeeper, app.BankKeeper, app.MsgServiceRouter(), app.GetSubspace(wasmtypes.ModuleName)),
//		ibc.NewAppModule(app.IBCKeeper),
//		params.NewAppModule(app.ParamsKeeper),
//		transfer.NewAppModule(app.TransferKeeper),
//		ibcfee.NewAppModule(app.IBCFeeKeeper),
//		ica.NewAppModule(&app.ICAControllerKeeper, &app.ICAHostKeeper),
//		ibctm.AppModule{},
//		//keyshareModule,
//		//pepModule,
//		// this line is used by starport scaffolding # stargate/app/appModule
//
//		crisis.NewAppModule(app.CrisisKeeper, skipGenesisInvariants, app.GetSubspace(crisistypes.ModuleName)), // always be last to make sure that it checks for all invariants and not only part of them
//	)
//
//	// BasicModuleManager defines the module BasicManager is in charge of setting up basic,
//	// non-dependant module elements, such as codec registration and genesis verification.
//	// By default it is composed of all the module from the module manager.
//	// Additionally, app module basics can be overwritten by passing them as argument.
//	app.BasicModuleManager = module.NewBasicManagerFromManager(
//		app.ModuleManager,
//		map[string]module.AppModuleBasic{
//			genutiltypes.ModuleName: genutil.NewAppModuleBasic(genutiltypes.DefaultMessageValidator),
//			govtypes.ModuleName: gov.NewAppModuleBasic(
//				[]govclient.ProposalHandler{
//					paramsclient.ProposalHandler,
//				},
//			),
//		})
//	app.BasicModuleManager.RegisterLegacyAminoCodec(cdc)
//	app.BasicModuleManager.RegisterInterfaces(interfaceRegistry)
//
//	// NOTE: upgrade module is required to be prioritized
//	app.ModuleManager.SetOrderPreBlockers(
//		upgradetypes.ModuleName,
//	)
//
//	// During begin block slashing happens after distr.BeginBlocker so that
//	// there is nothing left over in the validator fee pool, so as to keep the
//	// CanWithdrawInvariant invariant.
//	// NOTE: staking module is required if HistoricalEntries param > 0
//	app.ModuleManager.SetOrderBeginBlockers(
//		// upgrades should be run first
//		upgradetypes.ModuleName,
//		capabilitytypes.ModuleName,
//		minttypes.ModuleName,
//		distrtypes.ModuleName,
//		slashingtypes.ModuleName,
//		evidencetypes.ModuleName,
//		stakingtypes.ModuleName,
//		authtypes.ModuleName,
//		banktypes.ModuleName,
//		govtypes.ModuleName,
//		crisistypes.ModuleName,
//		ibctransfertypes.ModuleName,
//		ibcexported.ModuleName,
//		icatypes.ModuleName,
//		wasmtypes.ModuleName,
//		genutiltypes.ModuleName,
//		authz.ModuleName,
//		feegrant.ModuleName,
//		group.ModuleName,
//		paramstypes.ModuleName,
//		vestingtypes.ModuleName,
//		consensusparamtypes.ModuleName,
//		keysharemoduletypes.ModuleName, // Necessary to run before begin blocker of pep module
//		pepmoduletypes.ModuleName,
//		// this line is used by starport scaffolding # stargate/app/beginBlockers
//	)
//
//	app.ModuleManager.SetOrderEndBlockers(
//		crisistypes.ModuleName,
//		govtypes.ModuleName,
//		stakingtypes.ModuleName,
//		ibctransfertypes.ModuleName,
//		ibcexported.ModuleName,
//		icatypes.ModuleName,
//		capabilitytypes.ModuleName,
//		authtypes.ModuleName,
//		banktypes.ModuleName,
//		distrtypes.ModuleName,
//		slashingtypes.ModuleName,
//		minttypes.ModuleName,
//		genutiltypes.ModuleName,
//		evidencetypes.ModuleName,
//		authz.ModuleName,
//		feegrant.ModuleName,
//		group.ModuleName,
//		paramstypes.ModuleName,
//		upgradetypes.ModuleName,
//		vestingtypes.ModuleName,
//		consensusparamtypes.ModuleName,
//		keysharemoduletypes.ModuleName,
//		pepmoduletypes.ModuleName,
//		wasmtypes.ModuleName,
//		// this line is used by starport scaffolding # stargate/app/endBlockers
//	)
//
//	// NOTE: The genutils module must occur after staking so that pools are
//	// properly initialized with tokens from genesis accounts.
//	// NOTE: Capability module must occur first so that it can initialize any capabilities
//	// so that other modules that want to create or claim capabilities afterwards in InitChain
//	// can do so safely.
//	genesisModuleOrder := []string{
//		capabilitytypes.ModuleName,
//		authtypes.ModuleName,
//		banktypes.ModuleName,
//		distrtypes.ModuleName,
//		stakingtypes.ModuleName,
//		slashingtypes.ModuleName,
//		govtypes.ModuleName,
//		minttypes.ModuleName,
//		crisistypes.ModuleName,
//		genutiltypes.ModuleName,
//		ibctransfertypes.ModuleName,
//		ibcexported.ModuleName,
//		ibcfeetypes.ModuleName,
//		icatypes.ModuleName,
//		evidencetypes.ModuleName,
//		nft.ModuleName,
//		circuittypes.ModuleName,
//		authz.ModuleName,
//		feegrant.ModuleName,
//		group.ModuleName,
//		paramstypes.ModuleName,
//		upgradetypes.ModuleName,
//		vestingtypes.ModuleName,
//		consensusparamtypes.ModuleName,
//		keysharemoduletypes.ModuleName,
//		pepmoduletypes.ModuleName,
//		// wasm after ibc transfer
//		wasmtypes.ModuleName,
//		// this line is used by starport scaffolding # stargate/app/initGenesis
//	}
//	app.ModuleManager.SetOrderInitGenesis(genesisModuleOrder...)
//	app.ModuleManager.SetOrderExportGenesis(genesisModuleOrder...)
//
//	// Uncomment if you want to set a custom migration order here.
//	// app.mm.SetOrderMigrations(custom order)
//
//	app.ModuleManager.RegisterInvariants(app.CrisisKeeper)
//	app.configurator = module.NewConfigurator(app.appCodec, app.MsgServiceRouter(), app.GRPCQueryRouter())
//	err = app.ModuleManager.RegisterServices(app.configurator)
//	if err != nil {
//		panic(err)
//	}
//
//	// RegisterUpgradeHandlers is used for registering any on-chain upgrades.
//	// Make sure it's called after `app.ModuleManager` and `app.configurator` are set.
//	// app.RegisterUpgradeHandlers()
//
//	autocliv1.RegisterQueryServer(app.GRPCQueryRouter(), runtimeservices.NewAutoCLIQueryService(app.ModuleManager.Modules))
//
//	reflectionSvc, err := runtimeservices.NewReflectionService()
//	if err != nil {
//		panic(err)
//	}
//
//	reflectionv1.RegisterReflectionServiceServer(app.GRPCQueryRouter(), reflectionSvc)
//
//	// create the simulation manager and define the order of the modules for deterministic simulations
//	overrideModules := map[string]module.AppModuleSimulation{
//		authtypes.ModuleName: auth.NewAppModule(app.appCodec, app.AccountKeeper, authsims.RandomGenesisAccounts, app.GetSubspace(authtypes.ModuleName)),
//	}
//	app.sm = module.NewSimulationManagerFromAppModules(app.ModuleManager.Modules, overrideModules)
//
//	app.sm.RegisterStoreDecoders()
//
//	// initialize stores
//	app.MountKVStores(keys)
//	app.MountTransientStores(tkeys)
//	app.MountMemoryStores(memKeys)
//
//	// app.SetInitChainer(app.InitChainer)
//	app.SetPreBlocker(app.PreBlocker)
//	app.SetBeginBlocker(app.BeginBlocker)
//	app.SetEndBlocker(app.EndBlocker)
//
//	// must be before Loading version
//	// requires the snapshot store to be created and registered as a BaseAppOption
//	// see cmd/wasmd/root.go: 206 - 214 approx
//	if manager := app.SnapshotManager(); manager != nil {
//		err := manager.RegisterExtensions(
//			wasmkeeper.NewWasmSnapshotter(app.CommitMultiStore(), &app.WasmKeeper),
//		)
//		if err != nil {
//			panic(fmt.Errorf("failed to register snapshot extension: %s", err))
//		}
//	}
//
//	//app.ScopedIBCKeeper = scopedIBCKeeper
//	//app.ScopedIBCTransferKeeper = scopedTransferKeeper
//	//app.ScopedPepKeeper = scopedPepKeeper
//	//app.ScopedKeyshareKeeper = scopedKeyshareKeeper
//	//app.ScopedWasmKeeper = scopedWasmKeeper
//	//app.ScopedICAHostKeeper = scopedICAHostKeeper
//	//app.ScopedICAControllerKeeper = scopedICAControllerKeeper
//	//app.ScopedGovkeeper = scopedGovkeeper
//
//	// TODO: Check if posthandlers are necessary for our chain
//	//app.setPostHandler()
//
//	// At startup, after all modules have been registered, check that all proto
//	// annotations are correct.
//	protoFiles, err := proto.MergedRegistry()
//	if err != nil {
//		panic(err)
//	}
//	err = msgservice.ValidateProtoAnnotations(protoFiles)
//	if err != nil {
//		// Once we switch to using protoreflect-based antehandlers, we might
//		// want to panic here instead of logging a warning.
//		_, _ = fmt.Fprintln(os.Stderr, err.Error())
//	}
//
//	if loadLatest {
//		if err := app.LoadLatestVersion(); err != nil {
//			panic(fmt.Errorf("error loading last version: %w", err))
//		}
//		ctx := app.BaseApp.NewUncachedContext(true, tmproto.Header{})
//
//		// Initialize pinned codes in wasmvm as they are not persisted there
//		if err := app.WasmKeeper.InitializePinnedCodes(ctx); err != nil {
//			panic(fmt.Sprintf("failed initialize pinned codes %s", err))
//		}
//	}
//
//	// this line is used by starport scaffolding # stargate/app/beforeInitReturn
//	if err := app.WasmKeeper.InitializePinnedCodes(app.NewUncachedContext(true, tmproto.Header{})); err != nil {
//		panic(err)
//	}
//	return app
//}

// Name returns the name of the App
func (app *App) Name() string { return app.BaseApp.Name() }

// PreBlocker application updates every pre block
func (app *App) PreBlocker(ctx sdk.Context, _ *abci.RequestFinalizeBlock) (*sdk.ResponsePreBlock, error) {
	return app.ModuleManager.PreBlock(ctx)
}

// BeginBlocker application updates every begin block
func (app *App) BeginBlocker(ctx sdk.Context) (sdk.BeginBlock, error) {
	return app.ModuleManager.BeginBlock(ctx)
}

// EndBlocker application updates every end block
func (app *App) EndBlocker(ctx sdk.Context) (sdk.EndBlock, error) {
	return app.ModuleManager.EndBlock(ctx)
}

// InitChainer application update at chain initialization
func (app *App) InitChainer(ctx sdk.Context, req *abci.RequestInitChain) (*abci.ResponseInitChain, error) {
	var genesisState GenesisState
	if err := json.Unmarshal(req.AppStateBytes, &genesisState); err != nil {
		panic(err)
	}
	app.UpgradeKeeper.SetModuleVersionMap(ctx, app.ModuleManager.GetVersionMap())
	res, err := app.ModuleManager.InitGenesis(ctx, app.appCodec, genesisState)
	if err != nil {
		panic(err)
	}
	return res, nil
}

// Configurator get app configurator
func (app *App) Configurator() module.Configurator {
	return app.configurator
}

// LoadHeight loads a particular height
func (app *App) LoadHeight(height int64) error {
	return app.LoadVersion(height)
}

// GetMaccPerms returns a copy of the module account permissions
//
// NOTE: This is solely to be used for testing purposes.
func GetMaccPerms() map[string][]string {
	dupMaccPerms := make(map[string][]string)
	for k, v := range maccPerms {
		dupMaccPerms[k] = v
	}

	return dupMaccPerms
}

// DefaultGenesis returns a default genesis from the registered AppModuleBasic's.
func (a *App) DefaultGenesis() map[string]json.RawMessage {
	return a.BasicModuleManager.DefaultGenesis(a.appCodec)
}

// BlockedAddresses returns all the app's blocked account addresses.
func BlockedAddresses() map[string]bool {
	modAccAddrs := make(map[string]bool)
	for acc := range GetMaccPerms() {
		modAccAddrs[authtypes.NewModuleAddress(acc).String()] = true
	}

	// allow the following addresses to receive funds
	delete(modAccAddrs, authtypes.NewModuleAddress(govtypes.ModuleName).String())

	return modAccAddrs
}

// LegacyAmino returns SimApp's amino codec.
//
// NOTE: This is solely to be used for testing purposes as it may be desirable
// for modules to register their own custom testing types.
func (app *App) LegacyAmino() *codec.LegacyAmino {
	return app.cdc
}

// AppCodec returns an app codec.
//
// NOTE: This is solely to be used for testing purposes as it may be desirable
// for modules to register their own custom testing types.
func (app *App) AppCodec() codec.Codec {
	return app.appCodec
}

// InterfaceRegistry returns an InterfaceRegistry
func (app *App) InterfaceRegistry() codectypes.InterfaceRegistry {
	return app.interfaceRegistry
}

// GetKey returns the KVStoreKey for the provided store key.
//
// NOTE: This is solely to be used for testing purposes.
func (app *App) GetKey(storeKey string) *storetypes.KVStoreKey {
	return app.keys[storeKey]
}

// GetStoreKeys returns all the stored store keys.
func (app *App) GetStoreKeys() []storetypes.StoreKey {
	keys := make([]storetypes.StoreKey, 0, len(app.keys))
	for _, key := range app.keys {
		keys = append(keys, key)
	}
	sort.Slice(keys, func(i, j int) bool {
		return keys[i].Name() < keys[j].Name()
	})
	return keys
}

// GetTKey returns the TransientStoreKey for the provided store key.
//
// NOTE: This is solely to be used for testing purposes.
func (app *App) GetTKey(storeKey string) *storetypes.TransientStoreKey {
	return app.tkeys[storeKey]
}

// kvStoreKeys returns all the kv store keys registered inside App.
func (app *App) kvStoreKeys() map[string]*storetypes.KVStoreKey {
	keys := make(map[string]*storetypes.KVStoreKey)
	for _, k := range app.GetStoreKeys() {
		if kv, ok := k.(*storetypes.KVStoreKey); ok {
			keys[kv.Name()] = kv
		}
	}

	return keys
}

// GetMemKey returns the MemStoreKey for the provided mem key.
//
// NOTE: This is solely used for testing purposes.
func (app *App) GetMemKey(storeKey string) *storetypes.MemoryStoreKey {
	return app.memKeys[storeKey]
}

// GetSubspace returns a param subspace for a given module name.
//
// NOTE: This is solely to be used for testing purposes.
func (app *App) GetSubspace(moduleName string) paramstypes.Subspace {
	subspace, _ := app.ParamsKeeper.GetSubspace(moduleName)
	return subspace
}

// RegisterAPIRoutes registers all application module routes with the provided
// API server.
func (app *App) RegisterAPIRoutes(apiSvr *api.Server, apiConfig config.APIConfig) {
	app.RegisterAPIRoutes(apiSvr, apiConfig)
	clientCtx := apiSvr.ClientCtx
	// register swagger API in app.go so that other applications can override easily
	if err := server.RegisterSwaggerAPI(clientCtx, apiSvr.Router, apiConfig.Swagger); err != nil {
		panic(err)
	}
	// Register new tx routes from grpc-gateway.
	authtx.RegisterGRPCGatewayRoutes(clientCtx, apiSvr.GRPCGatewayRouter)
	// Register new tendermint queries routes from grpc-gateway.
	cmtservice.RegisterGRPCGatewayRoutes(clientCtx, apiSvr.GRPCGatewayRouter)
	// Register node gRPC service for grpc-gateway.
	nodeservice.RegisterGRPCGatewayRoutes(clientCtx, apiSvr.GRPCGatewayRouter)

	// Register grpc-gateway routes for all modules.
	app.BasicModuleManager.RegisterGRPCGatewayRoutes(clientCtx, apiSvr.GRPCGatewayRouter)

	// register app's OpenAPI routes.
	docs.RegisterOpenAPIService(Name, apiSvr.Router)
}

// RegisterTxService implements the Application.RegisterTxService method.
func (app *App) RegisterTxService(clientCtx client.Context) {
	authtx.RegisterTxService(app.BaseApp.GRPCQueryRouter(), clientCtx, app.BaseApp.Simulate, app.interfaceRegistry)
}

// RegisterTendermintService implements the Application.RegisterTendermintService method.
func (app *App) RegisterTendermintService(clientCtx client.Context) {
	cmtservice.RegisterTendermintService(
		clientCtx,
		app.BaseApp.GRPCQueryRouter(),
		app.interfaceRegistry,
		app.Query,
	)
}

// RegisterNodeService implements the Application.RegisterNodeService method.
func (app *App) RegisterNodeService(clientCtx client.Context, cfg config.Config) {
	nodeservice.RegisterNodeService(clientCtx, app.GRPCQueryRouter(), cfg)
}

// initParamsKeeper init params keeper and its subspaces
func initParamsKeeper(appCodec codec.BinaryCodec, legacyAmino *codec.LegacyAmino, key, tkey storetypes.StoreKey) paramskeeper.Keeper {
	paramsKeeper := paramskeeper.NewKeeper(appCodec, legacyAmino, key, tkey)

	paramsKeeper.Subspace(authtypes.ModuleName)
	paramsKeeper.Subspace(banktypes.ModuleName)
	paramsKeeper.Subspace(stakingtypes.ModuleName)
	paramsKeeper.Subspace(minttypes.ModuleName)
	paramsKeeper.Subspace(distrtypes.ModuleName)
	paramsKeeper.Subspace(slashingtypes.ModuleName)
	paramsKeeper.Subspace(govtypes.ModuleName).WithKeyTable(govv1.ParamKeyTable())
	paramsKeeper.Subspace(crisistypes.ModuleName)
	paramsKeeper.Subspace(ibctransfertypes.ModuleName)
	paramsKeeper.Subspace(ibcexported.ModuleName)
	paramsKeeper.Subspace(icacontrollertypes.SubModuleName)
	paramsKeeper.Subspace(icahosttypes.SubModuleName)
	paramsKeeper.Subspace(keysharemoduletypes.ModuleName)
	paramsKeeper.Subspace(pepmoduletypes.ModuleName)
	// this line is used by starport scaffolding # stargate/app/paramSubspace

	return paramsKeeper
}

// SimulationManager implements the SimulationApp interface
func (app *App) SimulationManager() *module.SimulationManager {
	return app.sm
}

// GetBaseApp implements the TestingApp interface.
func (app *App) GetBaseApp() *baseapp.BaseApp {
	return app.BaseApp
}

// GetStakingKeeper implements the TestingApp interface.
func (app *App) GetStakingKeeper() ibctestingtypes.StakingKeeper {
	return app.StakingKeeper
}

// GetIBCKeeper implements the TestingApp interface.
func (app *App) GetIBCKeeper() *ibckeeper.Keeper {
	return app.IBCKeeper
}

// GetCapabilityScopedKeeper returns the capability scoped keeper.
func (app *App) GetCapabilityScopedKeeper(moduleName string) capabilitykeeper.ScopedKeeper {
	return app.CapabilityKeeper.ScopeToModule(moduleName)
}

// GetScopedIBCKeeper implements the TestingApp interface.
func (app *App) GetScopedIBCKeeper() capabilitykeeper.ScopedKeeper {
	return app.ScopedIBCKeeper
}

// GetTxConfig implements the TestingApp interface.
func (app *App) GetTxConfig() client.TxConfig {
	return app.txConfig
}

// SetCheckTx sets the checkTxHandler for the app.
func (app *App) SetCheckTx(handler blockbusterabci.CheckTx) {
	app.checkTxHandler = handler
}
