package types

import (
	"errors"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// ValidateBasic is used for validating the packet
func (p GetDecryptionKeyPacketData) ValidateBasic() error {

	if p.Identity == "" {
		return errors.New("identity is blank")
	}
	return nil
}

// GetBytes is a helper for serialising
func (p GetDecryptionKeyPacketData) GetBytes() []byte {
	var modulePacket KeysharePacketData

	modulePacket.Packet = &KeysharePacketData_GetDecryptionKeyPacket{&p}

	return sdk.MustSortJSON(MustProtoMarshalJSON(&modulePacket))
}

// ValidateBasic is used for validating the packet
func (p GetPrivateDecryptionKeyPacketData) ValidateBasic() error {

	if p.Identity == "" {
		return errors.New("identity is blank")
	}
	return nil
}

// GetBytes is a helper for serialising
func (p GetPrivateDecryptionKeyPacketData) GetBytes() []byte {
	var modulePacket KeysharePacketData

	modulePacket.Packet = &KeysharePacketData_GetPrivateDecryptionKeyPacket{&p}

	return sdk.MustSortJSON(MustProtoMarshalJSON(&modulePacket))
}
