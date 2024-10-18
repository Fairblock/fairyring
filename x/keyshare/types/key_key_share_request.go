package types

import (
	"encoding/binary"
	"strconv"
)

var _ binary.ByteOrder

const (
	// KeyShareRequestKeyPrefix is the prefix to retrieve all Keyshare requests
	DecryptionKeyRequestKeyPrefix        = "DecryptionKeyRequest/value/"
	PrivateDecryptionKeyRequestKeyPrefix = "PrivateDecryptionKeyRequest/value/"
)

func IdentityFromRequestCount(
	reqCount uint64,
) string {
	reqNumber := strconv.FormatUint(reqCount, 10)
	identity := reqNumber + "/rq"
	return identity
}
