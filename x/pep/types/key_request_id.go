package types

import (
	"encoding/binary"
	"fmt"
)

var _ binary.ByteOrder

const (
	// RequestIdKeyPrefix is the prefix to retrieve all RequestId
	RequestIdKeyPrefix        = "RequestId/value/"
	PrivateRequestIdKeyPrefix = "PrivateRequestId/value/"
	ContractKeyPrefix         = "Contract/value/"
)

// RequestIdKey returns the store key to retrieve a RequestId from the index fields
func RequestIdKey(
	creator string,
	requestID string,
) []byte {
	var key []byte

	creatorBytes := []byte(creator)
	key = append(key, creatorBytes...)
	key = append(key, []byte("/")...)

	requestIDBytes := []byte(requestID)
	key = append(key, requestIDBytes...)
	key = append(key, []byte("/")...)

	return key
}

func GetReqIDStr(creator string, requestID string) string {
	return fmt.Sprintf("%s/%s", creator, requestID)
}
