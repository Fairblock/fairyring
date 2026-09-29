package app

import (
	"context"
	"testing"

	"cosmossdk.io/log"
	upgradetypes "cosmossdk.io/x/upgrade/types"
	abci "github.com/cometbft/cometbft/abci/types"
	cmtproto "github.com/cometbft/cometbft/proto/tendermint/types"
	dbm "github.com/cosmos/cosmos-db"
	"github.com/cosmos/cosmos-sdk/client/flags"
	simtestutil "github.com/cosmos/cosmos-sdk/testutil/sims"
	"github.com/cosmos/cosmos-sdk/types/module"
	coreheader "cosmossdk.io/core/header"
	"github.com/stretchr/testify/require"
)

func TestKeysharePreBlockerDelegatesToModulePreBlockers(t *testing.T) {
	db := dbm.NewMemDB()
	t.Cleanup(func() {
		require.NoError(t, db.Close())
	})

	appOpts := simtestutil.AppOptionsMap{
		flags.FlagHome: t.TempDir(),
	}

	fairyringApp, err := New(log.NewNopLogger(), db, nil, true, appOpts)
	require.NoError(t, err)

	const (
		upgradeName = "test-keyshare-preblock-delegation"
		height      = int64(1)
	)

	handlerCalled := false
	fairyringApp.UpgradeKeeper.SetUpgradeHandler(
		upgradeName,
		func(_ context.Context, _ upgradetypes.Plan, fromVM module.VersionMap) (module.VersionMap, error) {
			handlerCalled = true
			return fromVM, nil
		},
	)

	header := cmtproto.Header{
		ChainID: "preblock-delegation-test",
		Height:  height,
	}
	ctx := fairyringApp.NewUncachedContext(false, header).
		WithHeaderInfo(coreheader.Info{
			ChainID: header.ChainID,
			Height:  height,
		})

	plan := upgradetypes.Plan{
		Name:   upgradeName,
		Height: height,
	}
	require.NoError(t, fairyringApp.UpgradeKeeper.ScheduleUpgrade(ctx, plan))

	resp, err := fairyringApp.preBlocker()(ctx, &abci.RequestFinalizeBlock{Height: height})
	require.NoError(t, err)
	require.NotNil(t, resp)
	require.True(t, handlerCalled, "x/upgrade handler was not reached through the custom keyshare pre-blocker")

	doneHeight, err := fairyringApp.UpgradeKeeper.GetDoneHeight(ctx, upgradeName)
	require.NoError(t, err)
	require.Equal(t, height, doneHeight)

	_, err = fairyringApp.UpgradeKeeper.GetUpgradePlan(ctx)
	require.ErrorIs(t, err, upgradetypes.ErrNoUpgradePlanFound)
}
