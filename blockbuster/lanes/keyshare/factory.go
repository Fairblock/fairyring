package keyshare

import (
	"errors"
	"fairyring/x/pep/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

type (
	// Factory defines the interface for processing AggregateKeyShare transactions. It is
	// a wrapper around all of the functionality that each application chain must implement
	// in order for Aggregated keyshare processing to work.
	Factory interface {
		// IsKeyshareTx defines a function that checks if a transaction qualifies as AggregateKeyshare Tx.
		IsKeyshareTx(tx sdk.Tx) bool

		// GetKeyShareInfo defines a function that returns the Aggregated KeyShare info from the Tx
		GetKeyShareInfo(tx sdk.Tx) (*types.AggregatedKeyShare, error)
	}

	// DefaultKeyshareFactory defines a default implmentation for the keyshare factory interface
	// for processing aggregate keyshare transactions.
	DefaultKeyshareFactory struct {
		txDecoder sdk.TxDecoder
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
func NewDefaultKeyshareFactory(txDecoder sdk.TxDecoder) Factory {
	return &DefaultKeyshareFactory{
		txDecoder: txDecoder,
	}
}

func (config *DefaultKeyshareFactory) IsKeyshareTx(tx sdk.Tx) bool {
	msgs := tx.GetMsgs()
	if len(msgs) != 1 {
		return false
	}

	switch msgs[0].(type) {
	case *types.MsgCreateAggregatedKeyShare:
		return true
	}

	return false
}

func (config *DefaultKeyshareFactory) GetKeyShareInfo(tx sdk.Tx) (*types.AggregatedKeyShare, error) {
	msg, err := GetAggregateKeyshareMsgFromTx(tx)
	if err != nil {
		return nil, err
	}

	return &types.AggregatedKeyShare{
		Height:  msg.Height,
		Data:    msg.Data,
		Creator: msg.Creator,
	}, nil
}

func GetAggregateKeyshareMsgFromTx(tx sdk.Tx) (*types.MsgCreateAggregatedKeyShare, error) {
	msgs := tx.GetMsgs()
	if len(msgs) != 1 {
		return nil, errors.New("invalid MsgCreateAggregatedKeyShare transaction")
	}

	t, ok := msgs[0].(*types.MsgCreateAggregatedKeyShare)
	if ok {
		return t, nil
	}

	return nil, errors.New("invalid MsgCreateAggregatedKeyShare transaction")
}
