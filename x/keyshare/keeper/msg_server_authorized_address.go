package keeper

import (
	"context"
	"fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) CreateAuthorizedAddress(goCtx context.Context, msg *types.MsgCreateAuthorizedAddress) (*types.MsgCreateAuthorizedAddressResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	_, isFound := k.GetAuthorizedAddress(
		ctx,
		msg.Target,
	)
	if isFound {
		return nil, types.ErrAddressAlreadyAuthorized
	}

	if msg.Target == msg.Creator {
		return nil, types.ErrAuthorizeSelfAddress
	}

	_, found := k.GetValidatorSet(ctx, msg.Creator)
	// Only allow registered validator to authorize address
	if !found {
		return nil, types.ErrOnlyValidatorCanAuthorizeAddr.Wrap(msg.Creator)
	}

	if k.GetAuthorizedCount(ctx, msg.Creator) >= 1 {
		return nil, types.ErrExceedMaxAuthAddr
	}

	var authorizedAddress = types.AuthorizedAddress{
		AuthorizedBy: msg.Creator,
		Target:       msg.Target,
		IsAuthorized: true,
	}

	k.SetAuthorizedAddress(
		ctx,
		authorizedAddress,
	)
	k.IncreaseAuthorizedCount(ctx, msg.Creator)
	return &types.MsgCreateAuthorizedAddressResponse{}, nil
}

func (k msgServer) UpdateAuthorizedAddress(goCtx context.Context, msg *types.MsgUpdateAuthorizedAddress) (*types.MsgUpdateAuthorizedAddressResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	valFound, isFound := k.GetAuthorizedAddress(
		ctx,
		msg.Target,
	)
	if !isFound {
		return nil, types.ErrAuthorizedAddrNotFound
	}

	if msg.Creator != valFound.AuthorizedBy {
		return nil, types.ErrNotAuthorizedAddrCreator
	}

	if msg.Target == msg.Creator {
		return nil, types.ErrAuthorizeSelfAddress
	}

	var authorizedAddress = types.AuthorizedAddress{
		AuthorizedBy: msg.Creator,
		Target:       msg.Target,
		IsAuthorized: msg.IsAuthorized,
	}

	k.SetAuthorizedAddress(ctx, authorizedAddress)

	return &types.MsgUpdateAuthorizedAddressResponse{}, nil
}

func (k msgServer) DeleteAuthorizedAddress(goCtx context.Context, msg *types.MsgDeleteAuthorizedAddress) (*types.MsgDeleteAuthorizedAddressResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	valFound, isFound := k.GetAuthorizedAddress(
		ctx,
		msg.Creator,
	)
	if !isFound {
		return nil, types.ErrAuthorizedAddrNotFound
	}

	// Allow the authorized addr creator / target authorized address to remove authorization
	if msg.Creator != valFound.AuthorizedBy && msg.Creator != valFound.Target {
		return nil, types.ErrNotTargetOrAuthAddrCreator
	}

	k.RemoveAuthorizedAddress(
		ctx,
		msg.Target,
	)

	k.DecreaseAuthorizedCount(ctx, valFound.AuthorizedBy)

	return &types.MsgDeleteAuthorizedAddressResponse{}, nil
}
