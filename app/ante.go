package app

import (
	"fairyring/blockbuster"
	pepante "fairyring/x/pep/ante"
	pepkeeper "fairyring/x/pep/keeper"
	//conditionalencante "fairyring/x/conditionalenc/ante"
	conditionalenckeeper "fairyring/x/conditionalenc/keeper"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/x/auth/ante"
)

type FairyringHandlerOptions struct {
	BaseOptions  ante.HandlerOptions
	Mempool      blockbuster.Mempool
	KeyShareLane pepante.KeyShareLane
	TxDecoder    sdk.TxDecoder
	TxEncoder    sdk.TxEncoder
	PepKeeper    pepkeeper.Keeper
	ConditionalEncKeeper    conditionalenckeeper.Keeper
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
		ante.NewExtensionOptionsDecorator(options.BaseOptions.ExtensionOptionChecker),
		ante.NewValidateBasicDecorator(),
		ante.NewTxTimeoutHeightDecorator(),
		ante.NewValidateMemoDecorator(options.BaseOptions.AccountKeeper),
		ante.NewConsumeGasForTxSizeDecorator(options.BaseOptions.AccountKeeper),
		ante.NewDeductFeeDecorator(
			options.BaseOptions.AccountKeeper,
			options.BaseOptions.BankKeeper,
			options.BaseOptions.FeegrantKeeper,
			options.BaseOptions.TxFeeChecker,
		),
		ante.NewSetPubKeyDecorator(options.BaseOptions.AccountKeeper), // SetPubKeyDecorator must be called before all signature verification decorators
		ante.NewValidateSigCountDecorator(options.BaseOptions.AccountKeeper),
		ante.NewSigGasConsumeDecorator(options.BaseOptions.AccountKeeper, options.BaseOptions.SigGasConsumer),
		ante.NewSigVerificationDecorator(options.BaseOptions.AccountKeeper, options.BaseOptions.SignModeHandler),
		ante.NewIncrementSequenceDecorator(options.BaseOptions.AccountKeeper),
		pepante.NewPepDecorator(options.PepKeeper, options.TxEncoder, options.KeyShareLane, options.Mempool),
	}

	return sdk.ChainAnteDecorators(anteDecorators...)
}
