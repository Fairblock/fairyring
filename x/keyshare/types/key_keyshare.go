package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// KeyshareKeyPrefix is the prefix to retrieve all Keyshare
	KeyshareKeyPrefix = "Keyshare/value/"
)

// KeyshareKey returns the store key to retrieve a Keyshare from the index fields
func KeyshareKey(
	validator string,
	blockHeight uint64,
) []byte {
	var key []byte

	validatorBytes := []byte(validator)
	key = append(key, validatorBytes...)
	key = append(key, []byte("/")...)

	blockHeightBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(blockHeightBytes, blockHeight)
	key = append(key, blockHeightBytes...)
	key = append(key, []byte("/")...)

	return key
}
