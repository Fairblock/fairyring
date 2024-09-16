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

var (
	ParamsKey = []byte("p_keyshare")
)

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
	StartSendGeneralKeyShareEventType        = "start-send-general-keyshare"
	StartSendEncryptedKeyShareEventType      = "start-send-encrypted-keyshare"
	StartSendGeneralKeyShareEventIdentity    = "identity"
	StartSendEncryptedKeyShareEventRequester = "requester"
	StartSendEncryptedKeyShareEventPubkey    = "secp256k1-pubkey"
)

const (
	SendGeneralKeyshareEventType                = "keyshare-sent"
	SendGeneralKeyshareEventValidator           = "validator"
	SendGeneralKeyshareEventReceivedBlockHeight = "received-height"
	SendGeneralKeyshareEventMessage             = "message"
	SendGeneralKeyshareEventIDType              = "id-type"
	SendGeneralKeyshareEventIdValue             = "id-value"
	SendGeneralKeyshareEventIndex               = "index"
)

const (
	KeyShareAggregatedEventType        = "keyshare-aggregated"
	KeyShareAggregatedEventBlockHeight = "height"
	KeyShareAggregatedEventData        = "data"
	KeyShareAggregatedEventPubKey      = "pubkey"
)

const (
	GeneralKeyShareAggregatedEventType    = "general-keyshare-aggregated"
	GeneralKeyShareAggregatedEventIDValue = "id-value"
	GeneralKeyShareAggregatedEventIDType  = "id-type"
	GeneralKeyShareAggregatedEventData    = "data"
	GeneralKeyShareAggregatedEventPubKey  = "pubkey"
)

const (
	QueuedPubKeyCreatedEventType                     = "queued-pubkey-created"
	QueuedPubKeyCreatedEventActivePubkeyExpiryHeight = "active-pubkey-expiry-height"
	QueuedPubKeyCreatedEventExpiryHeight             = "expiry-height"
	QueuedPubKeyCreatedEventCreator                  = "creator"
	QueuedPubKeyCreatedEventPubkey                   = "pubkey"
	QueuedPubKeyCreatedEventNumberOfValidators       = "number-of-validators"
	QueuedPubKeyCreatedEventEncryptedShares          = "encrypted-shares"
)

const (
	PubKeyOverrodeEventType                     = "pubkey-overrode"
	PubKeyOverrodeEventActivePubkeyExpiryHeight = "active-pubkey-expiry-height"
	PubKeyOverrodeEventExpiryHeight             = "expiry-height"
	PubKeyOverrodeEventCreator                  = "creator"
	PubKeyOverrodeEventPubkey                   = "pubkey"
	PubKeyOverrodeEventNumberOfValidators       = "number-of-validators"
	PubKeyOverrodeEventEncryptedShares          = "encrypted-shares"
)

const (
	KeyTotalIdleValSlashed           = "total_idle_validator_slashed"
	KeyTotalValidKeyShareSubmitted   = "total_valid_key_share"
	KeyTotalInvalidKeyShareSubmitted = "total_invalid_key_share"
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}

const AvgBlockTime = 5.6
