package types

const (
	// ModuleName defines the module name
	ModuleName = "pep"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_pep"

	// PortID is the default port id that module binds to
	PortID = "pep"

	// KeyshareVersion defines the current version the IBC module supports
	KeyshareVersion = "keyshare-1"

	// KeushareChannelID is the default channel id that module will use to transmit IBC packets to keyshare module.
	KeyshareChannelID = "channel-1"
)

var (
	ParamsKey = []byte("p_pep")
)

var (
	// PortKey defines the key to store the port ID in store
	PortKey               = KeyPrefix("pep-port-")
	ChannelKey            = KeyPrefix("pep-channel-")
	LatestHeightKey       = KeyPrefix("pep-latest-height-")
	LastExecutedHeightKey = KeyPrefix("pep-last-executed-height-")
	RequestsCountKey      = KeyPrefix("Pep-request-count-")
)

const (
	SubmittedEncryptedTxEventType         = "new-encrypted-tx-submitted"
	SubmittedGeneralEncryptedTxEventType  = "new-general-encrypted-tx-submitted"
	SubmittedEncryptedTxEventIdentity     = "identity"
	SubmittedEncryptedTxEventCreator      = "creator"
	SubmittedEncryptedTxEventTargetHeight = "target-height"
	SubmittedEncryptedTxEventIndex        = "index"
	SubmittedEncryptedTxEventData         = "data"
)

const (
	EncryptedTxExecutedEventType     = "executed-encrypted-tx"
	EncryptedTxExecutedEventCreator  = "creator"
	EncryptedTxExecutedEventHeight   = "target-height"
	EncryptedTxExecutedEventIndex    = "index"
	EncryptedTxExecutedEventIdentity = "identity"

	EncryptedTxExecutedEventData             = "data"
	EncryptedTxExecutedEventMemo             = "memo"
	EncryptedTxExecutedEventUnderlyingEvents = "events"
)

const (
	EncryptedTxRevertedEventType     = "reverted-encrypted-tx"
	EncryptedTxRevertedEventCreator  = "creator"
	EncryptedTxRevertedEventHeight   = "height"
	EncryptedTxRevertedEventIndex    = "index"
	EncryptedTxRevertedEventIdentity = "identity"
	EncryptedTxRevertedEventReason   = "reason"
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

const (
	RequestIdentityEventType     = "new-identity-requested"
	RequestIdentityEventIdentity = "identity"
	RequestIdentityEventPubkey   = "pubkey"
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}
