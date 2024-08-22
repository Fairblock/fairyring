package types

import (
	"encoding/binary"
	"strconv"
	"strings"
)

var _ binary.ByteOrder

const (
	// KeyShareRequestKeyPrefix is the prefix to retrieve all Keyshare requests
	KeyShareRequestKeyPrefix = "KeyshareRequest/value/"
)

func RequestCountFromIdentity(
	identity string,
) uint64 {
	reqCountString := strings.TrimSuffix(identity, "/rq")
	reqCount, _ := strconv.ParseUint(reqCountString, 10, 64)
	return reqCount
}
