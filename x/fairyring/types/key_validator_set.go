package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// ValidatorSetKeyPrefix is the prefix to retrieve all ValidatorSet
	ValidatorSetKeyPrefix = "ValidatorSet/value/"
)

// ValidatorSetKey returns the store key to retrieve a ValidatorSet from the index fields
func ValidatorSetKey(
	index string,
) []byte {
	var key []byte

	indexBytes := []byte(index)
	key = append(key, indexBytes...)
	key = append(key, []byte("/")...)

	return key
}
