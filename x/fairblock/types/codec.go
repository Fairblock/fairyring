package types

import (
	"github.com/cosmos/cosmos-sdk/codec"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/msgservice"
)

func RegisterCodec(cdc *codec.LegacyAmino) {
	cdc.RegisterConcrete(&MsgSubmitEncryptedTx{}, "fairblock/SubmitEncryptedTx", nil)
	cdc.RegisterConcrete(&MsgSendCurrentHeight{}, "fairblock/SendCurrentHeight", nil)
	cdc.RegisterConcrete(&MsgRegisterHeight{}, "fairblock/RegisterHeight", nil)
	// this line is used by starport scaffolding # 2
}

func RegisterInterfaces(registry cdctypes.InterfaceRegistry) {
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgSubmitEncryptedTx{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgSendCurrentHeight{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgRegisterHeight{},
	)
	// this line is used by starport scaffolding # 3

	msgservice.RegisterMsgServiceDesc(registry, &_Msg_serviceDesc)
}

var (
	Amino     = codec.NewLegacyAmino()
	ModuleCdc = codec.NewProtoCodec(cdctypes.NewInterfaceRegistry())
)
