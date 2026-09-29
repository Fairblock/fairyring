package app

import (
	"context"
	"fmt"

	upgradetypes "cosmossdk.io/x/upgrade/types"
	"github.com/Fairblock/fairyring/x/zkp/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
)

const (
	zkpRepairAuthority               = "fairy15rl6skup50epum3zz6v7zl2z762c9hq0rl886v"
	zkpRepairArbitrumTrustedContract = "fairy1suhgf5svhu4usrurvxzlgn54ksxmn8gljarjtxqnapv8kjnp4nrs59guk9"
)

// These modules are already initialized on fairblock-mainnet-1, but are absent
// from the x/upgrade module version map because they are registered manually
// rather than through app wiring. RunMigrations treats an absent module as new
// and calls InitGenesis, which is unsafe for these existing modules.
//
// Keep this list explicit and fail closed for any other missing current module.
var zkpRepairExistingUntrackedModules = map[string]struct{}{
	"06-solomachine":      {},
	"07-tendermint":       {},
	"capability":          {},
	"feeibc":              {},
	"ibc":                 {},
	"interchainaccounts":  {},
	"keyshare":            {},
	"pep":                 {},
	"transfer":            {},
	"wasm":                {},
	"zkp":                 {},
}

func prepareZKPIAVLRepairVersionMap(
	fromVM module.VersionMap,
	currentVM module.VersionMap,
) (module.VersionMap, error) {
	for moduleName, currentVersion := range currentVM {
		if _, exists := fromVM[moduleName]; exists {
			continue
		}

		if _, allowed := zkpRepairExistingUntrackedModules[moduleName]; !allowed {
			return nil, fmt.Errorf(
				"unexpected module %q missing from x/upgrade version map",
				moduleName,
			)
		}

		fromVM[moduleName] = currentVersion
	}

	return fromVM, nil
}

func (app *App) runZKPIAVLRepairUpgrade(
	ctx context.Context,
	_ upgradetypes.Plan,
	fromVM module.VersionMap,
) (module.VersionMap, error) {
	currentVM := app.ModuleManager.GetVersionMap()
	fromVM, err := prepareZKPIAVLRepairVersionMap(fromVM, currentVM)
	if err != nil {
		return nil, err
	}

	toVM, err := app.ModuleManager.RunMigrations(ctx, app.Configurator(), fromVM)
	if err != nil {
		return nil, fmt.Errorf("run module migrations: %w", err)
	}

	if err := app.ZkpKeeper.SetParams(ctx, types.NewParams(zkpRepairAuthority)); err != nil {
		return nil, fmt.Errorf("restore zkp params: %w", err)
	}

	sdkCtx := sdk.UnwrapSDKContext(ctx)
	app.ZkpKeeper.StoreTrustedContract(sdkCtx, zkpRepairArbitrumTrustedContract)

	params := app.ZkpKeeper.GetParams(ctx)
	if params.Authority != zkpRepairAuthority {
		return nil, fmt.Errorf(
			"zkp params verification failed: expected authority %s, got %s",
			zkpRepairAuthority,
			params.Authority,
		)
	}

	if !app.ZkpKeeper.IsTrustedContract(sdkCtx, zkpRepairArbitrumTrustedContract) {
		return nil, fmt.Errorf(
			"zkp trusted-contract verification failed for %s",
			zkpRepairArbitrumTrustedContract,
		)
	}

	return toVM, nil
}
