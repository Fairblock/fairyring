package types

import (
	"errors"
	"strconv"
	"strings"
)

const (
	// ModuleName defines the module name
	ModuleName = "auction"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_auction"
)

var (
	ParamsKey = []byte("p_auction")
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}

func DecodeAuctionIdentity(identity string) (uint64, uint64, error) {
	// auction/${creator}/${resolve_at}/${id}
	out := strings.Split(identity, "/")
	if len(out) != 4 {
		return 0, 0, errors.New("invalid auction identity")
	}

	resolveAt, err := strconv.ParseUint(out[2], 10, 64)
	if err != nil {
		return 0, 0, err
	}

	id, err := strconv.ParseUint(out[3], 10, 64)
	if err != nil {
		return 0, 0, err
	}

	return resolveAt, id, nil
}
