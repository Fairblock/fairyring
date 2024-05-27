package keeper

import (
	"encoding/json"

	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// GetContractEntry returns a contract entry by its request id
func (k Keeper) GetContractEntry(
	ctx sdk.Context,
	reqID string,
) (cAddr string, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.ContractKeyPrefix))

	b := store.Get([]byte(reqID))
	if b == nil {
		return cAddr, false
	}

	cAddr = string(b)
	return cAddr, true
}

// SetContractEntry stores a contract entry by its request id
func (k Keeper) SetContractEntry(
	ctx sdk.Context,
	reqID string,
	cAddr string,
) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.ContractKeyPrefix))

	entry := []byte(cAddr)
	store.Set(
		[]byte(reqID),
		entry,
	)
}

// RemoveContractEntry removes an entry from the store
func (k Keeper) RemoveContractEntry(
	ctx sdk.Context,
	reqID string,
) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.ContractKeyPrefix))
	store.Delete([]byte(reqID))
}

func (k Keeper) EvaluateContract(
	ctx sdk.Context,
	entry types.GenEncTxExecutionQueue,
) {
	cAddr, found := k.GetContractEntry(ctx, entry.RequestId)
	if !found {
		k.RemoveContractEntry(ctx, entry.RequestId)
		return
	}

	// Serialize the message to JSON
	bz, err := json.Marshal(entry)
	if err != nil {
		k.RemoveContractEntry(ctx, entry.RequestId)
		return
	}

	// evalMsg := wasmtypes.MsgExecuteContract{
	// 	Sender:   types.ModuleName,
	// 	Contract: cAddr,
	// 	Msg:      bz,
	// 	Funds:    sdk.Coins{},
	// }

	// Send the message to the contract
	_, err = k.wasmKeeper.Execute(ctx, sdk.AccAddress(cAddr), sdk.AccAddress{}, bz, sdk.Coins{})
	if err != nil {
		k.RemoveContractEntry(ctx, entry.RequestId)
	}
	k.RemoveContractEntry(ctx, entry.RequestId)
}
