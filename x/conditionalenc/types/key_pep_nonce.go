package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	//ConditionalencNonceKeyPrefix is the prefix to retrieve all ConditionalencNonce
	ConditionalencNonceKeyPrefix = "ConditionalencNonce/value/"
)

// ConditionalencNonceKey returns the store key to retrieve a ConditionalencNonce from the index fields
func ConditionalencNonceKey(
	address string,
) []byte {
	var key []byte

	addressBytes := []byte(address)
	key = append(key, addressBytes...)
	key = append(key, []byte("/")...)

	return key
}
