package keeper

import (
	"context"
	"errors"

	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) UnregisterContract(
	goCtx context.Context,
	msg *types.MsgUnregisterContract,
) (*types.MsgUnregisterContractResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	contracAddr, err := sdk.AccAddressFromBech32(msg.ContractAddress)
	if err != nil {
		return nil, errors.New("invalid contract address")
	}

	contractInfo := k.wasmKeeper.GetContractInfo(ctx, contracAddr)
	if contractInfo == nil {
		return nil, errors.New("contract information not found")
	}

	if msg.Creator != contractInfo.Admin && msg.Creator != contractInfo.Creator {
		return nil, errors.New("unautorized deregistration; only cretor and admin can deregister")
	}

	entry, found := k.GetContractEntriesByID(ctx, msg.Identity)
	contracts := make([]*types.ContractDetails, 0)
	detailsFound := false

	if found && len(entry.Contracts) != 0 {
		for _, c := range entry.Contracts {
			if c.ContractAddress == msg.ContractAddress {
				detailsFound = true
			} else {
				contracts = append(contracts, c)
			}
		}
	} else {
		return &types.MsgUnregisterContractResponse{},
			errors.New("no entry found for the provided identity")
	}

	if detailsFound {
		entry.Contracts = contracts
		k.SetContractEntry(ctx, entry)
		return &types.MsgUnregisterContractResponse{}, nil
	}

	return &types.MsgUnregisterContractResponse{},
		errors.New("contract not found in the list of registered contracts")
}
