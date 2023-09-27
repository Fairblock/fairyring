package types

const (
	// ModuleName defines the module name
	ModuleName = "keyshare"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// RouterKey defines the module's message routing key
	RouterKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_keyshare"

	// Version defines the current version the IBC module supports
	Version = "keyshare-1"

	// PortID is the default port id that module binds to
	PortID = "keyshare"

	// ChannelID is the default channel id that module will use to transmit IBC packets.
	ChannelID = "channel-0"
)

const (
	KeyAggregationThresholdPercentage  = 2.0 / 3.0
	KeyAggregationThresholdNumerator   = 2
	KeyAggregationThresholdDenominator = 3
)

const (
	SlashPower int64 = 100
)

const (
	RegisteredValidatorEventType    = "new validator-registered"
	RegisteredValidatorEventCreator = "creator"
)

const (
	SendKeyshareEventType                = "keyshare-sent"
	SendKeyshareEventValidator           = "validator"
	SendKeyshareEventKeyshareBlockHeight = "keyshare-block-height"
	SendKeyshareEventReceivedBlockHeight = "received-block-height"
	SendKeyshareEventMessage             = "keyshare-message"
	SendKeyshareEventCommitment          = "keyshare-commitment"
	SendKeyshareEventIndex               = "keyshare-index"
)

const (
	KeyShareAggregatedEventType        = "keyshare-aggregated"
	KeyShareAggregatedEventBlockHeight = "keyshare-aggregated-block-height"
	KeyShareAggregatedEventData        = "keyshare-aggregated-data"
	KeyShareAggregatedEventPubKey      = "keyshare-aggregated-pubkey"
)

const (
	QueuedPubKeyCreatedEventType                     = "queued-pubkey-created"
	QueuedPubKeyCreatedEventActivePubkeyExpiryHeight = "queued-pubkey-created-active-pubkey-expiry-height"
	QueuedPubKeyCreatedEventExpiryHeight             = "queued-pubkey-created-expiry-height"
	QueuedPubKeyCreatedEventCreator                  = "queued-pubkey-created-creator"
	QueuedPubKeyCreatedEventPubkey                   = "queued-pubkey-created-pubkey"
)

var (
	// PortKey defines the key to store the port ID in store
	PortKey    = KeyPrefix("pep-port-")
	ChannelKey = KeyPrefix("pep-channel-")
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}
