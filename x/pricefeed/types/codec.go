package types

import (
	"github.com/cosmos/cosmos-sdk/codec"
	"github.com/cosmos/cosmos-sdk/codec/types"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types/v1beta1"
)

func RegisterInterfaces(registry types.InterfaceRegistry) {
	registry.RegisterImplementations(
		(*govtypes.Content)(nil),
		&UpdateSymbolRequestProposal{},
	)
}

var (
	// ModuleCdc references the global x/pricefeed module codec. Note, the codec
	// should ONLY be used in certain instances of tests and for JSON encoding.
	//
	// The actual codec used for serialization should be provided to x/pricefeed and
	// defined at the application level.
	ModuleCdc = codec.NewProtoCodec(types.NewInterfaceRegistry())
)
