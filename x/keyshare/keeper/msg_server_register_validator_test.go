package keeper_test

import (
	"context"
	"fairyring/x/keyshare"
	"fairyring/x/keyshare/keeper"
	"fairyring/x/keyshare/types"
	"testing"

	keepertest "fairyring/testutil/keeper"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

func setupMsgServerRegisterValidator(t testing.TB) (types.MsgServer, keeper.Keeper, context.Context) {
	k, ctx := keepertest.KeyshareKeeper(t)
	keyshare.InitGenesis(ctx, *k, *types.DefaultGenesis())

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

	events := sdk.StringifyEvents(ctx.EventManager().ABCIEvents())
	require.Len(t, events, 1)
	event := events[0]
	require.EqualValues(t, sdk.StringEvent{
		Type: "new validator registered",
		Attributes: []sdk.Attribute{
			{Key: "creator", Value: alice},
		},
	}, event)
}

func TestDupicateRegister(t *testing.T) {
	msgServer, _, context := setupMsgServerRegisterValidator(t)
	_, err := msgServer.RegisterValidator(context, &types.MsgRegisterValidator{
		Creator: alice,
	})

	ctx := sdk.UnwrapSDKContext(context)

	require.Nil(t, err)
	events := sdk.StringifyEvents(ctx.EventManager().ABCIEvents())
	require.Len(t, events, 1)
	event := events[0]
	require.EqualValues(t, sdk.StringEvent{
		Type: "new validator registered",
		Attributes: []sdk.Attribute{
			{Key: "creator", Value: alice},
		},
	}, event)

	aliceRegisterResponse2, err2 := msgServer.RegisterValidator(context, &types.MsgRegisterValidator{
		Creator: alice,
	})

	require.Nil(t, aliceRegisterResponse2)
	require.True(t, types.ErrValidatorAlreadyRegistered.Is(err2))
	events = sdk.StringifyEvents(ctx.EventManager().ABCIEvents())
	require.Len(t, events, 1)
}
