package app

import (
	"errors"
	"fmt"

	upgradetypes "cosmossdk.io/x/upgrade/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
)

const (
	zkpIAVLRepairUpgradeName = "v1.0.1-to-v1.0.2-iavl-zkp-repair"

	zkpIAVLRepairEmergencyChainID = "fairblock-mainnet-1"

	// Keep production activation disabled until the final repair height has been
	// selected from live-chain preflight data. The exact same scheduling path is
	// exercised in tests by supplying an explicit activation height.
	zkpIAVLRepairEmergencyActivationHeight int64 = 0

	zkpIAVLRepairBrokenAuthority = "fairy10d07y265gmmuvt4z0w9aw880jnsr700j5c6f67"
	zkpIAVLRepairBaseContract    = "fairy1yyca08xqdgvjz0psg56z67ejh9xms6l436u8y58m82npdqqhmmtqepue5l"

	zkpIAVLRepairExpectedStoredVersionEntries  = 20
	zkpIAVLRepairExpectedCurrentVersionEntries = 31
)

func cloneZKPIAVLRepairVersionMap(vm module.VersionMap) module.VersionMap {
	out := make(module.VersionMap, len(vm))
	for name, version := range vm {
		out[name] = version
	}
	return out
}

func validateZKPIAVLRepairEmergencyVersionMap(
	storedVM module.VersionMap,
	currentVM module.VersionMap,
) error {
	if len(storedVM) != zkpIAVLRepairExpectedStoredVersionEntries {
		return fmt.Errorf(
			"unexpected stored module version-map size: expected %d, got %d",
			zkpIAVLRepairExpectedStoredVersionEntries,
			len(storedVM),
		)
	}

	if len(currentVM) != zkpIAVLRepairExpectedCurrentVersionEntries {
		return fmt.Errorf(
			"unexpected current module version-map size: expected %d, got %d",
			zkpIAVLRepairExpectedCurrentVersionEntries,
			len(currentVM),
		)
	}

	prepared, err := prepareZKPIAVLRepairVersionMap(
		cloneZKPIAVLRepairVersionMap(storedVM),
		currentVM,
	)
	if err != nil {
		return fmt.Errorf("validate repair module version map: %w", err)
	}

	if len(prepared) != len(currentVM) {
		return fmt.Errorf(
			"prepared module version-map size mismatch: expected %d, got %d",
			len(currentVM),
			len(prepared),
		)
	}

	return nil
}

// maybeScheduleZKPIAVLRepairEmergency installs the incident repair plan at the
// current block height only when every expected mainnet state guard matches.
// x/upgrade explicitly permits same-height scheduling for emergency hard-fork
// recovery. The caller must invoke the normal runtime module pre-block lifecycle
// immediately afterward so x/upgrade can execute the plan in the same block.
func (app *App) maybeScheduleZKPIAVLRepairEmergency(
	ctx sdk.Context,
	activationHeight int64,
) error {
	if activationHeight <= 0 {
		return nil
	}

	if ctx.ChainID() != zkpIAVLRepairEmergencyChainID {
		return nil
	}

	if ctx.BlockHeight() != activationHeight {
		return nil
	}

	doneHeight, err := app.UpgradeKeeper.GetDoneHeight(ctx, zkpIAVLRepairUpgradeName)
	if err != nil {
		return fmt.Errorf("read repair upgrade done height: %w", err)
	}
	if doneHeight != 0 {
		// Idempotent guard for an already-completed repair. A normally advancing
		// chain will never revisit this height, but do not try to schedule again.
		return nil
	}

	if !app.UpgradeKeeper.HasHandler(zkpIAVLRepairUpgradeName) {
		return fmt.Errorf("repair upgrade handler %q is not registered", zkpIAVLRepairUpgradeName)
	}

	planAlreadyPresent := false
	plan, err := app.UpgradeKeeper.GetUpgradePlan(ctx)
	switch {
	case err == nil:
		if plan.Name != zkpIAVLRepairUpgradeName || plan.Height != activationHeight {
			return fmt.Errorf(
				"conflicting upgrade plan at emergency repair height: name=%q height=%d",
				plan.Name,
				plan.Height,
			)
		}
		planAlreadyPresent = true
	case errors.Is(err, upgradetypes.ErrNoUpgradePlanFound):
		// Expected governance-free hard-fork path: continue through guards and
		// schedule the plan at the current height after validating state.
	case err != nil:
		return fmt.Errorf("read existing upgrade plan: %w", err)
	}

	params := app.ZkpKeeper.GetParams(ctx)
	if params.Authority != zkpIAVLRepairBrokenAuthority {
		return fmt.Errorf(
			"unexpected pre-repair zkp authority: expected %s, got %s",
			zkpIAVLRepairBrokenAuthority,
			params.Authority,
		)
	}

	if !app.ZkpKeeper.IsTrustedContract(ctx, zkpRepairArbitrumTrustedContract) {
		return fmt.Errorf(
			"expected Arbitrum trusted contract %s is absent",
			zkpRepairArbitrumTrustedContract,
		)
	}

	if app.ZkpKeeper.IsTrustedContract(ctx, zkpIAVLRepairBaseContract) {
		return fmt.Errorf(
			"Base trusted contract %s is unexpectedly present before repair",
			zkpIAVLRepairBaseContract,
		)
	}

	storedVM, err := app.UpgradeKeeper.GetModuleVersionMap(ctx)
	if err != nil {
		return fmt.Errorf("read stored module version map: %w", err)
	}
	if err := validateZKPIAVLRepairEmergencyVersionMap(
		storedVM,
		app.ModuleManager.GetVersionMap(),
	); err != nil {
		return err
	}

	if planAlreadyPresent {
		return nil
	}

	plan = upgradetypes.Plan{
		Name:   zkpIAVLRepairUpgradeName,
		Height: activationHeight,
	}
	if err := app.UpgradeKeeper.ScheduleUpgrade(ctx, plan); err != nil {
		return fmt.Errorf("schedule emergency repair upgrade: %w", err)
	}

	ctx.Logger().Error(
		"scheduled guarded emergency IAVL/ZKP repair upgrade",
		"name", plan.Name,
		"height", plan.Height,
	)

	return nil
}
