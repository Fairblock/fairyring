package keyshare

import (
	"github.com/skip-mev/block-sdk/v2/block/base"
)

const (
	// LaneName defines the name of the keyshare lane.
	LaneName = "keyshare"
)

// KeyShareLane defines the lane that is responsible for processing AggregateKeyShare transactions.
type (
	KeyShareLane struct { //nolint
		*base.BaseLane

		// Factory defines the API/functionality which is responsible for determining
		// if a transaction is a aggregateKeyshare transaction and how to extract relevant
		// information from the transaction (creator Address).
		Factory
	}
)

// NewKeyShareLane returns a new KeyShare lane.
func NewKeyShareLane(
	cfg base.LaneConfig,
	factory Factory,
	matchHandler base.MatchHandler,
) *KeyShareLane {
	options := []base.LaneOption{
		base.WithMatchHandler(matchHandler),
		base.WithMempoolConfigs[string](cfg, TxPriority(factory)),
	}

	baseLane, err := base.NewBaseLane(
		cfg,
		LaneName,
		options...,
	)
	if err != nil {
		panic(err)
	}

	// Create the mev proposal handler.
	handler := NewProposalHandler(baseLane, factory)
	baseLane.WithOptions(
		base.WithPrepareLaneHandler(handler.PrepareLaneHandler()),
		base.WithProcessLaneHandler(handler.ProcessLaneHandler()),
	)

	return &KeyShareLane{
		BaseLane: baseLane,
		Factory:  factory,
	}
}
