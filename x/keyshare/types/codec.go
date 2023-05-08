package types

import (
	"github.com/cosmos/cosmos-sdk/codec"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/msgservice"
)

func RegisterCodec(cdc *codec.LegacyAmino) {
	cdc.RegisterConcrete(&MsgRegisterValidator{}, "fairyring/RegisterValidator", nil)
	cdc.RegisterConcrete(&MsgSendKeyshare{}, "fairyring/SendKeyshare", nil)
	cdc.RegisterConcrete(&MsgCreateLatestPubKey{}, "fairyring/CreateLatestPubKey", nil)
	// this line is used by starport scaffolding # 2
}

func RegisterInterfaces(registry cdctypes.InterfaceRegistry) {
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgRegisterValidator{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgSendKeyshare{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgCreateLatestPubKey{},
	)
	// this line is used by starport scaffolding # 3

	msgservice.RegisterMsgServiceDesc(registry, &_Msg_serviceDesc)
}

var (
	Amino     = codec.NewLegacyAmino()
	ModuleCdc = codec.NewProtoCodec(cdctypes.NewInterfaceRegistry())
)
