package keeper_test

import (
	"context"
	"fairyring/x/keyshare"
	"fairyring/x/keyshare/keeper"
	"fairyring/x/keyshare/types"
	"strconv"
	"testing"

	keepertest "fairyring/testutil/keeper"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

func setupMsgServerSendKeyshare(t testing.TB) (types.MsgServer, keeper.Keeper, context.Context) {
	k, ctx := keepertest.KeyshareKeeper(t)
	keyshare.InitGenesis(ctx, *k, *types.DefaultGenesis())

	return keeper.NewMsgServerImpl(*k), *k, sdk.WrapSDKContext(ctx)
}

func TestSendKeyshare(t *testing.T) {
	msgServer, keeper, context := setupMsgServerSendKeyshare(t)

	ctx := sdk.UnwrapSDKContext(context)

	registerResponse, err := msgServer.RegisterValidator(context, &types.MsgRegisterValidator{
		Creator: alice,
	})

	require.Nil(t, err)
	require.EqualValues(t, types.MsgRegisterValidatorResponse{
		Creator: alice,
	}, *registerResponse)

	sendResponse, err1 := msgServer.SendKeyshare(context, &types.MsgSendKeyshare{
		Creator:     alice,
		BlockHeight: uint64(ctx.BlockHeight()),
		Message:     "this is a test",
	})

	require.Nil(t, err1)
	require.EqualValues(t, types.MsgSendKeyshareResponse{
		Creator:             alice,
		Keyshare:            "this is a test",
		BlockHeight:         uint64(ctx.BlockHeight()),
		ReceivedBlockHeight: uint64(ctx.BlockHeight()),
	}, *sendResponse)

	keyshare, found := keeper.GetKeyShare(ctx, alice, uint64(ctx.BlockHeight()))

	require.True(t, found)
	require.EqualValues(t, types.KeyShare{
		Validator:           alice,
		KeyShare:            "this is a test",
		BlockHeight:         uint64(ctx.BlockHeight()),
		ReceivedBlockHeight: uint64(ctx.BlockHeight()),
		ReceivedTimestamp:   keyshare.GetReceivedTimestamp(),
	}, keyshare)

	events := sdk.StringifyEvents(ctx.EventManager().ABCIEvents())
	require.Len(t, events, 2)
	event := events[0]
	require.EqualValues(t, sdk.StringEvent{
		Type: "keyshare sent",
		Attributes: []sdk.Attribute{
			{Key: "validator", Value: alice},
			{Key: "keyshare block height", Value: strconv.FormatUint(uint64(ctx.BlockHeight()), 10)},
			{Key: "received block height", Value: strconv.FormatUint(uint64(ctx.BlockHeight()), 10)},
			{Key: "keyshare message", Value: "this is a test"},
		},
	}, event)
}

func TestNotRegisteredSend(t *testing.T) {
	msgServer, _, context := setupMsgServerSendKeyshare(t)

	ctx := sdk.UnwrapSDKContext(context)
	sendResponse, err := msgServer.SendKeyshare(context, &types.MsgSendKeyshare{
		Creator:     alice,
		BlockHeight: uint64(ctx.BlockHeight()),
		Message:     "this is a test",
	})

	require.NotNil(t, err)
	require.Nil(t, sendResponse)

	require.True(t, types.ErrValidatorNotRegistered.Is(err))
}

func TestMultipleSends(t *testing.T) {
	msgServer, keeper, context := setupMsgServerSendKeyshare(t)

	ctx := sdk.UnwrapSDKContext(context)

	registerResponse, err := msgServer.RegisterValidator(context, &types.MsgRegisterValidator{
		Creator: alice,
	})

	require.Nil(t, err)
	require.EqualValues(t, types.MsgRegisterValidatorResponse{
		Creator: alice,
	}, *registerResponse)

	blockHeight := uint64(ctx.BlockHeight())

	_, err1 := msgServer.SendKeyshare(context, &types.MsgSendKeyshare{
		Creator:     alice,
		BlockHeight: blockHeight,
		Message:     "testing 1",
	})

	require.Nil(t, err1)

	_, err2 := msgServer.SendKeyshare(context, &types.MsgSendKeyshare{
		Creator:     alice,
		BlockHeight: blockHeight,
		Message:     "testing2",
	})

	require.Nil(t, err2)

	events := sdk.StringifyEvents(ctx.EventManager().ABCIEvents())
	require.Len(t, events, 2)

	keyshare, found := keeper.GetKeyShare(ctx, alice, blockHeight)
	require.True(t, found)
	require.EqualValues(t, "testing2", keyshare.GetKeyShare())
}
