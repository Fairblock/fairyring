package types

import (
	"encoding/binary"
	"strconv"
)

var _ binary.ByteOrder

const (
	// KeyShareRequestKeyPrefix is the prefix to retrieve all Keyshare requests
	KeyShareRequestKeyPrefix        = "KeyshareRequest/value/"
	PrivateKeyShareRequestKeyPrefix = "PrivateKeyshareRequest/value/"
)

func IdentityFromRequestCount(
	reqCount uint64,
) string {
	reqNumber := strconv.FormatUint(reqCount, 10)
	identity := reqNumber + "/rq"
	return identity
}
