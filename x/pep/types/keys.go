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

	// ChannelID is the default channel id that module will use to transmit IBC packets.
	ChannelID = "channel-0"
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
	SubmittedEncryptedTxEventCreator      = "creator"
	SubmittedEncryptedTxEventTargetHeight = "target-height"
	SubmittedEncryptedTxEventIndex        = "index"
	SubmittedEncryptedTxEventData         = "data"
)

const (
	EncryptedTxExecutedEventType             = "executed-encrypted-tx"
	EncryptedTxExecutedEventCreator          = "creator"
	EncryptedTxExecutedEventHeight           = "target-height"
	EncryptedTxExecutedEventIndex            = "index"
	EncryptedTxExecutedEventData             = "data"
	EncryptedTxExecutedEventMemo             = "memo"
	EncryptedTxExecutedEventUnderlyingEvents = "events"
)

const (
	EncryptedTxRevertedEventType    = "reverted-encrypted-tx"
	EncryptedTxRevertedEventCreator = "creator"
	EncryptedTxRevertedEventHeight  = "height"
	EncryptedTxRevertedEventIndex   = "index"
	EncryptedTxRevertedEventReason  = "reason"
)

const (
	EncryptedTxDiscardedEventType   = "discarded-encrypted-tx"
	EncryptedTxDiscardedEventHeight = "height"
	EncryptedTxDiscardedEventTxIDs  = "tx-ids"
)

const (
	KeyShareVerificationType    = "keyshare-verification"
	KeyShareVerificationCreator = "creator"
	KeyShareVerificationHeight  = "height"
	KeyShareVerificationReason  = "reason"
)

const (
	KeyTotalEncryptedTxSubmitted = "total_encrypted_tx_submitted"
	KeyTotalSuccessEncryptedTx   = "total_success_encrypted_tx"
	KeyTotalFailedEncryptedTx    = "total_failed_encrypted_tx"
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}
