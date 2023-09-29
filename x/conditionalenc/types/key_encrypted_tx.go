package types

import (
	"encoding/binary"
)

var _ binary.ByteOrder

const (
	// EncryptedTxKeyPrefix is the prefix to retrieve all EncryptedTx
	EncryptedTxKeyPrefix = "EncryptedTx/value/"
)

func EncryptedTxAllFromCondition(
	condition string,
) []byte {
	var key []byte

	targetHeightBytes := []byte(condition)
	// binary.BigEndian.PutUint64(targetHeightBytes, condition)
	key = append(key, targetHeightBytes...)
	key = append(key, []byte("/")...)

	return key
}
