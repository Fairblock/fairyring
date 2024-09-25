package keeper

import (
	"context"
	"errors"

	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) RegisterContract(
	goCtx context.Context,
	msg *types.MsgRegisterContract,
) (*types.MsgRegisterContractResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

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
