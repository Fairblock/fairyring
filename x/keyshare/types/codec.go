package types

import (
	"bytes"

	"github.com/cosmos/cosmos-sdk/codec"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/msgservice"
	"github.com/cosmos/gogoproto/jsonpb"
	proto "github.com/cosmos/gogoproto/proto"

	authzcodec "github.com/cosmos/cosmos-sdk/x/authz/codec"
)

func RegisterCodec(cdc *codec.LegacyAmino) {
	cdc.RegisterConcrete(&MsgRegisterValidator{}, "github.com/Fairblock/fairyring/RegisterValidator", nil)
	cdc.RegisterConcrete(&MsgSendKeyshare{}, "github.com/Fairblock/fairyring/SendKeyshare", nil)
	cdc.RegisterConcrete(&MsgCreateLatestPubKey{}, "github.com/Fairblock/fairyring/CreateLatestPubKey", nil)
	cdc.RegisterConcrete(&MsgCreateAuthorizedAddress{}, "keyshare/CreateAuthorizedAddress", nil)
	cdc.RegisterConcrete(&MsgUpdateAuthorizedAddress{}, "keyshare/UpdateAuthorizedAddress", nil)
	cdc.RegisterConcrete(&MsgDeleteAuthorizedAddress{}, "keyshare/DeleteAuthorizedAddress", nil)
	cdc.RegisterConcrete(&MsgCreateGeneralKeyShare{}, "keyshare/CreateGeneralKeyShare", nil)
	cdc.RegisterConcrete(&MsgDeRegisterValidator{}, "keyshare/DeRegisterValidator", nil)
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
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgDeRegisterValidator{},
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

// mustProtoMarshalJSON provides an auxiliary function to return Proto3 JSON encoded
// bytes of a message.
// NOTE: Copied from https://github.com/cosmos/cosmos-sdk/blob/971c542453e0972ef1dfc5a80159ad5049c7211c/codec/json.go
// and modified in order to allow `EmitDefaults` to be set to false for ics20 packet marshalling.
// This allows for the introduction of the memo field to be backwards compatible.
func MustProtoMarshalJSON(msg proto.Message) []byte {
	anyResolver := cdctypes.NewInterfaceRegistry()

	// EmitDefaults is set to false to prevent marshalling of unpopulated fields (memo)
	// OrigName and the anyResovler match the fields the original SDK function would expect
	// in order to minimize changes.

	// OrigName is true since there is no particular reason to use camel case
	// The any resolver is empty, but provided anyways.
	jm := &jsonpb.Marshaler{OrigName: true, EmitDefaults: false, AnyResolver: anyResolver}

	err := cdctypes.UnpackInterfaces(msg, cdctypes.ProtoJSONPacker{JSONPBMarshaler: jm})
	if err != nil {
		panic(err)
	}

	buf := new(bytes.Buffer)
	if err := jm.Marshal(buf, msg); err != nil {
		panic(err)
	}

	return buf.Bytes()
}
