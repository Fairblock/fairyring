package app

import (
	"testing"

	coreheader "cosmossdk.io/core/header"
	"cosmossdk.io/log"
	upgradetypes "cosmossdk.io/x/upgrade/types"
	zkptypes "github.com/Fairblock/fairyring/x/zkp/types"
	abci "github.com/cometbft/cometbft/abci/types"
	cmtproto "github.com/cometbft/cometbft/proto/tendermint/types"
	dbm "github.com/cosmos/cosmos-db"
	"github.com/cosmos/cosmos-sdk/client/flags"
	simtestutil "github.com/cosmos/cosmos-sdk/testutil/sims"
	"github.com/stretchr/testify/require"
)

func TestZKPIAVLRepairEmergencyPreBlockSameHeight(t *testing.T) {
	db := dbm.NewMemDB()
	t.Cleanup(func() {
		require.NoError(t, db.Close())
	})

	appOpts := simtestutil.AppOptionsMap{
		flags.FlagHome: t.TempDir(),
	}

	fairyringApp, err := New(log.NewNopLogger(), db, nil, true, appOpts)
	require.NoError(t, err)

	const height int64 = 1
	header := cmtproto.Header{
		ChainID: zkpIAVLRepairEmergencyChainID,
		Height:  height,
	}
	ctx := fairyringApp.NewUncachedContext(false, header).
		WithHeaderInfo(coreheader.Info{
			ChainID: header.ChainID,
			Height:  height,
		})

	currentVM := fairyringApp.ModuleManager.GetVersionMap()
	require.Len(t, currentVM, zkpIAVLRepairExpectedCurrentVersionEntries)

	storedVM := cloneZKPIAVLRepairVersionMap(currentVM)
	for moduleName := range zkpRepairExistingUntrackedModules {
		delete(storedVM, moduleName)
	}
	require.Len(t, storedVM, zkpIAVLRepairExpectedStoredVersionEntries)
	require.NoError(t, fairyringApp.UpgradeKeeper.SetModuleVersionMap(ctx, storedVM))

	require.NoError(
		t,
		fairyringApp.ZkpKeeper.SetParams(
			ctx,
			zkptypes.NewParams(zkpIAVLRepairBrokenAuthority),
		),
	)
	require.False(
		t,
		fairyringApp.ZkpKeeper.IsTrustedContract(ctx, zkpRepairArbitrumTrustedContract),
	)
	require.False(t, fairyringApp.ZkpKeeper.IsTrustedContract(ctx, zkpIAVLRepairBaseContract))

	_, err = fairyringApp.UpgradeKeeper.GetUpgradePlan(ctx)
	require.ErrorIs(t, err, upgradetypes.ErrNoUpgradePlanFound)

	resp, err := fairyringApp.preBlockerWithZKPIAVLRepairEmergencyHeight(height)(
		ctx,
		&abci.RequestFinalizeBlock{Height: height},
	)
	require.NoError(t, err)
	require.NotNil(t, resp)
	require.True(t, resp.ConsensusParamsChanged)

	doneHeight, err := fairyringApp.UpgradeKeeper.GetDoneHeight(ctx, zkpIAVLRepairUpgradeName)
	require.NoError(t, err)
	require.Equal(t, height, doneHeight)

	_, err = fairyringApp.UpgradeKeeper.GetUpgradePlan(ctx)
	require.ErrorIs(t, err, upgradetypes.ErrNoUpgradePlanFound)

	params := fairyringApp.ZkpKeeper.GetParams(ctx)
	require.Equal(t, zkpRepairAuthority, params.Authority)
	require.True(t, fairyringApp.ZkpKeeper.IsTrustedContract(ctx, zkpRepairArbitrumTrustedContract))
	require.False(t, fairyringApp.ZkpKeeper.IsTrustedContract(ctx, zkpIAVLRepairBaseContract))

	gotVM, err := fairyringApp.UpgradeKeeper.GetModuleVersionMap(ctx)
	require.NoError(t, err)
	require.Equal(t, currentVM, gotVM)
}

func TestZKPIAVLRepairEmergencyDisabledAtZero(t *testing.T) {
	db := dbm.NewMemDB()
	t.Cleanup(func() {
		require.NoError(t, db.Close())
	})

	appOpts := simtestutil.AppOptionsMap{
		flags.FlagHome: t.TempDir(),
	}

	fairyringApp, err := New(log.NewNopLogger(), db, nil, true, appOpts)
	require.NoError(t, err)

	header := cmtproto.Header{
		ChainID: zkpIAVLRepairEmergencyChainID,
		Height:  1,
	}
	ctx := fairyringApp.NewUncachedContext(false, header).
		WithHeaderInfo(coreheader.Info{
			ChainID: header.ChainID,
			Height:  header.Height,
		})

	require.NoError(t, fairyringApp.maybeScheduleZKPIAVLRepairEmergency(ctx, 0))
	_, err = fairyringApp.UpgradeKeeper.GetUpgradePlan(ctx)
	require.ErrorIs(t, err, upgradetypes.ErrNoUpgradePlanFound)
}
