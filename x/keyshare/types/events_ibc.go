package types

// IBC events
const (
	EventTypeTimeout = "timeout"
	// this line is used by starport scaffolding # ibc/packet/event

	AttributeKeyAckSuccess = "success"
	AttributeKeyAck        = "acknowledgement"
	AttributeKeyAckError   = "error"

	EventTypeRequestAggrKeysharePacket    = "requestAggrKeyshare_packet"
	EventTypeRequestPrivateKeysharePacket = "requestPrivateKeyshare_packet"
	EventTypeGetAggrKeysharePacket        = "getAggrKeyshare_packet"
	EventTypeGetEncryptedKeysharePacket   = "getEncryptedKeyshare_packet"
	EventTypeAggrKeyshareDataPacket       = "aggrKeyshareData_packet"
	EventTypeCurrentKeysPacket            = "currentKeys_packet"

	AttributeKeyAckIdentity = "identity"
	AttributeKeyAckPubkey   = "pubkey"
)
