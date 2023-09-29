package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// AggregatedKeyShareKeyPrefix is the prefix to retrieve all AggregatedKeyShare
	AggregatedKeyShareKeyPrefix = "AggregatedKeyShare/value/"
)

// AggregatedKeyShareKey returns the store key to retrieve a AggregatedKeyShare from the index fields
func AggregatedKeyShareKey(
	condition string,
) []byte {
	var key []byte

	heightBytes := []byte(condition)
	key = append(key, heightBytes...)
	key = append(key, []byte("/")...)

	return key
}
