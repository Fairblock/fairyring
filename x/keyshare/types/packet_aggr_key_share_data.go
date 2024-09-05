package types

import (
	"errors"
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// ValidateBasic is used for validating the packet
func (p AggrKeyshareDataPacketData) ValidateBasic() error {

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
func (p AggrKeyshareDataPacketData) GetBytes() []byte {
	var modulePacket KeysharePacketData

	modulePacket.Packet = &KeysharePacketData_AggrKeyshareDataPacket{&p}

	return sdk.MustSortJSON(MustProtoMarshalJSON(&modulePacket))
}

// ValidateBasic is used for validating the packet
func (p EncryptedKeysharesPacketData) ValidateBasic() error {
	if p.Identity == "" {
		return errors.New("identity is blank")
	}
	return nil
}

// GetBytes is a helper for serialising
func (p EncryptedKeysharesPacketData) GetBytes() []byte {
	var modulePacket KeysharePacketData

	modulePacket.Packet = &KeysharePacketData_EncryptedKeysharesPacketData{&p}

	return sdk.MustSortJSON(MustProtoMarshalJSON(&modulePacket))
}
