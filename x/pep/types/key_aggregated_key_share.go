package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// AggregatedKeyShareKeyPrefix is the prefix to retrieve all AggregatedKeyShare
	AggregatedKeyShareKeyPrefix = "AggregatedKeyShare/value/"
)

// AggregatedKeyShareKey returns the store key to retrieve a AggregatedKeyShare from the index fields
func AggregatedKeyShareKey(
	height uint64,
) []byte {
	var key []byte

	heightBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(heightBytes, height)
	key = append(key, heightBytes...)
	key = append(key, []byte("/")...)

	return key
}
