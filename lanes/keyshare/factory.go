package keyshare

import (
	"errors"
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"

	peptypes "github.com/Fairblock/fairyring/x/pep/types"
	signer_extraction "github.com/skip-mev/block-sdk/v2/adapters/signer_extraction_adapter"
	"github.com/skip-mev/block-sdk/v2/block/base"
)

type (
	// Factory defines the interface for processing AggregateKeyShare transactions. It is
	// a wrapper around all of the functionality that each application chain must implement
	// in order for Aggregated keyshare processing to work.
	Factory interface {
		// IsKeyshareTx defines a function that checks if a transaction qualifies as AggregateKeyshare Tx.
		IsKeyshareTx(tx sdk.Tx) bool

		// GetKeyShareInfo defines a function that returns the Aggregated KeyShare info from the Tx
		GetKeyShareInfo(tx sdk.Tx) (*peptypes.AggregatedKeyShare, error)

		// MatchHandler defines a function that checks if a transaction matches the keyshare lane.
		MatchHandler() base.MatchHandler
	}

	// DefaultKeyshareFactory defines a default implmentation for the keyshare factory interface
	// for processing aggregate keyshare transactions.
	DefaultKeyshareFactory struct {
		txDecoder       sdk.TxDecoder
		signerExtractor signer_extraction.Adapter
	}

	// TxWithTimeoutHeight is used to extract timeouts from sdk.Tx transactions. In the case where,
	// timeouts are explicitly set on the sdk.Tx, we can use this interface to extract the timeout.
	TxWithTimeoutHeight interface {
		sdk.Tx

		GetTimeoutHeight() uint64
	}
)

var _ Factory = (*DefaultKeyshareFactory)(nil)

// NewDefaultKeyshareFactory returns a default keyshare factory interface implementation.
func NewDefaultKeyshareFactory(txDecoder sdk.TxDecoder, extractor signer_extraction.Adapter) Factory {
	return &DefaultKeyshareFactory{
		txDecoder:       txDecoder,
		signerExtractor: extractor,
	}
}

func (config *DefaultKeyshareFactory) IsKeyshareTx(tx sdk.Tx) bool {
	msgs := tx.GetMsgs()
	if len(msgs) != 1 {
		return false
	}

	switch msgs[0].(type) {
	case *peptypes.MsgCreateAggregatedKeyShare:
		return true
	}

	return false
}

func (config *DefaultKeyshareFactory) GetKeyShareInfo(tx sdk.Tx) (*peptypes.AggregatedKeyShare, error) {
	msg, err := GetAggregateKeyshareMsgFromTx(tx)
	if err != nil {
		return nil, err
	}

	return &peptypes.AggregatedKeyShare{
		Height:  msg.Height,
		Data:    msg.Data,
		Creator: msg.Creator,
	}, nil
}

func GetAggregateKeyshareMsgFromTx(tx sdk.Tx) (*peptypes.MsgCreateAggregatedKeyShare, error) {
	msgs := tx.GetMsgs()
	if len(msgs) != 1 {
		return nil, errors.New("invalid MsgCreateAggregatedKeyShare transaction")
	}

	t, ok := msgs[0].(*peptypes.MsgCreateAggregatedKeyShare)
	if ok {
		return t, nil
	}

	return nil, errors.New("invalid MsgCreateAggregatedKeyShare transaction")
}

// GetTimeoutHeight returns the timeout height of the transaction.
func (config *DefaultKeyshareFactory) GetTimeoutHeight(tx sdk.Tx) (uint64, error) {
	timeoutTx, ok := tx.(TxWithTimeoutHeight)
	if !ok {
		return 0, fmt.Errorf("cannot extract timeout; transaction does not implement TxWithTimeoutHeight")
	}

	return timeoutTx.GetTimeoutHeight(), nil
}

// MatchHandler defines a default function that checks if a transaction matches the keyshare lane.
func (config *DefaultKeyshareFactory) MatchHandler() base.MatchHandler {
	return func(ctx sdk.Context, tx sdk.Tx) bool {
		bidInfo, err := config.GetKeyShareInfo(tx)
		return bidInfo != nil && err == nil
	}
}
