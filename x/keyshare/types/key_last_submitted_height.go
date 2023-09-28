package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// KeyLastSubmittedHeightPrefix is the prefix to retrieve all LastSubmittedHeight
	KeyLastSubmittedHeightPrefix = "LastSubmittedHeight/value/"
)

// LastSubmittedHeightKey returns the store key to retrieve a LastSubmittedHeight from the index fields
func LastSubmittedHeightKey(
	validator string,
) []byte {
	var key []byte

	validatorBytes := []byte(validator)
	key = append(key, validatorBytes...)
	key = append(key, []byte("/")...)

	return key
}
