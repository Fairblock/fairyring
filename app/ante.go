package app

import (
	"errors"

	corestoretypes "cosmossdk.io/core/store"
	circuitante "cosmossdk.io/x/circuit/ante"
	wasmkeeper "github.com/CosmWasm/wasmd/x/wasm/keeper"
	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	pepante "github.com/Fairblock/fairyring/x/pep/ante"
	pepkeeper "github.com/Fairblock/fairyring/x/pep/keeper"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/auth/ante"
	ibcante "github.com/cosmos/ibc-go/v8/modules/core/ante"
	ibckeeper "github.com/cosmos/ibc-go/v8/modules/core/keeper"
	"github.com/skip-mev/block-sdk/v2/block"
)

type FairyringHandlerOptions struct {
	BaseOptions  ante.HandlerOptions
	wasmConfig   wasmtypes.WasmConfig
	KeyShareLane pepante.KeyShareLane
	FreeLane     block.Lane
	TxDecoder    sdk.TxDecoder
	TxEncoder    sdk.TxEncoder
	PepKeeper    pepkeeper.Keeper
}

// NewFairyringAnteHandler wraps all of the default Cosmos SDK AnteDecorators with the Fairyring AnteHandler.
func NewFairyringAnteHandler(options FairyringHandlerOptions) sdk.AnteHandler {
	if options.BaseOptions.AccountKeeper == nil {
		panic("account keeper is required for ante builder")
	}

	if options.BaseOptions.BankKeeper == nil {
		panic("bank keeper is required for ante builder")
	}

	if options.BaseOptions.SignModeHandler == nil {
		panic("sign mode handler is required for ante builder")
	}

	if options.BaseOptions.FeegrantKeeper == nil {
		panic("fee grant keeper is required for ante builder")
	}

	anteDecorators := []sdk.AnteDecorator{
		ante.NewSetUpContextDecorator(), // outermost AnteDecorator. SetUpContext must be called first
		wasmkeeper.NewLimitSimulationGasDecorator(options.wasmConfig.SimulationGasLimit),
		ante.NewExtensionOptionsDecorator(options.BaseOptions.ExtensionOptionChecker),
		ante.NewValidateBasicDecorator(),
		ante.NewTxTimeoutHeightDecorator(),
		ante.NewValidateMemoDecorator(options.BaseOptions.AccountKeeper),
		ante.NewConsumeGasForTxSizeDecorator(options.BaseOptions.AccountKeeper),
		block.NewIgnoreDecorator(
			ante.NewDeductFeeDecorator(
				options.BaseOptions.AccountKeeper,
				options.BaseOptions.BankKeeper,
				options.BaseOptions.FeegrantKeeper,
				options.BaseOptions.TxFeeChecker,
			),
			options.FreeLane,
		),
		ante.NewSetPubKeyDecorator(options.BaseOptions.AccountKeeper), // SetPubKeyDecorator must be called before all signature verification decorators
		ante.NewValidateSigCountDecorator(options.BaseOptions.AccountKeeper),
		ante.NewSigGasConsumeDecorator(options.BaseOptions.AccountKeeper, options.BaseOptions.SigGasConsumer),
		ante.NewSigVerificationDecorator(options.BaseOptions.AccountKeeper, options.BaseOptions.SignModeHandler),
		ante.NewIncrementSequenceDecorator(options.BaseOptions.AccountKeeper),
		pepante.NewPepDecorator(options.PepKeeper, options.TxEncoder, options.KeyShareLane),
	}

	return sdk.ChainAnteDecorators(anteDecorators...)
}

// HandlerOptions extend the SDK's AnteHandler options by requiring the IBC
// channel keeper.
type HandlerOptions struct {
	ante.HandlerOptions

	IBCKeeper             *ibckeeper.Keeper
	WasmConfig            *wasmtypes.WasmConfig
	WasmKeeper            *wasmkeeper.Keeper
	TXCounterStoreService corestoretypes.KVStoreService
	CircuitKeeper         circuitante.CircuitBreaker
}

func NewAnteHandler(options HandlerOptions) (sdk.AnteHandler, error) {
	if options.AccountKeeper == nil {
		return nil, errors.New("account keeper is required for ante builder")
	}
	if options.BankKeeper == nil {
		return nil, errors.New("bank keeper is required for ante builder")
	}
	if options.SignModeHandler == nil {
		return nil, errors.New("sign mode handler is required for ante builder")
	}
	if options.WasmConfig == nil {
		return nil, errors.New("wasm config is required for ante builder")
	}
	if options.TXCounterStoreService == nil {
		return nil, errors.New("wasm store service is required for ante builder")
	}
	if options.CircuitKeeper == nil {
		return nil, errors.New("circuit keeper is required for ante builder")
	}

	anteDecorators := []sdk.AnteDecorator{
		ante.NewSetUpContextDecorator(), // outermost AnteDecorator. SetUpContext must be called first
		wasmkeeper.NewLimitSimulationGasDecorator(options.WasmConfig.SimulationGasLimit), // after setup context to enforce limits early
		wasmkeeper.NewCountTXDecorator(options.TXCounterStoreService),
		wasmkeeper.NewGasRegisterDecorator(options.WasmKeeper.GetGasRegister()),
		circuitante.NewCircuitBreakerDecorator(options.CircuitKeeper),
		ante.NewExtensionOptionsDecorator(options.ExtensionOptionChecker),
		ante.NewValidateBasicDecorator(),
		ante.NewTxTimeoutHeightDecorator(),
		ante.NewValidateMemoDecorator(options.AccountKeeper),
		ante.NewConsumeGasForTxSizeDecorator(options.AccountKeeper),
		ante.NewDeductFeeDecorator(options.AccountKeeper, options.BankKeeper, options.FeegrantKeeper, options.TxFeeChecker),
		ante.NewSetPubKeyDecorator(options.AccountKeeper), // SetPubKeyDecorator must be called before all signature verification decorators
		ante.NewValidateSigCountDecorator(options.AccountKeeper),
		ante.NewSigGasConsumeDecorator(options.AccountKeeper, options.SigGasConsumer),
		ante.NewSigVerificationDecorator(options.AccountKeeper, options.SignModeHandler),
		ante.NewIncrementSequenceDecorator(options.AccountKeeper),
		ibcante.NewRedundantRelayDecorator(options.IBCKeeper),
	}

	return sdk.ChainAnteDecorators(anteDecorators...), nil
}
