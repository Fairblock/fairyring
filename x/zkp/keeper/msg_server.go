package keeper

import (
	"context"

	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"

	"github.com/Fairblock/fairyring/x/zkp/types"
)

type msgServer struct {
	Keeper
}

func NewMsgServerImpl(keeper Keeper) types.MsgServer {
	return &msgServer{Keeper: keeper}
}

var _ types.MsgServer = msgServer{}

func (ms msgServer) AddTrustedContract(goCtx context.Context, msg *types.MsgAddTrustedContract) (*types.MsgAddTrustedContractResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	authority := ms.GetAuthority(ctx)
	if authority != msg.Authority {
		return nil, errorsmod.Wrapf(govtypes.ErrInvalidSigner, "unauthorized: expected %s, got %s", authority, msg.Authority)
	}

	if ms.IsTrustedContract(ctx, msg.ContractAddress) {
		return nil, errorsmod.Wrapf(sdkerrors.ErrInvalidRequest, "contract %s is already trusted", msg.ContractAddress)
	}

	ms.StoreTrustedContract(ctx, msg.ContractAddress)
	ctx.EventManager().EmitEvent(sdk.NewEvent(
		types.ModuleName,
		sdk.NewAttribute(sdk.AttributeKeyAction, "add_trusted_contract"),
		sdk.NewAttribute("contract_address", msg.ContractAddress),
		sdk.NewAttribute("authority", msg.Authority),
	))

	return &types.MsgAddTrustedContractResponse{}, nil
}

func (ms msgServer) RemoveTrustedContract(goCtx context.Context, msg *types.MsgRemoveTrustedContract) (*types.MsgRemoveTrustedContractResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	authority := ms.GetAuthority(ctx)
	if authority != msg.Authority {
		return nil, errorsmod.Wrapf(govtypes.ErrInvalidSigner, "unauthorized: expected %s, got %s", authority, msg.Authority)
	}

	if !ms.IsTrustedContract(ctx, msg.ContractAddress) {
		return nil, errorsmod.Wrapf(sdkerrors.ErrNotFound, "contract %s is not in the trusted list", msg.ContractAddress)
	}

	ms.DeleteTrustedContract(ctx, msg.ContractAddress)
	ctx.EventManager().EmitEvent(sdk.NewEvent(
		types.ModuleName,
		sdk.NewAttribute(sdk.AttributeKeyAction, "remove_trusted_contract"),
		sdk.NewAttribute("contract_address", msg.ContractAddress),
		sdk.NewAttribute("authority", msg.Authority),
	))

	return &types.MsgRemoveTrustedContractResponse{}, nil
}
