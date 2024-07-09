package abci

import (
	"fmt"

	"cosmossdk.io/log"
	abci "github.com/cometbft/cometbft/abci/types"
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/skip-mev/block-sdk/v2/block"
	"github.com/skip-mev/block-sdk/v2/block/proposals"
	"github.com/skip-mev/block-sdk/v2/block/utils"
)

type (
	// ProposalHandler is a wrapper around the ABCI++ PrepareProposal and ProcessProposal
	// handlers.
	ProposalHandler struct {
		logger              log.Logger
		txDecoder           sdk.TxDecoder
		txEncoder           sdk.TxEncoder
		prepareLanesHandler block.PrepareLanesHandler
		mempool             block.Mempool
	}
)

// NewProposalHandler returns a new ABCI++ proposal handler. This proposal handler will
// iteratively call each of the lanes in the chain to prepare and process the proposal.
func NewProposalHandler(
	logger log.Logger,
	txDecoder sdk.TxDecoder,
	txEncoder sdk.TxEncoder,
	mempool block.Mempool,
) *ProposalHandler {
	return &ProposalHandler{
		logger:              logger,
		txDecoder:           txDecoder,
		txEncoder:           txEncoder,
		prepareLanesHandler: ChainPrepareLanes(mempool.Registry()),
		mempool:             mempool,
	}
}

// PrepareProposalHandler prepares the proposal by selecting transactions from each lane
// according to each lane's selection logic. We select transactions in a greedy fashion. Note that
// each lane has an boundary on the number of bytes that can be included in the proposal. By default,
// the default lane will not have a boundary on the number of bytes that can be included in the proposal and
// will include all valid transactions in the proposal (up to MaxTxBytes).
func (h *ProposalHandler) PrepareProposalHandler() sdk.PrepareProposalHandler {
	return func(ctx sdk.Context, req *abci.RequestPrepareProposal) (resp *abci.ResponsePrepareProposal, err error) {
		if req.Height <= 1 {
			return &abci.ResponsePrepareProposal{Txs: req.Txs}, nil
		}
		// In the case where there is a panic, we recover here and return an empty proposal.
		defer func() {
			if err := recover(); err != nil {
				h.logger.Error("failed to prepare proposal", "err", err)
				resp = &abci.ResponsePrepareProposal{Txs: make([][]byte, 0)}
				err = fmt.Errorf("failed to prepare proposal: %v", err)
			}
		}()

		h.logger.Info(
			"mempool distribution before proposal creation",
			"distribution", h.mempool.GetTxDistribution(),
			"height", req.Height,
		)

		// Get the max gas limit and max block size for the proposal.
		_, maxGasLimit := proposals.GetBlockLimits(ctx)

		proposal := proposals.NewProposal(h.logger, req.MaxTxBytes, maxGasLimit)
		prepareLanesHandler := ChainPrepareLanes(h.mempool.Registry())
		finalProposal, err := prepareLanesHandler(ctx, proposal)

		if err != nil {
			h.logger.Error("failed to prepare proposal", "err", err)
			return &abci.ResponsePrepareProposal{Txs: make([][]byte, 0)}, err
		}

		h.logger.Info(
			"prepared proposal",
			"num_txs", len(finalProposal.Txs),
			"total_tx_bytes", finalProposal.Info.BlockSize,
			"max_tx_bytes", finalProposal.Info.MaxBlockSize,
			"total_gas_limit", finalProposal.Info.GasLimit,
			"max_gas_limit", finalProposal.Info.MaxGasLimit,
			"height", req.Height,
		)

		h.logger.Info(
			"mempool distribution after proposal creation",
			"distribution", h.mempool.GetTxDistribution(),
			"height", req.Height,
		)

		return &abci.ResponsePrepareProposal{
			Txs: finalProposal.Txs,
		}, nil
	}
}

// ProcessProposalHandler processes the proposal by verifying all transactions in the proposal
// according to each lane's verification logic. We verify proposals in a greedy fashion.
// If a lane's portion of the proposal is invalid, we reject the proposal. After a lane's portion
// of the proposal is verified, we pass the remaining transactions to the next lane in the chain.
func (h *ProposalHandler) ProcessProposalHandler() sdk.ProcessProposalHandler {
	return func(ctx sdk.Context, req *abci.RequestProcessProposal) (resp *abci.ResponseProcessProposal, err error) {
		if req.Height <= 1 {
			return &abci.ResponseProcessProposal{Status: abci.ResponseProcessProposal_ACCEPT}, nil
		}
		// In the case where any of the lanes panic, we recover here and return a reject status.
		defer func() {
			if err := recover(); err != nil {
				h.logger.Error("failed to process proposal", "err", err)
				resp = &abci.ResponseProcessProposal{Status: abci.ResponseProcessProposal_REJECT}
				err = fmt.Errorf("failed to process proposal: %v", err)
			}
		}()

		txs := req.Txs
		// if len(txs) == 0 {
		// 	h.logger.Info("accepted empty proposal")
		// 	return &abci.ResponseProcessProposal{Status: abci.ResponseProcessProposal_ACCEPT}, fmt.Errorf("failed to process an empty proposal: %v", err)
		// }

		// Decode the transactions from the proposal.
		decodedTxs, err := utils.GetDecodedTxs(h.txDecoder, txs)
		if err != nil {
			h.logger.Error("failed to decode transactions", "err", err)
			return &abci.ResponseProcessProposal{Status: abci.ResponseProcessProposal_REJECT}, err
		}

		// Build handler that will verify the partial proposals according to each lane's verification logic.
		processLanesHandler := ChainProcessLanes(h.mempool.Registry())
		finalProposal, err := processLanesHandler(ctx, proposals.NewProposalWithContext(ctx, h.logger), decodedTxs)
		if err != nil {
			h.logger.Error("failed to validate the proposal", "err", err)
			return &abci.ResponseProcessProposal{Status: abci.ResponseProcessProposal_REJECT}, err
		}

		h.logger.Info(
			"processed proposal",
			"num_txs", len(finalProposal.Txs),
			"total_tx_bytes", finalProposal.Info.BlockSize,
			"max_tx_bytes", finalProposal.Info.MaxBlockSize,
			"total_gas_limit", finalProposal.Info.GasLimit,
			"max_gas_limit", finalProposal.Info.MaxGasLimit,
			"height", req.Height,
		)

		return &abci.ResponseProcessProposal{Status: abci.ResponseProcessProposal_ACCEPT}, nil
	}
}
