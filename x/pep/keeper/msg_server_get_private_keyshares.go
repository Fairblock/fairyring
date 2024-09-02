package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) GetPrivateKeyshares(goCtx context.Context, msg *types.MsgGetPrivateKeyshares) (*types.MsgGetPrivateKeysharesResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message
	_ = ctx

	return &types.MsgGetPrivateKeysharesResponse{}, nil
}
