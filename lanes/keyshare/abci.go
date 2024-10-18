package keyshare

import (
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/skip-mev/block-sdk/v2/block/base"
	"github.com/skip-mev/block-sdk/v2/block/proposals"
)

// Implements the Keyshare lane's PrepareLaneHandler and ProcessLaneHandler.
type ProposalHandler struct {
	lane    *base.BaseLane
	factory Factory
}

// NewProposalHandler returns a new keyshare proposal handler.
func NewProposalHandler(lane *base.BaseLane, factory Factory) *ProposalHandler {
	return &ProposalHandler{
		lane:    lane,
		factory: factory,
	}
}

// PrepareLaneHandler will attempt to select the keyshare transactions that are valid
// and include them in the proposal. It will return an empty partial proposal
// if no valid keyshare transactions are found.
func (h *ProposalHandler) PrepareLaneHandler() base.PrepareLaneHandler {
	return func(ctx sdk.Context, proposal proposals.Proposal, limit proposals.LaneLimits) ([]sdk.Tx, []sdk.Tx, error) {
		// Define all of the info we need to select transactions for the partial proposal.
		var (
			txsToInclude []sdk.Tx
			txsToRemove  []sdk.Tx
		)

		// Attempt to select the valid keyshare txs
		for iterator := h.lane.Select(ctx, nil); iterator != nil; iterator = iterator.Next() {
			tmpKeyshareTx := iterator.Tx()

			if !h.lane.Match(ctx, tmpKeyshareTx) {
				h.lane.Logger().Info("failed to select keyshare tx for lane; tx does not match lane")

				txsToRemove = append(txsToRemove, tmpKeyshareTx)
				continue
			}

			cacheCtx, write := ctx.CacheContext()

			keyshareTxBz, hash, err := GetTxHashStr(h.lane.TxEncoder(), tmpKeyshareTx)
			if err != nil {
				txsToRemove = append(txsToRemove, tmpKeyshareTx)
				continue
			}

			keyshareTxSize := int64(len(keyshareTxBz))
			if keyshareTxSize <= limit.MaxTxBytes {
				// Verify the keyshare transaction
				if err := h.VerifyTx(cacheCtx, tmpKeyshareTx); err != nil {
					h.lane.Logger().Info(
						"failed to verify aggregate keyshare tx",
						"tx_hash", hash,
						"err", err,
					)
					txsToRemove = append(txsToRemove, tmpKeyshareTx)
					continue
				}

				// Build the partial proposal by selecting the keyshare transaction
				keyshareInfo, err := h.factory.GetDecryptionKeyInfo(tmpKeyshareTx)
				if keyshareInfo == nil || err != nil {
					txsToRemove = append(txsToRemove, tmpKeyshareTx)
					continue
				}

				// At this point, and all the keyshare transactions are valid.
				// So we select them bid and also mark these transactions as seen and
				// update the total size selected thus far.
				txsToInclude = append(txsToInclude, tmpKeyshareTx)
				// Write the cache context to the original context when we know we have a
				// valid top of block bundle.
				write()

			} else {
				h.lane.Logger().Info(
					"failed to select keyshare tx for lane; tx size is too large",
					"tx_size", keyshareTxSize,
					"max_size", limit.MaxTxBytes,
				)
			}
		}

		return txsToInclude, txsToRemove, nil
	}
}

// ProcessLaneHandler ensures that if keyshare transactions are present in a proposal,
//   - they are the first transaction in the partial proposal
//   - there are no other aggregate keyshare transactions in the proposal
//   - block proposals that include transactions from the keyshare lane are valid
func (h *ProposalHandler) ProcessLaneHandler() base.ProcessLaneHandler {
	return func(ctx sdk.Context, partialProposal []sdk.Tx) ([]sdk.Tx, []sdk.Tx, error) {
		var countKeyshareTxs = 0

		if len(partialProposal) == 0 {
			return nil, nil, nil
		}

		for index, keyshareTx := range partialProposal {
			if !h.lane.Match(ctx, keyshareTx) {
				for _, tx := range partialProposal[index:] {
					if h.lane.Match(ctx, tx) {
						return nil, nil, fmt.Errorf("misplaced keyshare transactions in lane %s", h.lane.Name())
					}
				}
			} else {
				_, err := h.factory.GetDecryptionKeyInfo(keyshareTx)
				if err != nil {
					return nil, nil, fmt.Errorf("failed to get keyshare info for lane %s: %w", h.lane.Name(), err)
				}

				if err := h.VerifyTx(ctx, keyshareTx); err != nil {
					return nil, nil, fmt.Errorf("invalid keyshare tx: %w", err)
				}

				countKeyshareTxs = countKeyshareTxs + 1
			}
		}

		return partialProposal[:countKeyshareTxs], partialProposal[countKeyshareTxs:], nil
	}
}

// VerifyTx will verify that the keyshare transaction is valid.
// It will return an error if the transaction is invalid.
func (h *ProposalHandler) VerifyTx(ctx sdk.Context, keyshareTx sdk.Tx) error {
	_, err := h.factory.GetDecryptionKeyInfo(keyshareTx)
	if err != nil {
		return fmt.Errorf("failed to get keyshare info: %w", err)
	}

	// verify the keyshare transaction
	err = h.lane.VerifyTx(ctx, keyshareTx, false)
	if err != nil {
		return fmt.Errorf("invalid keyshare tx; failed to execute ante handler: %w", err)
	}
	return nil
}
