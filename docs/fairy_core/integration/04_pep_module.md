# Integrating the PEP module

To address the requirement of a module capable of receiving encrypted transactions submitted by users, indexing them in the store by their target height, receiving aggregated keyshares (either via FairyPort or other off-chain services), and decrypting and executing the said encrypted transactions at their target height automatically, the PEP module is introduced.

The PEP module stands for Pre-Execution Privacy. It has the following capabilities:

1. Accept encrypted txs from users: `SubmitEncryptedTx`
2. Verify and accept aggregated Keyshares from FairyPort: `CreateAggregatedKeyShare`
3. Queue encrypted Txs in its store indexed by their target height
4. Decrypt and Execute the encrypted Txs automatically whenever the respective aggrgated keyshare becomes available
5. Keep pubkeys in its store to verify the submitted Aggregated Keyshares
6. Automatically use the queued keys when the active key expires
7. IBC functionality to query for pubkeys from FairyRing chain and update them (requires a relayer)

## Integration steps

To integrate the PEP module to any destination chain, the following steps are necessary:

1. In the `app.go` file, import the required packages

```go
import (
    pepmodule "github.com/Fairblock/fairyring/x/pep"
    pepmodulekeeper "github.com/Fairblock/fairyring/x/pep/keeper"
    pepmoduletypes "github.com/Fairblock/fairyring/x/pep/types"
)
```

2. Update the `ModuleBasics`:

```go
ModuleBasics = module.NewBasicManager(
    auth.AppModuleBasic{},
    authzmodule.AppModuleBasic{},
    genutil.AppModuleBasic{},
    bank.AppModuleBasic{},
    .
    .
    .
    pepmodule.AppModuleBasic{},
)

```

3. Add the required PEP keepers to the `App`:

```go
type App struct {
    *baseapp.BaseApp

    cdc               *codec.LegacyAmino
    appCodec          codec.Codec
    interfaceRegistry types.InterfaceRegistry

    invCheckPeriod uint

    // keys to access the substores
    keys    map[string]*storetypes.KVStoreKey
    tkeys   map[string]*storetypes.TransientStoreKey
    memKeys map[string]*storetypes.MemoryStoreKey

    // keepers
    AccountKeeper    authkeeper.AccountKeeper
    AuthzKeeper      authzkeeper.Keeper
    BankKeeper       bankkeeper.Keeper
    CapabilityKeeper *capabilitykeeper.Keeper
    StakingKeeper    stakingkeeper.Keeper
    SlashingKeeper   slashingkeeper.Keeper
    .
    .
    .
    ScopedPepKeeper  capabilitykeeper.ScopedKeeper
    PepKeeper        pepmodulekeeper.Keeper
    .
    .
    .
}
```

4. In the `New( )` function, add the store key for PEP module to the list of keys:

```go
keys := sdk.NewKVStoreKeys(
        authtypes.StoreKey, authz.ModuleName, banktypes.StoreKey,
        ... , pepmoduletypes.StoreKey,
)
```

5. Grant capabilities for the ibc and ibc-transfer modules:

```go
scopedIBCKeeper := app.CapabilityKeeper.ScopeToModule(ibchost.ModuleName)
scopedICAControllerKeeper := app.CapabilityKeeper.ScopeToModule(icacontrollertypes.SubModuleName)
scopedTransferKeeper := app.CapabilityKeeper.ScopeToModule(ibctransfertypes.ModuleName)
scopedICAHostKeeper := app.CapabilityKeeper.ScopeToModule(icahosttypes.SubModuleName)
scopedPepKeeper := app.CapabilityKeeper.ScopeToModule(pepmoduletypes.ModuleName)
```

6. Initialize the PEP keeper:

```go
app.PepKeeper = *pepmodulekeeper.NewKeeper(
        appCodec,
        keys[pepmoduletypes.StoreKey],
        keys[pepmoduletypes.MemStoreKey],
        app.GetSubspace(pepmoduletypes.ModuleName),
        app.IBCKeeper.ChannelKeeper,
        &app.IBCKeeper.PortKeeper,
        scopedPepKeeper,
    )
```

7. Initialize the PEP module:

```go
pepModule := pepmodule.NewAppModule(
    appCodec,

    app.PepKeeper,
    app.AccountKeeper,
    app.BankKeeper,
    app.MsgServiceRouter(),
    encodingConfig.TxConfig,
)
```

8. Initialize PEP IBC and add to the router:

```go
pepIBCModule := pepmodule.NewIBCModule(app.PepKeeper)
ibcRouter.AddRoute(pepmoduletypes.ModuleName, pepIBCModule)
```

9. Add PEP module to the app's module manager:

```go
app.mm = module.NewManager(
    genutil.NewAppModule(
        app.AccountKeeper, app.StakingKeeper, app.BaseApp.DeliverTx,
        encodingConfig.TxConfig,
    ),
    auth.NewAppModule(appCodec, app.AccountKeeper, nil),
    authzmodule.NewAppModule(appCodec, app.AuthzKeeper, app.AccountKeeper, app.BankKeeper, app.interfaceRegistry),
    vesting.NewAppModule(app.AccountKeeper, app.BankKeeper),
    .
    .
    .
    pepModule,
)
```

10. Set the order of Begin Blockers:

```go
app.mm.SetOrderBeginBlockers(
    upgradetypes.ModuleName,
    capabilitytypes.ModuleName,
    minttypes.ModuleName,
    distrtypes.ModuleName,
    .
    .
    .
    pepmoduletypes.ModuleName,
)
```

11. Set the Order of End Blockers:

```go
app.mm.SetOrderEndBlockers(
    crisistypes.ModuleName,
    govtypes.ModuleName,
    stakingtypes.ModuleName,
    ibctransfertypes.ModuleName,
    .
    .
    .
    pepmoduletypes.ModuleName,
)
```

12. Set the order of `InitGenesis`:

```go
app.mm.SetOrderInitGenesis(
    capabilitytypes.ModuleName,
    authtypes.ModuleName,
    banktypes.ModuleName,
    distrtypes.ModuleName,
    .
    .
    .
    pepmoduletypes.ModuleName,
)
```

13. Define the order of the modules for deterministic simulations:

```go
app.sm = module.NewSimulationManager(
    auth.NewAppModule(appCodec, app.AccountKeeper, authsims.RandomGenesisAccounts),
    authzmodule.NewAppModule(appCodec, app.AuthzKeeper, app.AccountKeeper, app.BankKeeper, app.interfaceRegistry),
    bank.NewAppModule(appCodec, app.BankKeeper, app.AccountKeeper),
    .
    .
    .
    pepModule,
)
```

14. Add scoped PEP keeper to app:

```go
app.ScopedIBCKeeper = scopedIBCKeeper
app.ScopedTransferKeeper = scopedTransferKeeper
app.ScopedPepKeeper = scopedPepKeeper
```

15. Initialize params keeper and its subspaces:

```go
func initParamsKeeper(
    appCodec codec.BinaryCodec,
    legacyAmino *codec.LegacyAmino,
    key,
    tkey storetypes.StoreKey,
    ) paramskeeper.Keeper {
    
    paramsKeeper := paramskeeper.NewKeeper(appCodec, legacyAmino, key, tkey)

    paramsKeeper.Subspace(authtypes.ModuleName)
    paramsKeeper.Subspace(banktypes.ModuleName)
    paramsKeeper.Subspace(stakingtypes.ModuleName)
    .
    .
    .
    paramsKeeper.Subspace(pepmoduletypes.ModuleName)
}
```

With these steps, the PEP module should be successfully integrated with any Destination Chain.
