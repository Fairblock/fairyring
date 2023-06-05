package keeper_test

import (
	"testing"

	testkeeper "github.com/FairBlock/fairyring/testutil/keeper"
	"github.com/FairBlock/fairyring/x/keyshare/types"

	"github.com/stretchr/testify/require"
)

func TestGetParams(t *testing.T) {
	k, ctx := testkeeper.KeyshareKeeper(t)
	params := types.DefaultParams()

	k.SetParams(ctx, params)

	require.EqualValues(t, params, k.GetParams(ctx))
}
