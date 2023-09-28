package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	//PepNonceKeyPrefix is the prefix to retrieve all PepNonce
	PepNonceKeyPrefix = "PepNonce/value/"
)

// PepNonceKey returns the store key to retrieve a PepNonce from the index fields
func PepNonceKey(
	address string,
) []byte {
	var key []byte

	addressBytes := []byte(address)
	key = append(key, addressBytes...)
	key = append(key, []byte("/")...)

	return key
}
