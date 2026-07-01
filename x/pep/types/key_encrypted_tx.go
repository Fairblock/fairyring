package types

import (
	"encoding/binary"
)

var _ binary.ByteOrder

const (
	// EncryptedTxKeyPrefix is the prefix to retrieve all EncryptedTx
	EncryptedTxKeyPrefix         = "EncryptedTx/value/"
	GenEncTxKeyPrefix            = "GenEncTx/value/"
	GenEncTxEntryKeyPrefix       = "entry/"
	GenEncTxTxKeyPrefix          = "tx/"
	GenEncTxCountKeyPrefix       = "count/"
	PrivateRequestQueueKeyPrefix = "PrivateReq/value/"
	PrivateSignalQueueKeyPrefix  = "PrivateSignal/value/"
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

// EncryptedTxKey returns the per-height/per-index key for one encrypted tx.
//
// This intentionally keeps EncryptedTxAllFromHeightKey as the common height
// prefix, so all entries for a height can be iterated or removed together while
// avoiding the old hot-height protobuf-array rewrite on every submit.
func EncryptedTxKey(
	targetHeight uint64,
	index uint64,
) []byte {
	key := EncryptedTxAllFromHeightKey(targetHeight)
	key = append(key, []byte("tx/")...)

	indexBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(indexBytes, index)
	key = append(key, indexBytes...)
	key = append(key, []byte("/")...)

	return key
}

// EncryptedTxCountKey stores the next accepted index for one target height.
func EncryptedTxCountKey(
	targetHeight uint64,
) []byte {
	key := EncryptedTxAllFromHeightKey(targetHeight)
	key = append(key, []byte("count/")...)
	return key
}

func genEncTxIdentityScopedKey(prefix string, identity string) []byte {
	var key []byte
	key = append(key, []byte(prefix)...)

	identityBytes := []byte(identity)
	identityLenBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(identityLenBytes, uint64(len(identityBytes)))
	key = append(key, identityLenBytes...)
	key = append(key, identityBytes...)
	key = append(key, []byte("/")...)

	return key
}

// GenEncTxEntryKey stores metadata for one general encrypted tx identity.
// The encrypted tx list itself is intentionally stored separately by index.
func GenEncTxEntryKey(identity string) []byte {
	return genEncTxIdentityScopedKey(GenEncTxEntryKeyPrefix, identity)
}

// GenEncTxTxPrefix returns the prefix containing all encrypted txs for one identity.
func GenEncTxTxPrefix(identity string) []byte {
	return genEncTxIdentityScopedKey(GenEncTxTxKeyPrefix, identity)
}

// GenEncTxTxKey returns the per-identity/per-index key for one general encrypted tx.
func GenEncTxTxKey(identity string, index uint64) []byte {
	key := GenEncTxTxPrefix(identity)

	indexBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(indexBytes, index)
	key = append(key, indexBytes...)
	key = append(key, []byte("/")...)

	return key
}

// GenEncTxCountKey stores the next accepted index for one general encrypted tx identity.
func GenEncTxCountKey(identity string) []byte {
	return genEncTxIdentityScopedKey(GenEncTxCountKeyPrefix, identity)
}

func GenEncTxQueueKey(
	identity string,
) []byte {
	var key []byte

	b := []byte(identity)
	key = append(key, b...)

	return key
}
