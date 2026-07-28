package app_test

import (
	"testing"

	"cosmossdk.io/log"
	cmtproto "github.com/cometbft/cometbft/proto/tendermint/types"
	dbm "github.com/cosmos/cosmos-db"
	"github.com/cosmos/cosmos-sdk/client/flags"
	simtestutil "github.com/cosmos/cosmos-sdk/testutil/sims"
	sdk "github.com/cosmos/cosmos-sdk/types"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"
	"github.com/stretchr/testify/require"

	"github.com/Fairblock/fairyring/app"
)

func init() {
	config := sdk.GetConfig()
	config.SetBech32PrefixForAccount(app.AccountAddressPrefix, app.AccountAddressPrefix+"pub")
}

// TestCustomModuleAuthoritiesUseGovModuleAccount prevents the custom modules
// from being wired to their own module accounts. MsgUpdateParams proposals are
// executed by x/gov, so PEP and keyshare must accept the x/gov module account as
// their keeper authority. ZKP derives the same default from its params.
func TestCustomModuleAuthoritiesUseGovModuleAccount(t *testing.T) {
	db := dbm.NewMemDB()
	t.Cleanup(func() { require.NoError(t, db.Close()) })

	appOpts := simtestutil.AppOptionsMap{
		flags.FlagHome: t.TempDir(),
	}

	fairyringApp, err := app.New(log.NewNopLogger(), db, nil, true, appOpts)
	require.NoError(t, err)

	expected := authtypes.NewModuleAddress(govtypes.ModuleName).String()
	require.Equal(t, expected, fairyringApp.PepKeeper.GetAuthority())
	require.Equal(t, expected, fairyringApp.KeyshareKeeper.GetAuthority())

	ctx := fairyringApp.NewUncachedContext(false, cmtproto.Header{})
	require.Equal(t, expected, fairyringApp.ZkpKeeper.GetAuthority(ctx))
}
