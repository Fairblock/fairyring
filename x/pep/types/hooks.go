package types

import sdk "github.com/cosmos/cosmos-sdk/types"

var _ PepHooks = MultiPepHooks{}

// combine multiple pep hooks, all hook functions are run in array sequence
type MultiPepHooks []PepHooks

func NewMultiPepHooks(hooks ...PepHooks) MultiPepHooks {
	return hooks
}

func (h MultiPepHooks) AfterAggregatedKeyshare(ctx sdk.Context, reqID string, identity string, aggrKeyshare string) {
	for i := range h {
		h[i].AfterAggregatedKeyshare(ctx, reqID, identity, aggrKeyshare)
	}
}

func (h MultiPepHooks) AfterEncTxDecryption(ctx sdk.Context, reqID string, identity string, aggrKeyshare string, tx sdk.Tx, index uint64) {
	for i := range h {
		h[i].AfterEncTxDecryption(ctx, reqID, identity, aggrKeyshare, tx, index)
	}
}

func (h MultiPepHooks) AfterEncTxExecution(ctx sdk.Context, reqID string, identity string, aggrKeyshare string, tx sdk.Tx, index uint64) {
	for i := range h {
		h[i].AfterEncTxExecution(ctx, reqID, identity, aggrKeyshare, tx, index)
	}
}

func (h MultiPepHooks) AfterEncDataDecryption(ctx sdk.Context, reqID string, identity string, aggrKeyshare string, decryptedData string, index uint64) {
	for i := range h {
		h[i].AfterEncDataDecryption(ctx, reqID, identity, aggrKeyshare, decryptedData, index)
	}
}
