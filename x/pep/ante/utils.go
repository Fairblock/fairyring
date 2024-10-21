package ante

import (
	peptypes "github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// KeyshareLane is an interface that defines the methods required to interact with the keyshare lane.
type KeyshareLane interface {
	GetDecryptionKeyInfo(tx sdk.Tx) (*peptypes.DecryptionKey, error)
}
