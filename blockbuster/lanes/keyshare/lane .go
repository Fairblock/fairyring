package keyshare

import (
	"fairyring/blockbuster"
	"fairyring/blockbuster/lanes/base"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

const (
	// LaneName defines the name of the free lane.
	LaneName = "keyshare"
)

var (
	_ blockbuster.Lane = (*KeyShareLane)(nil)
	_ Factory          = (*KeyShareLane)(nil)
)

// KeyShareLane defines the lane that is responsible for processing AggregateKeyShare transactions.
type KeyShareLane struct {
	// Mempool defines the mempool for the lane.
	Mempool

	// LaneConfig defines the base lane configuration.
	*base.DefaultLane

	// Factory defines the API/functionality which is responsible for determining
	// if a transaction is a aggregateKeyshare transaction and how to extract relevant
	// information from the transaction (creator Address).
	Factory
}

// NewKeyShareLane returns a new KeyShare lane.
func NewKeyShareLane(
	cfg blockbuster.BaseLaneConfig,
	maxTx int,
	af Factory,
) *KeyShareLane {
	if err := cfg.ValidateBasic(); err != nil {
		panic(err)
	}

	return &KeyShareLane{
		Mempool:     NewMempool(cfg.TxEncoder, maxTx, af),
		DefaultLane: base.NewDefaultLane(cfg),
		Factory:     af,
	}
}

// Match returns true if the transaction is a aated keyshareggreg transaction.
// This is determined by the KeyShareFactory.
func (l *KeyShareLane) Match(tx sdk.Tx) bool {
	return l.IsKeyshareTx(tx)
}

// Name returns the name of the lane.
func (l *KeyShareLane) Name() string {
	return LaneName
}
