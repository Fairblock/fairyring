package types

import (
	"encoding/binary"
	"strconv"
)

var _ binary.ByteOrder

const (
	// EncryptedTxKeyPrefix is the prefix to retrieve all EncryptedTx
	EncryptedTxKeyPrefix      = "EncryptedTx/value/"
	EncryptedTxKeyCountPrefix = "EncryptedTx/count/"
)

// EncryptedTxKey returns the store key to retrieve a EncryptedTx from the index fields
func EncryptedTxKey(
	targetHeight uint64,
	index uint64,
) []byte {
	var key []byte

	targetHeightBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(targetHeightBytes, targetHeight)
	key = append(key, targetHeightBytes...)
	key = append(key, []byte("/")...)

	indexBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(indexBytes, index)
	key = append(key, indexBytes...)
	key = append(key, []byte("/")...)

	return key
}

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

// EncryptedTxCountKey returns the store key to retrieve count of encrypted txs on specific block height
func EncryptedTxCountKey(
	blockHeight uint64,
) []byte {
	var key []byte

	heightBytes := []byte(strconv.FormatUint(blockHeight, 10))
	key = append(key, heightBytes...)
	key = append(key, []byte("/")...)

	return key
}
