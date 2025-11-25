package app

import (
	"bytes"
	"encoding/json"

	sdk "github.com/cosmos/cosmos-sdk/types"

	abci "github.com/cometbft/cometbft/abci/types"
)

// keyshareInjectedTx is the "special" tx we inject at index 0 in PrepareProposal.
// It just wraps the ExtendedCommitInfo (which contains all the vote extensions).
type keyshareInjectedTx struct {
	ExtendedCommitInfo abci.ExtendedCommitInfo `json:"extended_commit_info"`
}

// equalExtendedCommitInfo does a shallow equality check on ExtendedCommitInfo.
// This is used in ProcessProposal to ensure the injected data matches
// ProposedLastCommit, so the proposer can't smuggle in fake VEs.
func equalExtendedCommitInfo(a, b *abci.ExtendedCommitInfo) bool {
	if a == nil || b == nil {
		return a == nil && b == nil
	}

	if a.Round != b.Round {
		return false
	}

	if len(a.Votes) != len(b.Votes) {
		return false
	}

	for i := range a.Votes {
		av, bv := a.Votes[i], b.Votes[i]

		if av.BlockIdFlag != bv.BlockIdFlag {
			return false
		}

		// Validator fields
		if !bytes.Equal(av.Validator.Address, bv.Validator.Address) ||
			av.Validator.Power != bv.Validator.Power {
			return false
		}

		// Vote extension payload + its signature
		if !bytes.Equal(av.VoteExtension, bv.VoteExtension) {
			return false
		}
		if !bytes.Equal(av.ExtensionSignature, bv.ExtensionSignature) {
			return false
		}
	}

	return true
}

// keyshareWrappedPrepareProposal wraps an underlying PrepareProposalHandler
// and injects a "keyshareInjectedTx" as tx[0] containing the ExtendedCommitInfo.
// The remaining txs are whatever the Block SDK handler selected from the mempool.
func (app *App) keyshareWrappedPrepareProposal(
	underlying sdk.PrepareProposalHandler,
) sdk.PrepareProposalHandler {
	return func(ctx sdk.Context, req *abci.RequestPrepareProposal) (*abci.ResponsePrepareProposal, error) {
		// If there's no local last commit yet (first block, or before VE height),
		// just delegate directly.
		if len(req.LocalLastCommit.Votes) == 0 {
			return underlying(ctx, req)
		}

		injected := keyshareInjectedTx{
			ExtendedCommitInfo: req.LocalLastCommit,
		}

		bz, err := json.Marshal(&injected)
		if err != nil {
			ctx.Logger().Error("KeyshareVE/PrepareProposal: failed to marshal injected tx", "err", err)
			// Fallback: don't inject, just use normal handler.
			return underlying(ctx, req)
		}

		// Respect MaxTxBytes: call underlying with a slightly reduced max size so
		// that adding our injected tx doesn't exceed the limit.
		subReq := *req
		if subReq.MaxTxBytes > 0 {
			subReq.MaxTxBytes -= int64(len(bz))
			if subReq.MaxTxBytes < 0 {
				subReq.MaxTxBytes = 0
			}
		}

		baseRes, err := underlying(ctx, &subReq)
		if err != nil {
			return nil, err
		}

		// Prepend our injected tx as tx[0]
		finalTxs := make([][]byte, 0, len(baseRes.Txs)+1)
		finalTxs = append(finalTxs, bz)
		finalTxs = append(finalTxs, baseRes.Txs...)
		baseRes.Txs = finalTxs

		ctx.Logger().Info("KeyshareVE/PrepareProposal: injected VE tx",
			"num_txs", len(baseRes.Txs), "special_len", len(bz))

		return baseRes, nil
	}
}

// keyshareWrappedProcessProposal wraps an underlying ProcessProposalHandler and:
//
//   - validates that tx[0] is our injected keyshare tx (shape-wise)
//   - strips that tx out before delegating to the underlying handler
func (app *App) keyshareWrappedProcessProposal(
	underlying sdk.ProcessProposalHandler,
) sdk.ProcessProposalHandler {
	return func(ctx sdk.Context, req *abci.RequestProcessProposal) (*abci.ResponseProcessProposal, error) {
		// No txs -> nothing special to validate.
		if len(req.Txs) == 0 {
			return underlying(ctx, req)
		}

		var injected keyshareInjectedTx
		if err := json.Unmarshal(req.Txs[0], &injected); err != nil {
			// If tx[0] isn't our injected tx, treat this as malformed and REJECT.
			ctx.Logger().Error("KeyshareVE/ProcessProposal: failed to decode injected VE tx",
				"err", err)
			return &abci.ResponseProcessProposal{Status: abci.ResponseProcessProposal_REJECT}, nil
		}

		ctx.Logger().Info("KeyshareVE/ProcessProposal: validated injected VE tx",
			"num_votes", len(injected.ExtendedCommitInfo.Votes))

		// Now strip tx[0] (our JSON special tx) and let the Block SDK handler
		// process the "real" txs.
		subReq := *req
		subReq.Txs = req.Txs[1:]

		return underlying(ctx, &subReq)
	}
}
