package keyshare

import (
	"context"
	"errors"
	"fmt"
	"strconv"

	"fairyring/blockbuster"
	"fairyring/blockbuster/utils"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkmempool "github.com/cosmos/cosmos-sdk/types/mempool"
)

var _ Mempool = (*KeyShareMempool)(nil)

type (
	// Mempool defines the interface of the auction mempool.
	Mempool interface {
		sdkmempool.Mempool

		// Contains returns true if the transaction is contained in the mempool.
		Contains(tx sdk.Tx) (bool, error)
	}

	// KeyShareMempool defines an KeyShare mempool. It can be seen as an extension of
	// an SDK PriorityNonceMempool, i.e. a mempool that supports <sender, nonce>
	// two-dimensional priority ordering, with the additional support of prioritizing
	// and indexing submitted aggregated keyshares.
	KeyShareMempool struct {
		// index defines an index of submitted keyshares.
		index sdkmempool.Mempool

		// txEncoder defines the sdk.Tx encoder that allows us to encode transactions
		// to bytes.
		txEncoder sdk.TxEncoder

		// txIndex is a map of all transactions in the mempool. It is used
		// to quickly check if a transaction is already in the mempool.
		txIndex map[string]struct{}

		// Factory implements the functionality required to process AggregateKeyshare transactions.
		Factory
	}
)

// TxPriority returns a TxPriority over AggregatedKeyShare transactions only. It
// is to be used in the AggregatedKeyShare index only.
func TxPriority(config Factory) blockbuster.TxPriority[string] {
	return blockbuster.TxPriority[string]{
		GetTxPriority: func(goCtx context.Context, tx sdk.Tx) string {
			ksInfo, err := config.GetKeyShareInfo(tx)
			if err != nil {
				panic(err)
			}

			return strconv.FormatUint(ksInfo.Height, 10)
		},
		Compare: func(a, b string) int {
			aUint, _ := strconv.ParseUint(a, 10, 64)
			bUint, _ := strconv.ParseUint(b, 10, 64)

			switch {
			case aUint < bUint:
				return 1
			case aUint > bUint:
				return -1
			default:
				return 0
			}
		},
		MinValue: "",
	}
}

// NewMempool returns a new AggregateKeyShare mempool.
func NewMempool(txEncoder sdk.TxEncoder, maxTx int, config Factory) *KeyShareMempool {
	return &KeyShareMempool{
		index: blockbuster.NewPriorityMempool(
			blockbuster.PriorityNonceMempoolConfig[string]{
				TxPriority: TxPriority(config),
				MaxTx:      maxTx,
			},
		),
		txEncoder: txEncoder,
		txIndex:   make(map[string]struct{}),
		Factory:   config,
	}
}

// Insert inserts a transaction into the KeyShare mempool.
func (am *KeyShareMempool) Insert(ctx context.Context, tx sdk.Tx) error {
	ksInfo, err := am.GetKeyShareInfo(tx)
	if err != nil {
		return err
	}

	// This mempool only supports aggrgayted Keyshare transactions.
	if ksInfo == nil {
		return fmt.Errorf("invalid transaction type")
	}

	if err := am.index.Insert(ctx, tx); err != nil {
		return fmt.Errorf("failed to insert tx into keyshare index: %w", err)
	}

	_, txHashStr, err := utils.GetTxHashStr(am.txEncoder, tx)
	if err != nil {
		return err
	}

	am.txIndex[txHashStr] = struct{}{}

	return nil
}

// Remove removes a transaction from the mempool based.
func (am *KeyShareMempool) Remove(tx sdk.Tx) error {
	ksInfo, err := am.GetKeyShareInfo(tx)
	if err != nil {
		return err
	}

	// This mempool only supports aggregated keyshare transactions.
	if ksInfo == nil {
		return fmt.Errorf("invalid transaction type")
	}

	am.removeTx(am.index, tx)

	return nil
}

func (am *KeyShareMempool) Select(ctx context.Context, txs [][]byte) sdkmempool.Iterator {
	return am.index.Select(ctx, txs)
}

func (am *KeyShareMempool) CountTx() int {
	return am.index.CountTx()
}

// Contains returns true if the transaction is contained in the mempool.
func (am *KeyShareMempool) Contains(tx sdk.Tx) (bool, error) {
	_, txHashStr, err := utils.GetTxHashStr(am.txEncoder, tx)
	if err != nil {
		return false, fmt.Errorf("failed to get tx hash string: %w", err)
	}

	_, ok := am.txIndex[txHashStr]
	return ok, nil
}

func (am *KeyShareMempool) removeTx(mp sdkmempool.Mempool, tx sdk.Tx) {
	if err := mp.Remove(tx); err != nil && !errors.Is(err, sdkmempool.ErrTxNotFound) {
		panic(fmt.Errorf("failed to remove invalid transaction from the mempool: %w", err))
	}

	_, txHashStr, err := utils.GetTxHashStr(am.txEncoder, tx)
	if err != nil {
		panic(fmt.Errorf("failed to get tx hash string: %w", err))
	}

	delete(am.txIndex, txHashStr)
}
