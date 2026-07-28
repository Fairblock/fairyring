package wasmbinding

import (
	"encoding/json"
	"fmt"

	wasmkeeper "github.com/CosmWasm/wasmd/x/wasm/keeper"
	wasmvmtypes "github.com/CosmWasm/wasmvm/v2/types"
	sdk "github.com/cosmos/cosmos-sdk/types"

	zkpmodulekeeper "github.com/Fairblock/fairyring/x/zkp/keeper"
)

type callerAwareQueryHandler struct {
	fallback wasmkeeper.WasmVMQueryHandler
	custom   func(ctx sdk.Context, caller sdk.AccAddress, request json.RawMessage) ([]byte, error)
}

func NewQueryHandler(
	old wasmkeeper.WasmVMQueryHandler,
	zkpKeeper *zkpmodulekeeper.Keeper,
	stargate func(ctx sdk.Context, request *wasmvmtypes.StargateQuery) ([]byte, error),
) wasmkeeper.WasmVMQueryHandler {
	plugins, ok := old.(wasmkeeper.QueryPlugins)
	if !ok {
		panic(fmt.Sprintf("unsupported wasm query handler type: %T", old))
	}

	plugins = plugins.Merge(&wasmkeeper.QueryPlugins{
		Stargate: stargate,
	})

	return callerAwareQueryHandler{
		fallback: plugins,
		custom:   CustomQuerier(zkpKeeper),
	}
}

func (h callerAwareQueryHandler) HandleQuery(ctx sdk.Context, caller sdk.AccAddress, req wasmvmtypes.QueryRequest) ([]byte, error) {
	if req.Custom != nil {
		return h.custom(ctx, caller, req.Custom)
	}

	return h.fallback.HandleQuery(ctx, caller, req)
}
