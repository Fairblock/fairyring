package types

const (
	// ModuleName defines the module name
	ModuleName = "zkp"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_zkp"
)

var (
	ParamsKey = []byte("p_zkp")
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}

