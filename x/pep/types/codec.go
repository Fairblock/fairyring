package types

import (
	"github.com/cosmos/cosmos-sdk/codec"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/msgservice"
	// this line is used by starport scaffolding # 1
)

func RegisterInterfaces(registry cdctypes.InterfaceRegistry) {
	// this line is used by starport scaffolding # 3

	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgUpdateParams{},
	)

	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgSubmitEncryptedTx{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgCreateAggregatedKeyShare{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgRequestGeneralKeyshare{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgGetGeneralKeyshare{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgSubmitGeneralEncryptedTx{},
	)

	msgservice.RegisterMsgServiceDesc(registry, &_Msg_serviceDesc)
}

var (
	// ModuleCdc references the global x/ibc-transfer module codec. Note, the codec
	// should ONLY be used in certain instances of tests and for JSON encoding.
	//
	// The actual codec used for serialization should be provided to x/ibc transfer and
	// defined at the application level.
	ModuleCdc = codec.NewProtoCodec(cdctypes.NewInterfaceRegistry())
)
