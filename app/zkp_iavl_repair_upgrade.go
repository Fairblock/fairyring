package app

import (
	"context"
	"fmt"

	"github.com/Fairblock/fairyring/x/zkp/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	sdk "github.com/cosmos/cosmos-sdk/types"
	upgradetypes "cosmossdk.io/x/upgrade/types"
)

const (
	zkpRepairAuthority = "fairy15rl6skup50epum3zz6v7zl2z762c9hq0rl886v"
	zkpRepairArbitrumTrustedContract = "fairy1suhgf5svhu4usrurvxzlgn54ksxmn8gljarjtxqnapv8kjnp4nrs59guk9"
)

func (app *App) runZKPIAVLRepairUpgrade(
	ctx context.Context,
	_ upgradetypes.Plan,
	fromVM module.VersionMap,
) (module.VersionMap, error) {
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
