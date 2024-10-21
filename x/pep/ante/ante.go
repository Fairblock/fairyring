package ante

import (
	"github.com/Fairblock/fairyring/x/pep/keeper"

	"cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

var _ sdk.AnteDecorator = PEPDecorator{}

type (
	// PEPDecorator is an AnteDecorator that validates the Keyshare transactions.
	PEPDecorator struct {
		pepKeeper keeper.Keeper
		txEncoder sdk.TxEncoder
		lane      KeyshareLane
	}
)

func NewPepDecorator(pk keeper.Keeper, txEncoder sdk.TxEncoder, lane KeyshareLane) PEPDecorator {
	return PEPDecorator{
		pepKeeper: pk,
		txEncoder: txEncoder,
		lane:      lane,
	}
}

// AnteHandle validates that the keyshare is valid if one exists.
func (pd PEPDecorator) AnteHandle(ctx sdk.Context, tx sdk.Tx, simulate bool, next sdk.AnteHandler) (sdk.Context, error) {
	ksInfo, err := pd.lane.GetDecryptionKeyInfo(tx)
	if ksInfo == nil {
		return ctx, err
	}

	// Validate the keyshare if one exists.
	if ctx.BlockHeight() > int64(ksInfo.Height) {
		return ctx, errors.Wrap(err, "failed to validate keyshare")
	}

	return next(ctx, tx, simulate)
}
