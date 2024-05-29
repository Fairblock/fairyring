package types

import (
	"bytes"

	"github.com/cosmos/cosmos-sdk/codec"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/msgservice"
	"github.com/cosmos/gogoproto/jsonpb"
	proto "github.com/cosmos/gogoproto/proto"
)

func RegisterCodec(cdc *codec.LegacyAmino) {
	cdc.RegisterConcrete(&MsgSubmitEncryptedTx{}, "pep/SubmitEncryptedTx", nil)
	cdc.RegisterConcrete(&MsgCreateAggregatedKeyShare{}, "pep/CreateAggregatedKeyShare", nil)
	cdc.RegisterConcrete(&MsgRequestGeneralKeyshare{}, "pep/RequestGeneralKeyshare", nil)
	cdc.RegisterConcrete(&MsgGetGeneralKeyshare{}, "pep/GetGeneralKeyshare", nil)
	cdc.RegisterConcrete(&MsgSubmitGeneralEncryptedTx{}, "pep/SubmitGeneralEncryptedTx", nil)
	// this line is used by starport scaffolding # 2
}

func RegisterInterfaces(registry cdctypes.InterfaceRegistry) {
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
}

// mustProtoMarshalJSON provides an auxiliary function to return Proto3 JSON encoded
// bytes of a message.
// NOTE: Copied from https://github.com/cosmos/cosmos-sdk/blob/971c542453e0972ef1dfc5a80159ad5049c7211c/codec/json.go
// and modified in order to allow `EmitDefaults` to be set to false for ics20 packet marshalling.
// This allows for the introduction of the memo field to be backwards compatible.
func MustProtoMarshalJSON(msg proto.Message) ([]byte, error) {
	anyResolver := cdctypes.NewInterfaceRegistry()

	// EmitDefaults is set to false to prevent marshalling of unpopulated fields (memo)
	// OrigName and the anyResovler match the fields the original SDK function would expect
	// in order to minimize changes.

	// OrigName is true since there is no particular reason to use camel case
	// The any resolver is empty, but provided anyways.
	jm := &jsonpb.Marshaler{OrigName: true, EmitDefaults: false, AnyResolver: anyResolver}

	err := cdctypes.UnpackInterfaces(msg, cdctypes.ProtoJSONPacker{JSONPBMarshaler: jm})
	if err != nil {
		return nil, err
	}

	buf := new(bytes.Buffer)
	if err := jm.Marshal(buf, msg); err != nil {
		return nil, err
	}

	return buf.Bytes(), err
}
