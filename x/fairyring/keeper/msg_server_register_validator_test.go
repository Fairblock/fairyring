package keeper_test

import (
	"context"
	"fairyring/x/fairyring"
	"fairyring/x/fairyring/keeper"
	"fairyring/x/fairyring/types"
	"testing"

	keepertest "fairyring/testutil/keeper"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

func setupMsgServerRegisterValidator(t testing.TB) (types.MsgServer, keeper.Keeper, context.Context) {
	k, ctx := keepertest.FairyringKeeper(t)
	fairyring.InitGenesis(ctx, *k, *types.DefaultGenesis())

	return keeper.NewMsgServerImpl(*k), *k, sdk.WrapSDKContext(ctx)
}

func TestRegisterValidator(t *testing.T) {
	msgServer, keeper, context := setupMsgServerRegisterValidator(t)

	ctx := sdk.UnwrapSDKContext(context)

	registerResponse, err := msgServer.RegisterValidator(context, &types.MsgRegisterValidator{
		Creator: alice,
	})
	require.Nil(t, err)
	require.EqualValues(t, types.MsgRegisterValidatorResponse{
		Creator: alice,
	}, *registerResponse)

	aliceValidator, found := keeper.GetValidatorSet(ctx, alice)

	require.True(t, found)
	require.EqualValues(t, types.ValidatorSet{
		Index:     alice,
		Validator: alice,
		IsActive:  true,
	}, aliceValidator)
}

func TestDupicateRegister(t *testing.T) {
	msgServer, _, context := setupMsgServerRegisterValidator(t)
	_, err := msgServer.RegisterValidator(context, &types.MsgRegisterValidator{
		Creator: alice,
	})

	require.Nil(t, err)

	aliceRegisterResponse2, err2 := msgServer.RegisterValidator(context, &types.MsgRegisterValidator{
		Creator: alice,
	})

	require.Nil(t, aliceRegisterResponse2)
	require.True(t, types.ErrValidatorAlreadyRegistered.Is(err2))
}
