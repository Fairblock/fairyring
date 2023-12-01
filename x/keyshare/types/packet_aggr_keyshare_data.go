package types

import sdk "github.com/cosmos/cosmos-sdk/types"

// ValidateBasic is used for validating the packet
func (p AggrKeyshareDataPacketData) ValidateBasic() error {

	// TODO: Validate the packet data

	return nil
}

// // GetBytes is a helper for serialising
// func (p AggrKeyshareDataPacketData) GetBytes() ([]byte, error) {
// 	var modulePacket KeysharePacketData

// 	modulePacket.Packet = &KeysharePacketData_AggrKeyshareDataPacket{&p}

// 	return modulePacket.Marshal()
// }

// GetBytes is a helper for serialising
func (p AggrKeyshareDataPacketData) GetBytes() []byte {
	var modulePacket KeysharePacketData

	modulePacket.Packet = &KeysharePacketData_AggrKeyshareDataPacket{&p}

	return sdk.MustSortJSON(mustProtoMarshalJSON(&modulePacket))
}
