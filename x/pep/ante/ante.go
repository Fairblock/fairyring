package ante

import (
	"fmt"

	"fairyring/x/pep/keeper"
	"fairyring/x/pep/types"

	"cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

var _ sdk.AnteDecorator = PEPDecorator{}

type (
	// KeyShareLane is an interface that defines the methods required to interact with
	// the Keyshare lane.
	KeyShareLane interface {
		IsKeyshareTx(tx sdk.Tx) bool
		GetKeyShareInfo(tx sdk.Tx) (*types.AggregatedKeyShare, error)
	}

	// Mempool is an interface that defines the methods required to interact with the application-side mempool.
	Mempool interface {
		Contains(tx sdk.Tx) (bool, error)
		Remove(tx sdk.Tx) error
	}

	// PEPDecorator is an AnteDecorator that validates the KeyShare transactions.
	PEPDecorator struct {
		pepKeeper keeper.Keeper
		txEncoder sdk.TxEncoder
		lane      KeyShareLane
		mempool   Mempool
	}
)

func NewPepDecorator(pk keeper.Keeper, txEncoder sdk.TxEncoder, lane KeyShareLane, mempool Mempool) PEPDecorator {
	return PEPDecorator{
		pepKeeper: pk,
		txEncoder: txEncoder,
		lane:      lane,
		mempool:   mempool,
	}
}

// AnteHandle validates that the keyshare is valid if one exists.
func (pd PEPDecorator) AnteHandle(ctx sdk.Context, tx sdk.Tx, simulate bool, next sdk.AnteHandler) (sdk.Context, error) {
	// If comet is re-checking a transaction, we only need to check if the transaction is in the application-side mempool.
	if ctx.IsReCheckTx() {
		contains, err := pd.mempool.Contains(tx)
		if err != nil {
			return ctx, err
		}

		if !contains {
			return ctx, fmt.Errorf("transaction not found in application-side mempool")
		}
	}

	ksInfo, err := pd.lane.GetKeyShareInfo(tx)
	if ksInfo != nil {
		return ctx, err
	}

	// Validate the keyshare if one exists.
	if ksInfo != nil {
		if ctx.BlockHeight() > int64(ksInfo.Height) {
			return ctx, errors.Wrap(err, "failed to validate keyshare")
		}
	}

	return next(ctx, tx, simulate)
}
