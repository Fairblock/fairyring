package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// GeneralKeyShareKeyPrefix is the prefix to retrieve all GeneralKeyShare
	GeneralKeyShareKeyPrefix = "GeneralKeyShare/value/"
)

// GeneralKeyShareKey returns the store key to retrieve a GeneralKeyShare from the index fields
func GeneralKeyShareKey(
	validator string,
	idType string,
	idValue string,
) []byte {
	var key []byte

	validatorBytes := []byte(validator)
	key = append(key, validatorBytes...)
	key = append(key, []byte("/")...)

	idTypeBytes := []byte(idType)
	key = append(key, idTypeBytes...)
	key = append(key, []byte("/")...)

	idValueBytes := []byte(idValue)
	key = append(key, idValueBytes...)
	key = append(key, []byte("/")...)

	return key
}
