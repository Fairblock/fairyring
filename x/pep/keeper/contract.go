package keeper

import (
	"context"

	"cosmossdk.io/store/prefix"
	storetypes "cosmossdk.io/store/types"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/runtime"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// SetContractEntry set a specific contract entry in the store by identity
func (k Keeper) SetContractEntry(ctx context.Context, contract types.RegisterdContract) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.ContractKeyPrefix))
	b := k.cdc.MustMarshal(&contract)
	store.Set([]byte(contract.Identity), b)
}

// GetContractEntriesByID returns a the list of contracts for an identity
func (k Keeper) GetContractEntriesByID(
	ctx context.Context,
	identity string,
) (val types.RegisterdContract, found bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.ContractKeyPrefix))

	b := store.Get([]byte(identity))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// GetContractEntry fetches the details of a contract by identity and contract address
func (k Keeper) GetContractEntry(
	ctx context.Context,
	reqID string,
	contractAddr string,
) (val types.ContractDetails, found bool) {
	c, found := k.GetContractEntriesByID(ctx, reqID)
	if !found || len(c.Contracts) == 0 {
		return types.ContractDetails{}, found
	}

	for _, con := range c.Contracts {
		if con.ContractAddress == contractAddr {
			return *con, true
		}
	}

	return types.ContractDetails{}, false
}

// AppendContractToEntry appends a new contract detail to an already existing contract entry
func (k Keeper) AppendContractToEntry(
	ctx context.Context,
	contract types.RegisterdContract,
) {
	c, found := k.GetContractEntriesByID(ctx, contract.Identity)
	if !found {
		k.logger.Error("contract entry not found for identity: ", contract.Identity)
		return
	}
	c.Contracts = append(c.Contracts, contract.Contracts...)
	k.SetContractEntry(ctx, c)
}

// GetAllContractEntries returns all contracts for all identities
func (k Keeper) GetAllContractEntries(ctx context.Context) (list []types.RegisterdContract) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.ContractKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.RegisterdContract
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}

func (k Keeper) ExecuteContract(ctx sdk.Context, contractAddr string, msg types.ExecuteContractMsg) {
	addr := sdk.MustAccAddressFromBech32(contractAddr)
	msgBytes, err := msg.Marshal()
	if err != nil {
		k.logger.Error("error marshalling msg for contract: %s", contractAddr)
		return
	}
	_, err = k.wasmKeeper.Execute(ctx, addr, addr, msgBytes, sdk.Coins{})
	if err != nil {
		k.logger.Error("error executing contract: %s", contractAddr)
	}
}
