package keeper_test

import (
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

func TestRegisterContract(t *testing.T) {
	// Initialize the keeper, context, and other dependencies
	k, ctx := keepertest.PepKeeper(t)
	goCtx := sdk.WrapSDKContext(ctx)
	srv := keeper.NewMsgServerImpl(k)

	creator := "cosmos1nm0rrq86ucezaf8uj35pq9fpwr5r82cl8sc7p5"

	// Test case 1: Invalid contract address
	msg := &types.MsgRegisterContract{
		Creator:         creator,
		ContractAddress: "invalid_address", // Invalid Bech32 address
		Identity:        "test_identity",
	}

	_, err := srv.RegisterContract(goCtx, msg)
	require.Error(t, err)
	require.Equal(t, "invalid contract address", err.Error())

	// Test case 2: Contract information not found
	msg.ContractAddress = creator
	_, err = srv.RegisterContract(goCtx, msg)
	require.Error(t, err)
	require.Equal(t, "wasm keeper has not been set", err.Error())
}
