package keeper

import (
	"fmt"

	"cosmossdk.io/core/store"
	"cosmossdk.io/log"
	"cosmossdk.io/store/prefix"
	"github.com/cosmos/cosmos-sdk/codec"
	"github.com/cosmos/cosmos-sdk/runtime"
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/Fairblock/fairyring/x/zkp/types"
)

type (
	Keeper struct {
		cdc          codec.BinaryCodec
		storeService store.KVStoreService
		logger       log.Logger
		authority    string
	}
)

func NewKeeper(
	cdc codec.BinaryCodec,
	storeService store.KVStoreService,
	logger log.Logger,
	authority string,
) *Keeper {
	if _, err := sdk.AccAddressFromBech32(authority); err != nil {
		panic(fmt.Sprintf("invalid authority address: %s", authority))
	}
	return &Keeper{
		cdc:          cdc,
		storeService: storeService,
		logger:       logger,
		authority:    authority,
	}
}

func (k Keeper) GetAuthority() string {
	return k.authority
}

func (k Keeper) Logger() log.Logger {
	return k.logger.With("module", "x/"+types.ModuleName)
}

func (k Keeper) StoreTrustedContract(ctx sdk.Context, addr string) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	st := prefix.NewStore(storeAdapter, types.TrustedContractPrefix)
	st.Set([]byte(addr), []byte{1})
}

func (k Keeper) DeleteTrustedContract(ctx sdk.Context, addr string) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	st := prefix.NewStore(storeAdapter, types.TrustedContractPrefix)
	st.Delete([]byte(addr))
}

func (k Keeper) IsTrustedContract(ctx sdk.Context, addr string) bool {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	st := prefix.NewStore(storeAdapter, types.TrustedContractPrefix)
	return st.Has([]byte(addr))
}

func (k Keeper) GetAllTrustedContracts(ctx sdk.Context) []string {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	st := prefix.NewStore(storeAdapter, types.TrustedContractPrefix)
	iter := st.Iterator(nil, nil)
	defer iter.Close()

	var contracts []string
	for ; iter.Valid(); iter.Next() {
		contracts = append(contracts, string(iter.Key()))
	}
	return contracts
}
