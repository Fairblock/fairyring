package keeper_test

import (
	"context"
	"testing"

	keepertest "fairyring/testutil/keeper"
	"fairyring/x/fairyring/keeper"
	"fairyring/x/fairyring/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func setupMsgServer(t testing.TB) (types.MsgServer, context.Context) {
	k, ctx := keepertest.FairyringKeeper(t)
	return keeper.NewMsgServerImpl(*k), sdk.WrapSDKContext(ctx)
}
