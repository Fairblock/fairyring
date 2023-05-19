package types

// ValidateBasic is used for validating the packet
func (p CurrentKeysPacketData) ValidateBasic() error {

	// TODO: Validate the packet data

	return nil
}

// GetBytes is a helper for serialising
func (p CurrentKeysPacketData) GetBytes() ([]byte, error) {
	var modulePacket PepPacketData

	modulePacket.Packet = &PepPacketData_CurrentKeysPacket{&p}

	return modulePacket.Marshal()
}