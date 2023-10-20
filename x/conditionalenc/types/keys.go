package types

const (
	// ModuleName defines the module name
	ModuleName = "conditionalenc"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// RouterKey defines the module's message routing key
	RouterKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_conditionalenc"

	// Version defines the current version the IBC module supports
	Version = "ics20-1"

	// PortID is the default port id that module binds to
	PortID = "conditionalenc"

	// ChannelID is the default channel id that module will use to transmit IBC packets.
	ChannelID = "channel-0"
)

var (
	// PortKey defines the key to store the port ID in store
	PortKey               = KeyPrefix("conditionalenc-port-")
	ChannelKey            = KeyPrefix("conditionalenc-channel-")
	LatestConditionKey       = KeyPrefix("conditionalenc-latest-Condition-")
	LastExecutedConditionKey = KeyPrefix("conditionalenc-last-executed-Condition-")
)

const (
	SubmittedEncryptedTxEventType         = "new-encrypted-tx-submitted"
	SubmittedEncryptedTxEventCreator      = "new-encrypted-tx-creator"
	SubmittedEncryptedTxEventTargetCondition = "new-encrypted-tx-target-condition"
	SubmittedEncryptedTxEventIndex        = "new-encrypted-tx-index"
	SubmittedEncryptedTxEventData         = "new-encrypted-tx-data"
)

const (
	EncryptedTxExecutedEventType    = "executed-encrypted-tx"
	EncryptedTxExecutedEventCreator = "executed-encrypted-tx-creator"
	EncryptedTxExecutedEventCondition  = "executed-encrypted-tx-target-condition"
	EncryptedTxExecutedEventIndex   = "executed-encrypted-tx-index"
	EncryptedTxExecutedEventData    = "executed-encrypted-tx-data"
)

const (
	EncryptedTxRevertedEventType    = "reverted-encrypted-tx"
	EncryptedTxRevertedEventCreator = "reverted-encrypted-tx-creator"
	EncryptedTxRevertedEventCondition  = "reverted-encrypted-tx-target-condition"
	EncryptedTxRevertedEventIndex   = "reverted-encrypted-tx-index"
	EncryptedTxRevertedEventReason  = "reverted-encrypted-tx-reason"
)

const (
	KeyShareVerificationType    = "keyshare-verification"
	KeyShareVerificationCreator = "keyshare-verification-creator"
	KeyShareVerificationCondition  = "keyshare-verification-Condition"
	KeyShareVerificationReason  = "keyshare-verification-reason"
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}
