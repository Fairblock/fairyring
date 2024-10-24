package types

const (
	// ModuleName defines the module name
	ModuleName = "keyshare"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_keyshare"

	// Version defines the current version the IBC module supports
	Version = "keyshare-1"

	// PortID is the default port id that module binds to
	PortID = "keyshare"
)

var ParamsKey = []byte("p_keyshare")

var (
	// PortKey defines the key to store the port ID in store
	PortKey          = KeyPrefix("keyshare-port-")
	ChannelKey       = KeyPrefix("keyshare-channel-")
	RequestsCountKey = KeyPrefix("keyshare-request-count-")
)

const (
	KeyAggregationThresholdNumerator   = 2
	KeyAggregationThresholdDenominator = 3
)

const (
	SlashPower int64 = 100
)

const (
	RegisteredValidatorEventType    = "new-validator-registered"
	RegisteredValidatorEventCreator = "creator"
)

const (
	DeRegisteredValidatorEventType    = "validator-deregistered"
	DeRegisteredValidatorEventCreator = "creator"
)

const (
	SendKeyshareEventType                = "keyshare-sent"
	SendKeyshareEventValidator           = "validator"
	SendKeyshareEventKeyshareBlockHeight = "keyshare-height"
	SendKeyshareEventReceivedBlockHeight = "received-height"
	SendKeyshareEventMessage             = "message"
	SendKeyshareEventIndex               = "index"
)

const (
	StartSendGeneralKeyshareEventType        = "start-send-general-keyshare"
	StartSendEncryptedKeyshareEventType      = "start-send-encrypted-keyshare"
	StartSendGeneralKeyshareEventIdentity    = "identity"
	StartSendEncryptedKeyshareEventRequester = "requester"
	StartSendEncryptedKeyshareEventPubkey    = "secp256k1-pubkey"
)

const (
	SendGeneralKeyshareEventType                = "keyshare-sent"
	SendEncryptedKeyshareEventType              = "encrypted-keyshare-sent"
	SendGeneralKeyshareEventValidator           = "validator"
	SendGeneralKeyshareEventReceivedBlockHeight = "received-height"
	SendGeneralKeyshareEventMessage             = "message"
	SendGeneralKeyshareEventIDType              = "id-type"
	SendGeneralKeyshareEventIdValue             = "id-value"
	SendGeneralKeyshareEventIndex               = "index"
)

const (
	KeyshareAggregatedEventType        = "keyshare-aggregated"
	KeyshareAggregatedEventBlockHeight = "height"
	KeyshareAggregatedEventData        = "data"
	KeyshareAggregatedEventPubkey      = "pubkey"
)

const (
	GeneralKeyshareAggregatedEventType    = "general-keyshare-aggregated"
	GeneralKeyshareAggregatedEventIDValue = "id-value"
	GeneralKeyshareAggregatedEventIDType  = "id-type"
	GeneralKeyshareAggregatedEventData    = "data"
	GeneralKeyshareAggregatedEventPubkey  = "pubkey"
)

const (
	QueuedPubkeyCreatedEventType                     = "queued-pubkey-created"
	QueuedPubkeyCreatedEventActivePubkeyExpiryHeight = "active-pubkey-expiry-height"
	QueuedPubkeyCreatedEventExpiryHeight             = "expiry-height"
	QueuedPubkeyCreatedEventCreator                  = "creator"
	QueuedPubkeyCreatedEventPubkey                   = "pubkey"
	QueuedPubkeyCreatedEventNumberOfValidators       = "number-of-validators"
	QueuedPubkeyCreatedEventEncryptedShares          = "encrypted-shares"
)

const (
	PubkeyOverrodeEventType                     = "pubkey-overrode"
	PubkeyOverrodeEventActivePubkeyExpiryHeight = "active-pubkey-expiry-height"
	PubkeyOverrodeEventExpiryHeight             = "expiry-height"
	PubkeyOverrodeEventCreator                  = "creator"
	PubkeyOverrodeEventPubkey                   = "pubkey"
	PubkeyOverrodeEventNumberOfValidators       = "number-of-validators"
	PubkeyOverrodeEventEncryptedShares          = "encrypted-shares"
)

const (
	KeyTotalIdleValSlashed           = "total_idle_validator_slashed"
	KeyTotalValidKeyshareSubmitted   = "total_valid_keyshare"
	KeyTotalInvalidKeyshareSubmitted = "total_invalid_keyshare"
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}

const AvgBlockTime = 5.6
