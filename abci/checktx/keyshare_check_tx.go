package checktx

import (
	"context"
	"fmt"

	peptypes "github.com/Fairblock/fairyring/x/pep/types"
	cometabci "github.com/cometbft/cometbft/abci/types"
	cmtproto "github.com/cometbft/cometbft/proto/tendermint/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"

	"cosmossdk.io/log"
	storetypes "cosmossdk.io/store/types"
)

// CheckTxHandler is a wrapper around baseapp's CheckTx method that allows us to
// verify keyshare transactions against the latest committed state. All other transactions
// are executed normally using base app's CheckTx. This defines all of the
// dependencies that are required to verify a keyshare transaction.
type KeyshareCheckTxHandler struct {
	// baseApp is utilized to retrieve the latest committed state and to call
	// baseapp's CheckTx method.
	baseApp BaseApp

	// txDecoder is utilized to decode transactions to determine if they are
	// bid transactions.
	txDecoder sdk.TxDecoder

	// KeyshareLane is utilized to retrieve the keyshare info of a transaction and to
	// insert a Keyshare transaction into the application-side mempool.
	keyshareLane KeyshareLaneI

	// anteHandler is utilized to verify the bid transaction against the latest
	// committed state.
	anteHandler sdk.AnteHandler

	// checkTxHandler is the wrapped CheckTx handler that is used to execute all non-bid txs
	checkTxHandler CheckTx
}

// KeyshareLaneI is the interface that defines all of the dependencies that
// are required to interact with the top of block lane.
type KeyshareLaneI interface {
	// GetDecryptionKeyInfo is utilized to retrieve the Keyshare info of a transaction.
	GetDecryptionKeyInfo(tx sdk.Tx) (*peptypes.DecryptionKey, error)

	// Insert is utilized to insert a transaction into the application-side mempool.
	Insert(ctx context.Context, tx sdk.Tx) error

	// Remove is utilized to delete a transaction from the application-side mempool.
	Remove(tx sdk.Tx) error
}

// BaseApp is an interface that allows us to call baseapp's CheckTx method
// as well as retrieve the latest committed state.
type BaseApp interface {
	// CommitMultiStore is utilized to retrieve the latest committed state.
	CommitMultiStore() storetypes.CommitMultiStore

	// CheckTx is baseapp's CheckTx method that checks the validity of a
	// transaction.
	CheckTx(*cometabci.RequestCheckTx) (*cometabci.ResponseCheckTx, error)

	// Logger is utilized to log errors.
	Logger() log.Logger

	// LastBlockHeight is utilized to retrieve the latest block height.
	LastBlockHeight() int64

	// GetConsensusParams is utilized to retrieve the consensus params.
	GetConsensusParams(ctx sdk.Context) cmtproto.ConsensusParams

	// ChainID is utilized to retrieve the chain ID.
	ChainID() string
}

// NewKeyshareCheckTxHandler constructs a new CheckTxHandler instance. This method fails if the given
// LanedMempool does not have a lane adhering to the KeyshareLaneI interface
func NewKeyshareCheckTxHandler(
	baseApp BaseApp,
	txDecoder sdk.TxDecoder,
	keyshareLane KeyshareLaneI,
	anteHandler sdk.AnteHandler,
	checkTxHandler CheckTx,
) *KeyshareCheckTxHandler {
	return &KeyshareCheckTxHandler{
		baseApp:        baseApp,
		txDecoder:      txDecoder,
		keyshareLane:   keyshareLane,
		anteHandler:    anteHandler,
		checkTxHandler: checkTxHandler,
	}
}

// CheckTxHandler is a wrapper around baseapp's CheckTx method that allows us to
// verify keyshare transactions against the latest committed state. All other transactions
// are executed normally. No state changes are applied to the state
// during this process.
func (handler *KeyshareCheckTxHandler) CheckTx() CheckTx {
	return func(req *cometabci.RequestCheckTx) (res *cometabci.ResponseCheckTx, err error) {
		defer func() {
			if rec := recover(); rec != nil {
				res = sdkerrors.ResponseCheckTxWithEvents(fmt.Errorf("panic in check tx handler: %s", rec), 0, 0, nil, false)
				err = fmt.Errorf("failed to check tx: %v", rec)
			}
		}()

		tx, err := handler.txDecoder(req.Tx)
		if err != nil {
			return sdkerrors.ResponseCheckTxWithEvents(fmt.Errorf("failed to decode tx: %w", err), 0, 0, nil, false), err
		}

		// Attempt to get the keyshare info of the transaction.
		ksInfo, err := handler.keyShareLane.GetDecryptionKeyInfo(tx)
		if err != nil {
			return sdkerrors.ResponseCheckTxWithEvents(fmt.Errorf("failed to get keyshare info: %w", err), 0, 0, nil, false), err
		}

		// If this is not a keyshare transaction, we just execute it normally.
		if ksInfo == nil {
			return handler.baseApp.CheckTx(req)
		}

		// We attempt to get the latest committed state in order to verify transactions
		// as if they were to be executed at the top of the block. After verification, this
		// context will be discarded and will not apply any state changes.
		ctx := handler.GetContextForKeyshareTx(req)

		// Verify the keyshare transaction.
		gasInfo, err := handler.ValidateKeyshareTx(ctx, tx, ksInfo)
		if err != nil {
			return sdkerrors.ResponseCheckTxWithEvents(fmt.Errorf("invalid keyshare tx: %w", err), gasInfo.GasWanted, gasInfo.GasUsed, nil, false), err
		}

		// If the keyshare transaction is valid, we know we can insert it into the mempool for consideration in the next block.
		if err := handler.keyShareLane.Insert(ctx, tx); err != nil {
			return sdkerrors.ResponseCheckTxWithEvents(fmt.Errorf("invalid keyshare tx; failed to insert keyshare transaction into mempool: %w", err), gasInfo.GasWanted, gasInfo.GasUsed, nil, false), err
		}

		return &cometabci.ResponseCheckTx{
			Code:      cometabci.CodeTypeOK,
			GasWanted: int64(gasInfo.GasWanted),
			GasUsed:   int64(gasInfo.GasUsed),
		}, nil
	}
}

// ValidateKeyshareTx is utilized to verify the keyshare transaction against the latest committed state.
func (handler *KeyshareCheckTxHandler) ValidateKeyshareTx(
	ctx sdk.Context,
	ksTx sdk.Tx,
	ksInfo *peptypes.DecryptionKey,
) (sdk.GasInfo, error) {
	// Verify the keyshare transaction.
	ctx, err := handler.anteHandler(ctx, ksTx, false)
	if err != nil {
		return sdk.GasInfo{}, fmt.Errorf("invalid keyshare tx; failed to execute ante handler: %w", err)
	}

	// Store the gas info and priority of the keyshare transaction before applying changes with other transactions.
	gasInfo := sdk.GasInfo{
		GasWanted: ctx.GasMeter().Limit(),
		GasUsed:   ctx.GasMeter().GasConsumed(),
	}

	if _, err = handler.anteHandler(ctx, ksTx, false); err != nil {
		return gasInfo, fmt.Errorf("invalid keyshare tx; failed to execute transaction: %w", err)
	}

	return gasInfo, nil
}

// GetContextForTx is returns the latest committed state and sets the context given
// the checkTx request.
func (handler *KeyshareCheckTxHandler) GetContextForKeyshareTx(req *cometabci.RequestCheckTx) sdk.Context {
	// Retrieve the commit multi-store which is used to retrieve the latest committed state.
	ms := handler.baseApp.CommitMultiStore().CacheMultiStore()

	// Create a new context based off of the latest committed state.
	header := cmtproto.Header{
		Height:  handler.baseApp.LastBlockHeight(),
		ChainID: handler.baseApp.ChainID(),
	}
	ctx, _ := sdk.NewContext(ms, header, true, handler.baseApp.Logger()).CacheContext()

	// Set the context to the correct checking mode.
	switch req.Type {
	case cometabci.CheckTxType_New:
		ctx = ctx.WithIsCheckTx(true)
	case cometabci.CheckTxType_Recheck:
		ctx = ctx.WithIsReCheckTx(true)
	default:
		panic("unknown check tx type")
	}

	// Set the remaining important context values.
	ctx = ctx.
		WithTxBytes(req.Tx).
		WithEventManager(sdk.NewEventManager()).
		WithConsensusParams(handler.baseApp.GetConsensusParams(ctx))

	return ctx
}
