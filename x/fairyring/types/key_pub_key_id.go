package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// PubKeyIDKeyPrefix is the prefix to retrieve all PubKeyID
	PubKeyIDKeyPrefix = "PubKeyID/value/"
)

// PubKeyIDKey returns the store key to retrieve a PubKeyID from the index fields
func PubKeyIDKey(
	height uint64,
) []byte {
	var key []byte

	heightBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(heightBytes, height)
	key = append(key, heightBytes...)
	key = append(key, []byte("/")...)

	return key
}
