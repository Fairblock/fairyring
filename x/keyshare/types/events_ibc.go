package types

// IBC events
const (
	EventTypeTimeout                   = "timeout"
	EventTypeRequestAggrKeysharePacket = "requestAggrKeyshare_packet"
	EventTypeGetAggrKeysharePacket     = "getAggrKeyshare_packet"
	EventTypeAggrKeyshareDataPacket    = "aggrKeyshareData_packet"
	// this line is used by starport scaffolding # ibc/packet/event

	AttributeKeyAckSuccess = "success"
	AttributeKeyAck        = "acknowledgement"
	AttributeKeyAckError   = "error"

	AttributeKeyAckIdentity = "identity"
	AttributeKeyAckPubkey   = "pubkey"
)
