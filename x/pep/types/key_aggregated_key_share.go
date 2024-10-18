package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// DecryptionKeyKeyPrefix is the prefix to retrieve all decryption key
	DecryptionKeyKeyPrefix = "DecryptionKey/value/"
)

// AggregatedKeyShareKey returns the store key to retrieve a decryption key from the index fields
func DecryptionKeyKey(
	height uint64,
) []byte {
	var key []byte

	heightBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(heightBytes, height)
	key = append(key, heightBytes...)
	key = append(key, []byte("/")...)

	return key
}
