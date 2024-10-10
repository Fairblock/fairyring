package keeper

import (
	"context"
	"errors"
	"reflect"

	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) RegisterContract(
	goCtx context.Context,
	msg *types.MsgRegisterContract,
) (*types.MsgRegisterContractResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	contracAddr, err := sdk.AccAddressFromBech32(msg.ContractAddress)
	if err != nil {
		return nil, errors.New("invalid contract address")
	}

	if k.wasmKeeper == nil || reflect.ValueOf(k.wasmKeeper).IsZero() {
		return nil, errors.New("wasm keeper has not been set")
	}

	contractInfo := k.wasmKeeper.GetContractInfo(ctx, contracAddr)
	if contractInfo == nil {
		return nil, errors.New("contract information not found")
	}

	if msg.Creator != contractInfo.Admin && msg.Creator != contractInfo.Creator {
		return nil, errors.New("unautorized registration; only cretor and admin can register")
	}

	var contDetails = types.ContractDetails{
		Registrar:       msg.Creator,
		ContractAddress: msg.ContractAddress,
	}

	entry, found := k.GetContractEntriesByID(ctx, msg.Identity)
	if found {
		if len(entry.Contracts) != 0 {
			for _, c := range entry.Contracts {
				if c.ContractAddress == msg.ContractAddress {
					return nil, errors.New("contract is already registered for this identity")
				}
			}
		} else {
			entry.Contracts = make([]*types.ContractDetails, 0)
		}

	}

	entry.Identity = msg.Identity
	entry.Contracts = append(entry.Contracts, &contDetails)

	k.SetContractEntry(ctx, entry)

	return &types.MsgRegisterContractResponse{}, nil
}
