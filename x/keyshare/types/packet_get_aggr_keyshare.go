package types

import (
	"errors"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// ValidateBasic is used for validating the packet
func (p GetAggrKeysharePacketData) ValidateBasic() error {

	if p.Identity == "" {
		return errors.New("identity is blank")
	}
	return nil
}

// GetBytes is a helper for serialising
func (p GetAggrKeysharePacketData) GetBytes() []byte {
	var modulePacket KeysharePacketData

	modulePacket.Packet = &KeysharePacketData_GetAggrKeysharePacket{&p}

	return sdk.MustSortJSON(MustProtoMarshalJSON(&modulePacket))
}
