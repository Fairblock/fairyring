package types

import (
	"github.com/cosmos/cosmos-sdk/codec"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/msgservice"

	authzcodec "github.com/cosmos/cosmos-sdk/x/authz/codec"
)

func RegisterCodec(cdc *codec.LegacyAmino) {
	cdc.RegisterConcrete(&MsgRegisterValidator{}, "fairyring/RegisterValidator", nil)
	cdc.RegisterConcrete(&MsgSendKeyshare{}, "fairyring/SendKeyshare", nil)
	cdc.RegisterConcrete(&MsgCreateLatestPubKey{}, "fairyring/CreateLatestPubKey", nil)
	cdc.RegisterConcrete(&MsgCreateAuthorizedAddress{}, "keyshare/CreateAuthorizedAddress", nil)
	cdc.RegisterConcrete(&MsgUpdateAuthorizedAddress{}, "keyshare/UpdateAuthorizedAddress", nil)
	cdc.RegisterConcrete(&MsgDeleteAuthorizedAddress{}, "keyshare/DeleteAuthorizedAddress", nil)
	cdc.RegisterConcrete(&MsgCreateGeneralKeyShare{}, "keyshare/CreateGeneralKeyShare", nil)

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
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgCreateAuthorizedAddress{},
		&MsgUpdateAuthorizedAddress{},
		&MsgDeleteAuthorizedAddress{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgCreateGeneralKeyShare{},
	)
	// this line is used by starport scaffolding # 3

	msgservice.RegisterMsgServiceDesc(registry, &_Msg_serviceDesc)
}

var (
	Amino     = codec.NewLegacyAmino()
	ModuleCdc = codec.NewProtoCodec(cdctypes.NewInterfaceRegistry())
)

func init() {
	RegisterCodec(Amino)
	sdk.RegisterLegacyAminoCodec(Amino)
	RegisterCodec(authzcodec.Amino)
}
