package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// AggregatedConditionalKeyShareKeyPrefix is the prefix to retrieve all AggregatedConditionalKeyShare
	AggregatedConditionalKeyShareKeyPrefix = "AggregatedConditionalKeyShare/value/"
)

// AggregatedConditionalKeyShareKey returns the store key to retrieve a AggregatedConditionalKeyShare from the index fields
func AggregatedConditionalKeyShareKey(
	condition string,
) []byte {
	var key []byte

	heightBytes := []byte(condition)
	key = append(key, heightBytes...)
	key = append(key, []byte("/")...)

	return key
}
