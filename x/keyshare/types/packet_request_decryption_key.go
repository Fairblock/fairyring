package types

import (
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// ValidateBasic is used for validating the packet
func (p RequestDecryptionKeyPacketData) ValidateBasic() error {
	switch p.Id.(type) {
	case *RequestDecryptionKeyPacketData_ProposalId:
		_, err := strconv.ParseUint(p.GetProposalId(), 10, 64)
		if err != nil {
			return err
		}
	}

	return nil
}

// GetBytes is a helper for serialising
func (p RequestDecryptionKeyPacketData) GetBytes() []byte {
	var modulePacket KeysharePacketData

	modulePacket.Packet = &KeysharePacketData_RequestDecryptionKeyPacket{&p}

	return sdk.MustSortJSON(MustProtoMarshalJSON(&modulePacket))
}

// ValidateBasic is used for validating the packet
func (p RequestPrivateDecryptionKeyPacketData) ValidateBasic() error {
	return nil
}

// GetBytes is a helper for serialising
func (p RequestPrivateDecryptionKeyPacketData) GetBytes() []byte {
	var modulePacket KeysharePacketData

	modulePacket.Packet = &KeysharePacketData_RequestPrivateDecryptionKeyPacket{&p}

	return sdk.MustSortJSON(MustProtoMarshalJSON(&modulePacket))
}
