package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// FairblockExecutedNonceKeyPrefix is the prefix to retrieve all FairblockExecutedNonce
	FairblockExecutedNonceKeyPrefix = "FairblockExecutedNonce/value/"
)

// FairblockExecutedNonceKey returns the store key to retrieve a FairblockExecutedNonce from the index fields
func FairblockExecutedNonceKey(
	address string,
) []byte {
	var key []byte

	addressBytes := []byte(address)
	key = append(key, addressBytes...)
	key = append(key, []byte("/")...)

	return key
}
