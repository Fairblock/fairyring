package types

import sdk "github.com/cosmos/cosmos-sdk/types"

// ValidateBasic is used for validating the packet
func (p RequestAggrKeysharePacketData) ValidateBasic() error {

	// TODO: Validate the packet data

	return nil
}

// GetBytes is a helper for serialising
func (p RequestAggrKeysharePacketData) GetBytes() []byte {
	var modulePacket KeysharePacketData

	modulePacket.Packet = &KeysharePacketData_RequestAggrKeysharePacket{&p}

	return sdk.MustSortJSON(mustProtoMarshalJSON(&modulePacket))
}
