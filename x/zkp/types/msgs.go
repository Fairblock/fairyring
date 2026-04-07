package types

import (
	"context"
	"fmt"

	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	proto "github.com/cosmos/gogoproto/proto"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

var (
	_ sdk.Msg = &MsgAddTrustedContract{}
	_ sdk.Msg = &MsgRemoveTrustedContract{}
)

type MsgAddTrustedContract struct {
	Authority       string `protobuf:"bytes,1,opt,name=authority,proto3" json:"authority,omitempty"`
	ContractAddress string `protobuf:"bytes,2,opt,name=contract_address,json=contractAddress,proto3" json:"contract_address,omitempty"`
}

func (m *MsgAddTrustedContract) Reset()         { *m = MsgAddTrustedContract{} }
func (m *MsgAddTrustedContract) String() string { return proto.CompactTextString(m) }
func (m *MsgAddTrustedContract) ProtoMessage()  {}
func (*MsgAddTrustedContract) Descriptor() ([]byte, []int) {
	return fileDescriptor_tx_proto, []int{0}
}

func (m *MsgAddTrustedContract) ValidateBasic() error {
	if _, err := sdk.AccAddressFromBech32(m.Authority); err != nil {
		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid authority address (%s)", err)
	}
	if _, err := sdk.AccAddressFromBech32(m.ContractAddress); err != nil {
		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid contract address (%s)", err)
	}
	return nil
}

func (m *MsgAddTrustedContract) GetSigners() []sdk.AccAddress {
	signer, _ := sdk.AccAddressFromBech32(m.Authority)
	return []sdk.AccAddress{signer}
}

func (m *MsgAddTrustedContract) Marshal() ([]byte, error) {
	size := m.Size()
	buf := make([]byte, size)
	n, err := m.MarshalToSizedBuffer(buf)
	if err != nil {
		return nil, err
	}
	return buf[:n], nil
}

func (m *MsgAddTrustedContract) MarshalTo(data []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(data[:size])
}

func (m *MsgAddTrustedContract) MarshalToSizedBuffer(data []byte) (int, error) {
	i := len(data)
	if len(m.ContractAddress) > 0 {
		i -= len(m.ContractAddress)
		copy(data[i:], m.ContractAddress)
		i = encodeVarint(data, i, uint64(len(m.ContractAddress)))
		i--
		data[i] = 0x12
	}
	if len(m.Authority) > 0 {
		i -= len(m.Authority)
		copy(data[i:], m.Authority)
		i = encodeVarint(data, i, uint64(len(m.Authority)))
		i--
		data[i] = 0x0a
	}
	return len(data) - i, nil
}

func (m *MsgAddTrustedContract) Size() int {
	n := 0
	if len(m.Authority) > 0 {
		n += 1 + len(m.Authority) + sovMsg(uint64(len(m.Authority)))
	}
	if len(m.ContractAddress) > 0 {
		n += 1 + len(m.ContractAddress) + sovMsg(uint64(len(m.ContractAddress)))
	}
	return n
}

func (m *MsgAddTrustedContract) Unmarshal(data []byte) error {
	l := len(data)
	idx := 0
	for idx < l {
		preIdx := idx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if idx >= l {
				return fmt.Errorf("unexpected EOF")
			}
			b := data[idx]
			idx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType != 2 {
			return fmt.Errorf("unexpected wire type %d for field %d", wireType, fieldNum)
		}
		var strLen uint64
		for shift := uint(0); ; shift += 7 {
			if idx >= l {
				return fmt.Errorf("unexpected EOF")
			}
			b := data[idx]
			idx++
			strLen |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		if int(strLen) < 0 || idx+int(strLen) > l {
			return fmt.Errorf("invalid string length")
		}
		switch fieldNum {
		case 1:
			m.Authority = string(data[idx : idx+int(strLen)])
		case 2:
			m.ContractAddress = string(data[idx : idx+int(strLen)])
		default:
			_ = preIdx
		}
		idx += int(strLen)
	}
	return nil
}

type MsgAddTrustedContractResponse struct{}

func (m *MsgAddTrustedContractResponse) Reset()         { *m = MsgAddTrustedContractResponse{} }
func (m *MsgAddTrustedContractResponse) String() string { return proto.CompactTextString(m) }
func (m *MsgAddTrustedContractResponse) ProtoMessage()  {}
func (*MsgAddTrustedContractResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor_tx_proto, []int{1}
}
func (m *MsgAddTrustedContractResponse) Marshal() ([]byte, error) {
	return []byte{}, nil
}
func (m *MsgAddTrustedContractResponse) MarshalTo(data []byte) (int, error) {
	return 0, nil
}
func (m *MsgAddTrustedContractResponse) MarshalToSizedBuffer(data []byte) (int, error) {
	return len(data), nil
}
func (m *MsgAddTrustedContractResponse) Size() int  { return 0 }
func (m *MsgAddTrustedContractResponse) Unmarshal(data []byte) error { return nil }

type MsgRemoveTrustedContract struct {
	Authority       string `protobuf:"bytes,1,opt,name=authority,proto3" json:"authority,omitempty"`
	ContractAddress string `protobuf:"bytes,2,opt,name=contract_address,json=contractAddress,proto3" json:"contract_address,omitempty"`
}

func (m *MsgRemoveTrustedContract) Reset()         { *m = MsgRemoveTrustedContract{} }
func (m *MsgRemoveTrustedContract) String() string { return proto.CompactTextString(m) }
func (m *MsgRemoveTrustedContract) ProtoMessage()  {}
func (*MsgRemoveTrustedContract) Descriptor() ([]byte, []int) {
	return fileDescriptor_tx_proto, []int{2}
}

func (m *MsgRemoveTrustedContract) ValidateBasic() error {
	if _, err := sdk.AccAddressFromBech32(m.Authority); err != nil {
		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid authority address (%s)", err)
	}
	if _, err := sdk.AccAddressFromBech32(m.ContractAddress); err != nil {
		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid contract address (%s)", err)
	}
	return nil
}

func (m *MsgRemoveTrustedContract) GetSigners() []sdk.AccAddress {
	signer, _ := sdk.AccAddressFromBech32(m.Authority)
	return []sdk.AccAddress{signer}
}

func (m *MsgRemoveTrustedContract) Marshal() ([]byte, error) {
	size := m.Size()
	buf := make([]byte, size)
	n, err := m.MarshalToSizedBuffer(buf)
	if err != nil {
		return nil, err
	}
	return buf[:n], nil
}

func (m *MsgRemoveTrustedContract) MarshalTo(data []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(data[:size])
}

func (m *MsgRemoveTrustedContract) MarshalToSizedBuffer(data []byte) (int, error) {
	i := len(data)
	if len(m.ContractAddress) > 0 {
		i -= len(m.ContractAddress)
		copy(data[i:], m.ContractAddress)
		i = encodeVarint(data, i, uint64(len(m.ContractAddress)))
		i--
		data[i] = 0x12
	}
	if len(m.Authority) > 0 {
		i -= len(m.Authority)
		copy(data[i:], m.Authority)
		i = encodeVarint(data, i, uint64(len(m.Authority)))
		i--
		data[i] = 0x0a
	}
	return len(data) - i, nil
}

func (m *MsgRemoveTrustedContract) Size() int {
	n := 0
	if len(m.Authority) > 0 {
		n += 1 + len(m.Authority) + sovMsg(uint64(len(m.Authority)))
	}
	if len(m.ContractAddress) > 0 {
		n += 1 + len(m.ContractAddress) + sovMsg(uint64(len(m.ContractAddress)))
	}
	return n
}

func (m *MsgRemoveTrustedContract) Unmarshal(data []byte) error {
	l := len(data)
	idx := 0
	for idx < l {
		preIdx := idx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if idx >= l {
				return fmt.Errorf("unexpected EOF")
			}
			b := data[idx]
			idx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType != 2 {
			return fmt.Errorf("unexpected wire type %d for field %d", wireType, fieldNum)
		}
		var strLen uint64
		for shift := uint(0); ; shift += 7 {
			if idx >= l {
				return fmt.Errorf("unexpected EOF")
			}
			b := data[idx]
			idx++
			strLen |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		if int(strLen) < 0 || idx+int(strLen) > l {
			return fmt.Errorf("invalid string length")
		}
		switch fieldNum {
		case 1:
			m.Authority = string(data[idx : idx+int(strLen)])
		case 2:
			m.ContractAddress = string(data[idx : idx+int(strLen)])
		default:
			_ = preIdx
		}
		idx += int(strLen)
	}
	return nil
}

type MsgRemoveTrustedContractResponse struct{}

func (m *MsgRemoveTrustedContractResponse) Reset()         { *m = MsgRemoveTrustedContractResponse{} }
func (m *MsgRemoveTrustedContractResponse) String() string { return proto.CompactTextString(m) }
func (m *MsgRemoveTrustedContractResponse) ProtoMessage()  {}
func (*MsgRemoveTrustedContractResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor_tx_proto, []int{3}
}
func (m *MsgRemoveTrustedContractResponse) Marshal() ([]byte, error) {
	return []byte{}, nil
}
func (m *MsgRemoveTrustedContractResponse) MarshalTo(data []byte) (int, error) {
	return 0, nil
}
func (m *MsgRemoveTrustedContractResponse) MarshalToSizedBuffer(data []byte) (int, error) {
	return len(data), nil
}
func (m *MsgRemoveTrustedContractResponse) Size() int  { return 0 }
func (m *MsgRemoveTrustedContractResponse) Unmarshal(data []byte) error { return nil }

func init() {
	proto.RegisterType((*MsgAddTrustedContract)(nil), "fairyring.zkp.MsgAddTrustedContract")
	proto.RegisterType((*MsgAddTrustedContractResponse)(nil), "fairyring.zkp.MsgAddTrustedContractResponse")
	proto.RegisterType((*MsgRemoveTrustedContract)(nil), "fairyring.zkp.MsgRemoveTrustedContract")
	proto.RegisterType((*MsgRemoveTrustedContractResponse)(nil), "fairyring.zkp.MsgRemoveTrustedContractResponse")
	proto.RegisterType((*QueryTrustedContractsRequest)(nil), "fairyring.zkp.QueryTrustedContractsRequest")
	proto.RegisterType((*QueryTrustedContractsResponse)(nil), "fairyring.zkp.QueryTrustedContractsResponse")
	proto.RegisterFile("fairyring/zkp/tx.proto", fileDescriptor_tx_proto)
}

var fileDescriptor_tx_proto = []byte{
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xac, 0x93, 0xc1, 0x4a, 0xf3, 0x40,
	0x14, 0x85, 0x99, 0xbf, 0xfc, 0x42, 0x2f, 0x28, 0x75, 0xa0, 0x1a, 0x82, 0xd5, 0x12, 0x04, 0x4b,
	0x2d, 0x19, 0xac, 0x3b, 0x5d, 0xa9, 0xe0, 0xae, 0x0b, 0x4b, 0x41, 0x70, 0x23, 0x69, 0x32, 0x4e,
	0x43, 0x4d, 0x27, 0x9d, 0x3b, 0x29, 0x4d, 0x57, 0xe2, 0xc2, 0xe7, 0xe9, 0x5b, 0x15, 0xdf, 0x42,
	0xda, 0x68, 0x8a, 0x69, 0x5a, 0xba, 0x70, 0x15, 0xc8, 0x39, 0x9c, 0x73, 0xf9, 0xee, 0x5c, 0x38,
	0x78, 0x71, 0x7c, 0x15, 0x2b, 0x7f, 0x20, 0xd8, 0xa4, 0x1f, 0x32, 0x3d, 0xb6, 0x43, 0x25, 0xb5,
	0xa4, 0xbb, 0xe9, 0x7f, 0x7b, 0xd2, 0x0f, 0xcd, 0x43, 0x57, 0x62, 0x20, 0x91, 0x05, 0x28, 0xd8,
	0xe8, 0x62, 0xfe, 0x49, 0x7c, 0x56, 0x07, 0xca, 0x2d, 0x14, 0x37, 0x9e, 0xd7, 0x51, 0x11, 0x6a,
	0xee, 0xdd, 0xc9, 0x81, 0x56, 0x8e, 0xab, 0xe9, 0x3e, 0x14, 0x9d, 0x48, 0xf7, 0xa4, 0xf2, 0x75,
	0x6c, 0x90, 0x2a, 0xa9, 0x15, 0xa9, 0x01, 0x25, 0xf7, 0x5b, 0x7e, 0x76, 0x3c, 0x4f, 0x71, 0x44,
	0xe3, 0xdf, 0x5c, 0xb9, 0xda, 0x7b, 0x9f, 0x4d, 0xeb, 0x4b, 0xbf, 0x75, 0x02, 0x95, 0xdc, 0xd4,
	0x36, 0xc7, 0x50, 0x0e, 0x90, 0x5b, 0x8f, 0x60, 0xb4, 0x50, 0xb4, 0x79, 0x20, 0x47, 0xfc, 0x4f,
	0x9b, 0x2d, 0xa8, 0xae, 0x0b, 0x4e, 0xcb, 0x8f, 0xe1, 0xe8, 0x21, 0xe2, 0x2a, 0xce, 0xe8, 0xd8,
	0xe6, 0xc3, 0x88, 0xa3, 0xb6, 0xae, 0xa1, 0xb2, 0x46, 0x4f, 0x02, 0xa8, 0x09, 0x34, 0x3b, 0x0e,
	0x47, 0x83, 0x54, 0x0b, 0xb5, 0x62, 0xf3, 0x93, 0x40, 0xa1, 0x85, 0x82, 0xf6, 0x80, 0xe6, 0x50,
	0x3d, 0xb5, 0x7f, 0xed, 0xc5, 0xce, 0xa5, 0x64, 0x36, 0xb6, 0x71, 0xa5, 0xd3, 0x0c, 0xa1, 0x9c,
	0x0f, 0xf2, 0x6c, 0x35, 0x26, 0xd7, 0x68, 0xb2, 0x2d, 0x8d, 0x3f, 0x95, 0xe6, 0xff, 0xb7, 0xd9,
	0xb4, 0x4e, 0x9a, 0x1f, 0x04, 0xca, 0x59, 0x48, 0x0b, 0x72, 0x34, 0x80, 0x52, 0x56, 0xa0, 0xe7,
	0x99, 0x96, 0x4d, 0x3b, 0x58, 0x41, 0xb0, 0x71, 0x21, 0xb7, 0x8d, 0xa7, 0xba, 0xf0, 0x75, 0x2f,
	0xea, 0xda, 0xae, 0x0c, 0xd8, 0xbd, 0xe3, 0xab, 0xee, 0xab, 0x74, 0xfb, 0x6c, 0x79, 0x1c, 0xe3,
	0xe4, 0x3c, 0xe2, 0x90, 0x63, 0x77, 0x67, 0xf1, 0xf4, 0x2f, 0xbf, 0x02, 0x00, 0x00, 0xff, 0xff,
	0x07, 0x4c, 0xba, 0xf2, 0x3c, 0x03, 0x00, 0x00,
}

type MsgServer interface {
	AddTrustedContract(context.Context, *MsgAddTrustedContract) (*MsgAddTrustedContractResponse, error)
	RemoveTrustedContract(context.Context, *MsgRemoveTrustedContract) (*MsgRemoveTrustedContractResponse, error)
}

type UnimplementedMsgServer struct{}

func (*UnimplementedMsgServer) AddTrustedContract(context.Context, *MsgAddTrustedContract) (*MsgAddTrustedContractResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method AddTrustedContract not implemented")
}
func (*UnimplementedMsgServer) RemoveTrustedContract(context.Context, *MsgRemoveTrustedContract) (*MsgRemoveTrustedContractResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RemoveTrustedContract not implemented")
}

func RegisterMsgServer(s grpc.ServiceRegistrar, srv MsgServer) {
	s.RegisterService(&_Msg_serviceDesc, srv)
}

func _Msg_AddTrustedContract_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MsgAddTrustedContract)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MsgServer).AddTrustedContract(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/fairyring.zkp.Msg/AddTrustedContract",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MsgServer).AddTrustedContract(ctx, req.(*MsgAddTrustedContract))
	}
	return interceptor(ctx, in, info, handler)
}

func _Msg_RemoveTrustedContract_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MsgRemoveTrustedContract)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MsgServer).RemoveTrustedContract(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/fairyring.zkp.Msg/RemoveTrustedContract",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MsgServer).RemoveTrustedContract(ctx, req.(*MsgRemoveTrustedContract))
	}
	return interceptor(ctx, in, info, handler)
}

var _Msg_serviceDesc = grpc.ServiceDesc{
	ServiceName: "fairyring.zkp.Msg",
	HandlerType: (*MsgServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "AddTrustedContract",
			Handler:    _Msg_AddTrustedContract_Handler,
		},
		{
			MethodName: "RemoveTrustedContract",
			Handler:    _Msg_RemoveTrustedContract_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "fairyring/zkp/tx.proto",
}

func encodeVarint(data []byte, offset int, v uint64) int {
	offset -= sovMsg(v)
	base := offset
	for v >= 1<<7 {
		data[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	data[offset] = uint8(v)
	return base
}

func sovMsg(x uint64) int {
	n := 0
	for {
		n++
		x >>= 7
		if x == 0 {
			break
		}
	}
	return n
}
