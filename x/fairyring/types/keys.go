package types

const (
	// ModuleName defines the module name
	ModuleName = "fairyring"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// RouterKey defines the module's message routing key
	RouterKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_fairyring"
)

const (
	RegisteredValidatorEventType    = "new validator registered"
	RegisteredValidatorEventCreator = "creator"
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}
