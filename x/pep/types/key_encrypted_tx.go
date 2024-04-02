package types

import (
	"encoding/binary"
)

var _ binary.ByteOrder

const (
	// EncryptedTxKeyPrefix is the prefix to retrieve all EncryptedTx
	EncryptedTxKeyPrefix         = "EncryptedTx/value/"
	GenEncTxKeyPrefix            = "GenEncTx/value/"
	GenEncTxReqQueueKeyPrefix    = "GenEncTxReqQueue/value/"
	GenEncTxSignalQueueKeyPrefix = "GenEncTxSignalQueue/value/"
	GenEncTxExeQueueKeyPrefix    = "GenEncTxExeQueue/value/"
)

func EncryptedTxAllFromHeightKey(
	targetHeight uint64,
) []byte {
	var key []byte

	targetHeightBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(targetHeightBytes, targetHeight)
	key = append(key, targetHeightBytes...)
	key = append(key, []byte("/")...)

	return key
}

func GenEncTxQueueKey(
	identity string,
) []byte {
	var key []byte

	b := []byte(identity)
	key = append(key, b...)

	return key
}
