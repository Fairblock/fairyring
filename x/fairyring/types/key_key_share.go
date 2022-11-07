package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// KeyShareKeyPrefix is the prefix to retrieve all KeyShare
	KeyShareKeyPrefix = "KeyShare/value/"
)

// KeyShareKey returns the store key to retrieve a KeyShare from the index fields
func KeyShareKey(
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
