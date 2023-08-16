package keyshare

import (
	"fmt"

	"fairyring/blockbuster"
	"fairyring/blockbuster/utils"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// PrepareLane will attempt to select the keyshare transactions that are valid
// and include them in the proposal. It will return an empty partial proposal
// if no valid keyshare transactions are found.
func (l *KeyShareLane) PrepareLane(
	ctx sdk.Context,
	proposal blockbuster.BlockProposal,
	maxTxBytes int64,
	txs [][]byte,
	next blockbuster.PrepareLanesHandler,
) (blockbuster.BlockProposal, error) {
	// Define all of the info we need to select transactions for the partial proposal.
	var (
		keyshareTxs [][]byte
		txsToRemove = make(map[sdk.Tx]struct{}, 0)
	)

	fmt.Println("ekhane  1")
	fmt.Println(l.Mempool.CountTx())
	fmt.Println(proposal.GetNumTxs())
	fmt.Println(txs)

	// Attempt to select the valid keyshare txs
	keyshareTxIterator := l.Mempool.Select(ctx, txs)
	fmt.Println(keyshareTxIterator.Tx())
selectKeyshareTxLoop:
	for ; keyshareTxIterator != nil; keyshareTxIterator = keyshareTxIterator.Next() {
		cacheCtx, write := ctx.CacheContext()
		tmpKeyshareTx := keyshareTxIterator.Tx()

		keyshareTxBz, hash, err := utils.GetTxHashStr(l.Cfg.TxEncoder, tmpKeyshareTx)
		if err != nil {
			txsToRemove[tmpKeyshareTx] = struct{}{}
			fmt.Println("ekhane  1.1")
			continue selectKeyshareTxLoop
		}

		// if the transaction is already in the (partial) block proposal, we skip it.
		if proposal.Contains(keyshareTxBz) {
			fmt.Println("ekhane  1.2")
			continue selectKeyshareTxLoop
		}

		keyshareTxSize := int64(len(keyshareTxBz))
		if keyshareTxSize <= maxTxBytes {
			// Verify the keyshare transaction
			if err := l.VerifyTx(cacheCtx, tmpKeyshareTx); err != nil {
				fmt.Println("ekhane  1.3")
				l.Logger().Info(
					"failed to verify aggregate keyshare tx",
					"tx_hash", hash,
					"err", err,
				)
				txsToRemove[tmpKeyshareTx] = struct{}{}
				continue selectKeyshareTxLoop
			}

			// Build the partial proposal by selecting the keyshare transaction
			keyshareInfo, err := l.GetKeyShareInfo(tmpKeyshareTx)
			if keyshareInfo == nil || err != nil {
				fmt.Println("ekhane  1.4")
				txsToRemove[tmpKeyshareTx] = struct{}{}
				continue selectKeyshareTxLoop
			}

			// At this point, and all the keyshare transactions are valid.
			// So we select them bid and also mark these transactions as seen and
			// update the total size selected thus far.
			keyshareTxs = append(keyshareTxs, keyshareTxBz)

			// Write the cache context to the original context when we know we have a
			// valid top of block bundle.
			write()
			fmt.Println("ekhane  1.5")

		}

		fmt.Println("ekhane  1.6")

		l.Cfg.Logger.Info(
			"failed to select keyshare tx for lane; tx size is too large",
			"tx_size", keyshareTxSize,
			"max_size", maxTxBytes,
		)
	}

	// Remove all transactions that were invalid during the creation of the partial proposal.
	if err := utils.RemoveTxsFromLane(txsToRemove, l.Mempool); err != nil {
		fmt.Println("ekhane  1.7")

		return proposal, err
	}

	// Update the proposal with the selected transactions. This will only return an error
	// if the invarient checks are not passed. In the case when this errors, the original proposal
	// will be returned (without the selected transactions from this lane).
	if err := proposal.UpdateProposal(l, keyshareTxs); err != nil {
		fmt.Println("ekhane  1.8")

		return proposal, err
	}

	return next(ctx, txs, proposal)
}

// ProcessLane will ensure that block proposals that include transactions from
// the keyshare lane are valid.
func (l *KeyShareLane) ProcessLane(ctx sdk.Context, txs []sdk.Tx, next blockbuster.ProcessLanesHandler) (sdk.Context, error) {
	var countKeyshareTxs = 0
	fmt.Println("\n\n\n\nekhane  2\n\n\n\n")

	for _, keyshareTx := range txs {
		if !l.Match(keyshareTx) {
			return next(ctx, txs)
		}

		_, err := l.GetKeyShareInfo(keyshareTx)
		if err != nil {
			return ctx, fmt.Errorf("failed to get keyshare info for lane %s: %w", l.Name(), err)
		}

		if err := l.VerifyTx(ctx, keyshareTx); err != nil {
			return ctx, fmt.Errorf("invalid keyshare tx: %w", err)
		}

		countKeyshareTxs = countKeyshareTxs + 1
	}

	return next(ctx, txs[countKeyshareTxs:])
}

// ProcessLaneBasic ensures that if keyshare transactions are present in a proposal,
//   - they are the first transaction in the partial proposal
//   - there are no other bid transactions in the proposal
func (l *KeyShareLane) ProcessLaneBasic(txs []sdk.Tx) error {
	// If there are keyshare transaction, they must be the first transactions in the block proposal.
	fmt.Println("\n\n\n\nekhane  3\n\n\n\n")

	for index, keyshareTx := range txs {
		if !l.Match(keyshareTx) {
			for _, tx := range txs[index:] {
				if l.Match(tx) {
					return fmt.Errorf("misplaced keyshare transactions in lane %s", l.Name())
				}
			}
		}
	}
	return nil
}

// VerifyTx will verify that the keyshare transaction is valid.
// It will return an error if the transaction is invalid.
func (l *KeyShareLane) VerifyTx(ctx sdk.Context, keyshareTx sdk.Tx) error {
	fmt.Println("\n\n\n\nekhane  4\n\n\n\n")

	_, err := l.GetKeyShareInfo(keyshareTx)
	if err != nil {
		return fmt.Errorf("failed to get keyshare info: %w", err)
	}

	// verify the keyshare transaction
	_, err = l.verifyTx(ctx, keyshareTx)
	if err != nil {
		return fmt.Errorf("invalid keyshare tx; failed to execute ante handler: %w", err)
	}
	return nil
}

// verifyTx will execute the ante handler on the transaction and return the
// resulting context and error.
func (l *KeyShareLane) verifyTx(ctx sdk.Context, tx sdk.Tx) (sdk.Context, error) {
	if l.Cfg.AnteHandler != nil {
		newCtx, err := l.Cfg.AnteHandler(ctx, tx, false)
		return newCtx, err
	}

	return ctx, nil
}
