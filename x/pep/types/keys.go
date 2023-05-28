package types

const (
	// ModuleName defines the module name
	ModuleName = "pep"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// RouterKey defines the module's message routing key
	RouterKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_pep"

	// Version defines the current version the IBC module supports
	Version = "pep-1"

	// PortID is the default port id that module binds to
	PortID = "pep"
)

var (
	// PortKey defines the key to store the port ID in store
	PortKey               = KeyPrefix("pep-port-")
	ChannelKey            = KeyPrefix("pep-channel-")
	LatestHeightKey       = KeyPrefix("pep-latest-height-")
	LastExecutedHeightKey = KeyPrefix("pep-last-executed-height-")
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

const (
	KeyShareVerificationType    = "keyshare-verification"
	KeyShareVerificationCreator = "keyshare-verification-creator"
	KeyShareVerificationHeight  = "keyshare-verification-height"
	KeyShareVerificationReason  = "keyshare-verification-reason"
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}
