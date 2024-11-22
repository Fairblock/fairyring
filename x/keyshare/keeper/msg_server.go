package keeper

import (
    wasm "github.com/CosmWasm/wasmd/x/wasm/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
)

type msgServer struct {
	Keeper
	wasmKeeper   wasm.Keeper
}

// NewMsgServerImpl returns an implementation of the MsgServer interface
// for the provided Keeper.
func NewMsgServerImpl(keeper Keeper,  wasmKeeper wasm.Keeper) types.MsgServer {
	return &msgServer{Keeper: keeper, wasmKeeper: wasmKeeper}
}

var _ types.MsgServer = msgServer{}
