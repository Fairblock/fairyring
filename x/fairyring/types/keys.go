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
	KeyAggregationThresholdPercentage  = 2.0 / 3.0
	KeyAggregationThresholdNumerator   = 2
	KeyAggregationThresholdDenominator = 3
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

func KeyPrefix(p string) []byte {
	return []byte(p)
}
