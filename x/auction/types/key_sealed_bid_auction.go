package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	AuctionDetailListKeyPrefix = "AuctionDetailList/value/"
)

func AuctionDetailsFromHeightKey(
	targetHeight uint64,
) []byte {
	var key []byte

	targetHeightBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(targetHeightBytes, targetHeight)
	key = append(key, targetHeightBytes...)
	key = append(key, []byte("/")...)

	return key
}
