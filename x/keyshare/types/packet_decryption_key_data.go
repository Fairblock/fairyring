package types

import (
	"errors"
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// ValidateBasic is used for validating the packet
func (p DecryptionKeyDataPacketData) ValidateBasic() error {

	if p.Identity == "" {
		return errors.New("identity is blank")
	}

	if p.ProposalId != "" {
		_, err := strconv.ParseUint(p.ProposalId, 10, 64)
		if err != nil {
			return err
		}
	}

	return nil
}

// GetBytes is a helper for serialising
func (p DecryptionKeyDataPacketData) GetBytes() []byte {
	var modulePacket KeysharePacketData

	modulePacket.Packet = &KeysharePacketData_DecryptionKeyDataPacket{&p}

	return sdk.MustSortJSON(MustProtoMarshalJSON(&modulePacket))
}

// ValidateBasic is used for validating the packet
func (p PrivateDecryptionKeyDataPacketData) ValidateBasic() error {
	if p.Identity == "" {
		return errors.New("identity is blank")
	}
	return nil
}

// GetBytes is a helper for serialising
func (p PrivateDecryptionKeyDataPacketData) GetBytes() []byte {
	var modulePacket KeysharePacketData

	modulePacket.Packet = &KeysharePacketData_PrivateDecryptionKeyDataPacket{&p}

	return sdk.MustSortJSON(MustProtoMarshalJSON(&modulePacket))
}
