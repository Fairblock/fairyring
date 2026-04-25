package keeper

import (
	"context"

	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"

	"github.com/Fairblock/fairyring/x/zkp/types"
)

func (ms msgServer) UpdateParams(goCtx context.Context, msg *types.MsgUpdateParams) (*types.MsgUpdateParamsResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	authority := ms.GetAuthority(ctx)
	if authority != msg.Authority {
		return nil, errorsmod.Wrapf(govtypes.ErrInvalidSigner, "unauthorized: expected %s, got %s", authority, msg.Authority)
	}

	if err := ms.SetParams(ctx, msg.Params); err != nil {
		return nil, err
	}

	ctx.EventManager().EmitEvent(sdk.NewEvent(
		types.ModuleName,
		sdk.NewAttribute(sdk.AttributeKeyAction, "update_params"),
		sdk.NewAttribute("authority", msg.Authority),
		sdk.NewAttribute("zkp_authority", msg.Params.Authority),
	))

	return &types.MsgUpdateParamsResponse{}, nil
}
