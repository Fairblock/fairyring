package types

import sdk "github.com/cosmos/cosmos-sdk/types"

// ValidateBasic is used for validating the packet
func (p CurrentKeysPacketData) ValidateBasic() error {
	return nil
}

// GetBytes is a helper for serialising
func (p CurrentKeysPacketData) GetBytes() ([]byte, error) {
	var modulePacket PepPacketData

	modulePacket.Packet = &PepPacketData_CurrentKeysPacket{&p}

	b, err := MustProtoMarshalJSON(&modulePacket)
	if err != nil {
		return nil, err
	}
	return sdk.MustSortJSON(b), nil
}
