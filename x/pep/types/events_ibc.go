package types

// IBC events
const (
	EventTypeTimeout           = "timeout"
	EventTypeCurrentKeysPacket = "currentKeys_packet"
	EventTypeRequestKeyshare   = "keyshare_request_packet"
	// this line is used by starport scaffolding # ibc/packet/event

	AttributeKeyAckSuccess = "success"
	AttributeKeyAck        = "acknowledgement"
	AttributeKeyAckError   = "error"
	AttributeKeyRequestID  = "request_id"
	AttributeKeyCreator    = "creator"
)
