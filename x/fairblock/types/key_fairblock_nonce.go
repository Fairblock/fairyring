package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// FairblockNonceKeyPrefix is the prefix to retrieve all FairblockNonce
	FairblockNonceKeyPrefix = "FairblockNonce/value/"
)

// FairblockNonceKey returns the store key to retrieve a FairblockNonce from the index fields
func FairblockNonceKey(
	address string,
) []byte {
	var key []byte

	addressBytes := []byte(address)
	key = append(key, addressBytes...)
	key = append(key, []byte("/")...)

	return key
}
