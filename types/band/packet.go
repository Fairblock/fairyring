package band

import (
	"github.com/cosmos/cosmos-sdk/codec"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// NewOracleRequestPacketData contructs a new OracleRequestPacketData instance
func NewOracleRequestPacketData(
	clientID string,
	oracleScriptID uint64,
	calldata []byte,
	askCount uint64,
	minCount uint64,
	feeLimit sdk.Coins,
	prepareGas uint64,
	executeGas uint64,
) OracleRequestPacketData {
	return OracleRequestPacketData{
		ClientID:       clientID,
		OracleScriptID: oracleScriptID,
		Calldata:       calldata,
		AskCount:       askCount,
		MinCount:       minCount,
		FeeLimit:       feeLimit,
		PrepareGas:     prepareGas,
		ExecuteGas:     executeGas,
	}
}

// GetBytes is a helper for serialising
func (p OracleRequestPacketData) GetBytes() []byte {
	cdc := codec.NewProtoCodec(codectypes.NewInterfaceRegistry())
	return sdk.MustSortJSON(cdc.MustMarshalJSON(&p))
}

func NewOracleRequestPacketAcknowledgement(requestID uint64) *OracleRequestPacketAcknowledgement {
	return &OracleRequestPacketAcknowledgement{
		RequestID: requestID,
	}
}

// GetBytes is a helper for serialising
func (p OracleRequestPacketAcknowledgement) GetBytes() []byte {
	cdc := codec.NewProtoCodec(codectypes.NewInterfaceRegistry())
	return sdk.MustSortJSON(cdc.MustMarshalJSON(&p))
}

// NewOracleResponsePacketData contructs a new OracleResponsePacketData instance
func NewOracleResponsePacketData(
	clientID string, requestID uint64, ansCount uint64, requestTime int64,
	resolveTime int64, resolveStatus ResolveStatus, result []byte,
) OracleResponsePacketData {
	return OracleResponsePacketData{
		ClientID:      clientID,
		RequestID:     requestID,
		AnsCount:      ansCount,
		RequestTime:   requestTime,
		ResolveTime:   resolveTime,
		ResolveStatus: resolveStatus,
		Result:        result,
	}
}

// GetBytes returns the bytes representation of this oracle response packet data.
func (p OracleResponsePacketData) GetBytes() []byte {
	cdc := codec.NewProtoCodec(codectypes.NewInterfaceRegistry())
	return sdk.MustSortJSON(cdc.MustMarshalJSON(&p))
}
