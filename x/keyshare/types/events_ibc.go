package types

// IBC events
const (
	EventTypeTimeout = "timeout"
	// this line is used by starport scaffolding # ibc/packet/event

	AttributeKeyAckSuccess = "success"
	AttributeKeyAck        = "acknowledgement"
	AttributeKeyAckError   = "error"

	EventTypeRequestDecryptionKeyPacket        = "requestDecryptionKey_packet"
	EventTypeRequestPrivateDecryptionKeyPacket = "requestPrivateDecryptionKey_packet"
	EventTypeGetDecryptionKeyPacket            = "getDecryptionKey_packet"
	EventTypeGetPrivateDecryptionKeyPacket     = "getPrivateDecryptionKey_packet"
	EventTypeDecryptionKeyDataPacket           = "DecryptionKeyData_packet"
	EventTypePrivateDecryptionKeyPacket        = "privateDecryptionKey_packet"
	EventTypeCurrentKeysPacket                 = "currentKeys_packet"

	AttributeKeyAckIdentity = "identity"
	AttributeKeyAckPubkey   = "pubkey"
)
