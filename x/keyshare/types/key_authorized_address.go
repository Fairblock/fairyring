package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// AuthorizedAddressKeyPrefix is the prefix to retrieve all AuthorizedAddress
	AuthorizedAddressKeyPrefix = "AuthorizedAddress/value/"

	AuthorizedCountKeyPrefix = "AuthorizedCount/value/"
)

// AuthorizedAddressKey returns the store key to retrieve a AuthorizedAddress from the index fields
func AuthorizedAddressKey(
	target string,
) []byte {
	var key []byte

	targetBytes := []byte(target)
	key = append(key, targetBytes...)
	key = append(key, []byte("/")...)

	return key
}

func AuthorizedCountKey(
	creator string,
) []byte {
	var key []byte

	targetBytes := []byte(creator)
	key = append(key, targetBytes...)
	key = append(key, []byte("/")...)

	return key
}