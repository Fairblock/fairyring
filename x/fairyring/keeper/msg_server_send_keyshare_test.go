package keeper_test

import (
	"context"
	"fairyring/x/fairyring"
	"fairyring/x/fairyring/keeper"
	"fairyring/x/fairyring/types"
	"testing"

	keepertest "fairyring/testutil/keeper"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func setupMsgServerSendKeyshare(t testing.TB) (types.MsgServer, keeper.Keeper, context.Context) {
	k, ctx := keepertest.FairyringKeeper(t)
	fairyring.InitGenesis(ctx, *k, *types.DefaultGenesis())

	return keeper.NewMsgServerImpl(*k), *k, sdk.WrapSDKContext(ctx)
}
