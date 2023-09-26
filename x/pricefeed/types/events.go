package types

// IBC events
const (
	EventTypeRequestPacket  = "oracle_request_packet"
	EventTypeResponsePacket = "oracle_response_packet"
	EventTypePriceUpdate    = "price_update"

	AttributeKeyAckSuccess = "success"
	AttributeKeyAckError   = "error"
	AttributeKeyRequestID  = "request_id"
	AttributeKeySymbol     = "symbol"
	AttributeKeyPrice      = "price"
	AttributeKeyTimestamp  = "timestamp"
)
