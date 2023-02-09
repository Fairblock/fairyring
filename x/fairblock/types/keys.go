package types

const (
	// ModuleName defines the module name
	ModuleName = "fairblock"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// RouterKey defines the module's message routing key
	RouterKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_fairblock"

	// Version defines the current version the IBC module supports
	Version = "fairblock-1"

	// PortID is the default port id that module binds to
	PortID = "fairblock"
)

var (
	// PortKey defines the key to store the port ID in store
	PortKey               = KeyPrefix("fairblock-port-")
	ChannelKey            = KeyPrefix("fairblock-channel-")
	LatestHeightKey       = KeyPrefix("fairblock-latest-height-")
	LastExecutedHeightKey = KeyPrefix("fairblock-last-executed-height-")
)

const (
	SubmittedEncryptedTxEventType         = "new-encrypted-tx-submitted"
	SubmittedEncryptedTxEventCreator      = "new-encrypted-tx-creator"
	SubmittedEncryptedTxEventTargetHeight = "new-encrypted-tx-target-height"
	SubmittedEncryptedTxEventIndex        = "new-encrypted-tx-index"
	SubmittedEncryptedTxEventData         = "new-encrypted-tx-data"
)

const (
	EncryptedTxExecutedEventType    = "executed-encrypted-tx"
	EncryptedTxExecutedEventCreator = "executed-encrypted-tx-creator"
	EncryptedTxExecutedEventHeight  = "executed-encrypted-tx-target-height"
	EncryptedTxExecutedEventIndex   = "executed-encrypted-tx-index"
	EncryptedTxExecutedEventData    = "executed-encrypted-tx-data"
)

const (
	EncryptedTxRevertedEventType    = "reverted-encrypted-tx"
	EncryptedTxRevertedEventCreator = "reverted-encrypted-tx-creator"
	EncryptedTxRevertedEventHeight  = "reverted-encrypted-tx-target-height"
	EncryptedTxRevertedEventIndex   = "reverted-encrypted-tx-index"
	EncryptedTxRevertedEventReason  = "reverted-encrypted-tx-reason"
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}
