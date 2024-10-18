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

		// GetDecryptionKeyInfo defines a function that returns the Aggregated KeyShare info from the Tx
		GetDecryptionKeyInfo(tx sdk.Tx) (*peptypes.DecryptionKey, error)

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
	case *peptypes.MsgSubmitDecryptionKey:
		return true
	}

	return false
}

func (config *DefaultKeyshareFactory) GetDecryptionKeyInfo(tx sdk.Tx) (*peptypes.DecryptionKey, error) {
	msg, err := GetSubmitDecryptionKeyMsgFromTx(tx)
	if err != nil {
		return nil, err
	}

	return &peptypes.DecryptionKey{
		Height:  msg.Height,
		Data:    msg.Data,
		Creator: msg.Creator,
	}, nil
}

func GetSubmitDecryptionKeyMsgFromTx(tx sdk.Tx) (*peptypes.MsgSubmitDecryptionKey, error) {
	msgs := tx.GetMsgs()
	if len(msgs) != 1 {
		return nil, errors.New("invalid MsgSubmitDecryptionKey transaction")
	}

	t, ok := msgs[0].(*peptypes.MsgSubmitDecryptionKey)
	if ok {
		return t, nil
	}

	return nil, errors.New("invalid MsgSubmitDecryptionKey transaction")
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
		ksInfo, err := config.GetDecryptionKeyInfo(tx)
		return ksInfo != nil && err == nil
	}
}
