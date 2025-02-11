package keeper

import (
	"context"
	"encoding/json"

	"cosmossdk.io/store/prefix"
	storetypes "cosmossdk.io/store/types"
	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/runtime"
	sdk "github.com/cosmos/cosmos-sdk/types"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
)

// SetContractEntry set a specific contract entry in the store by identity
func (k Keeper) SetContractEntry(ctx context.Context, contract types.RegisteredContract) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.ContractKeyPrefix))
	b := k.cdc.MustMarshal(&contract)
	store.Set([]byte(contract.Identity), b)
}

// RemoveContractEntry removes a specific contract entry in the store by identity
func (k Keeper) RemoveContractEntry(ctx context.Context, identity string) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.ContractKeyPrefix))
	store.Delete([]byte(identity))
}

// GetContractEntriesByID returns a the list of contracts for an identity
func (k Keeper) GetContractEntriesByID(
	ctx context.Context,
	identity string,
) (val types.RegisteredContract, found bool) {
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
	contract types.RegisteredContract,
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
func (k Keeper) GetAllContractEntries(ctx context.Context) (list []types.RegisteredContract) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, types.KeyPrefix(types.ContractKeyPrefix))
	iterator := storetypes.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.RegisteredContract
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}

func (k Keeper) ExecuteContract(ctx sdk.Context, contractAddr string, msg types.ExecuteContractMsg) {
	defer func() {
		if r := recover(); r != nil {
			k.logger.Error("recovered from panic in contract execution", "contractAddr", contractAddr, "error", r)
		}
	}()

	addr := sdk.MustAccAddressFromBech32(contractAddr)
	msgBytes, err := json.Marshal(msg)
	if err != nil {
		k.logger.Error("error marshalling msg for contract: %s", contractAddr)
		return
	}

	wasmAddr := authtypes.NewModuleAddress(wasmtypes.ModuleName)
	gasLimit := k.MaxContractGas(ctx)

	// Create a new context with a gas meter
	gasCtx := ctx
	gasCtx = gasCtx.WithGasMeter(storetypes.NewGasMeter(gasLimit))

	// Execute the contract within the gas-limited context
	_, err = k.contractKeeper.Execute(gasCtx, addr, wasmAddr, msgBytes, sdk.Coins{})
	if err != nil {
		if gasCtx.GasMeter().IsOutOfGas() {
			k.logger.Error("contract execution failed due to gas limit: %s", contractAddr)
		} else {
			k.logger.Error("error executing contract: %s; error: %v", contractAddr, err)
		}
	}
}

func (k Keeper) ExecutePrivateContract(ctx sdk.Context, contractAddr string, msg types.ExecuteContractPrivateMsg) {
	defer func() {
		if r := recover(); r != nil {
			k.logger.Error("recovered from panic in contract execution", "contractAddr", contractAddr, "error", r)
		}
	}()

	addr := sdk.MustAccAddressFromBech32(contractAddr)
	msgBytes, err := json.Marshal(msg)
	if err != nil {
		k.logger.Error("error marshalling msg for contract: %s", contractAddr)
		return
	}

	wasmAddr := authtypes.NewModuleAddress(wasmtypes.ModuleName)
	gasLimit := k.MaxContractGas(ctx)

	// Create a new context with a gas meter
	gasCtx := ctx
	gasCtx = gasCtx.WithGasMeter(storetypes.NewGasMeter(gasLimit))

	// Execute the contract within the gas-limited context
	_, err = k.contractKeeper.Execute(gasCtx, addr, wasmAddr, msgBytes, sdk.Coins{})
	if err != nil {
		if gasCtx.GasMeter().IsOutOfGas() {
			k.logger.Error("contract execution failed due to gas limit: %s", contractAddr)
		} else {
			k.logger.Error("error executing contract: %s; error: %v", contractAddr, err)
		}
	}
}
