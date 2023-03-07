package keeper_test

import (
	"context"
	"testing"

	keepertest "fairyring/testutil/keeper"
	"fairyring/x/fairblock/keeper"
	"fairyring/x/fairblock/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func setupMsgServer(t testing.TB) (types.MsgServer, context.Context) {
	k, ctx := keepertest.FairblockKeeper(t)
	return keeper.NewMsgServerImpl(*k), sdk.WrapSDKContext(ctx)
}
