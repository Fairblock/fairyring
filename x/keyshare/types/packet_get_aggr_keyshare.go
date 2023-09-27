package types

// ValidateBasic is used for validating the packet
func (p GetAggrKeysharePacketData) ValidateBasic() error {

	// TODO: Validate the packet data

	return nil
}

// GetBytes is a helper for serialising
func (p GetAggrKeysharePacketData) GetBytes() ([]byte, error) {
	var modulePacket KeysharePacketData

	modulePacket.Packet = &KeysharePacketData_GetAggrKeysharePacket{&p}

	return modulePacket.Marshal()
}
