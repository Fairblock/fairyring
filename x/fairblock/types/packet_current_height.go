package types

// ValidateBasic is used for validating the packet
func (p CurrentHeightPacketData) ValidateBasic() error {

	// TODO: Validate the packet data

	return nil
}

// GetBytes is a helper for serialising
func (p CurrentHeightPacketData) GetBytes() ([]byte, error) {
	var modulePacket FairblockPacketData

	modulePacket.Packet = &FairblockPacketData_CurrentHeightPacket{&p}

	return modulePacket.Marshal()
}
