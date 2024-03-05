package types

import (
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// ValidateBasic is used for validating the packet
func (p RequestAggrKeysharePacketData) ValidateBasic() error {
	switch p.Id.(type) {
	case *RequestAggrKeysharePacketData_ProposalId:
		_, err := strconv.ParseUint(p.GetProposalId(), 10, 64)
		if err != nil {
			return err
		}
	}

	return nil
}

// GetBytes is a helper for serialising
func (p RequestAggrKeysharePacketData) GetBytes() []byte {
	var modulePacket KeysharePacketData

	modulePacket.Packet = &KeysharePacketData_RequestAggrKeysharePacket{&p}

	return sdk.MustSortJSON(MustProtoMarshalJSON(&modulePacket))
}
