package types

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
