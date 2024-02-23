// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: fairyring/keyshare/requested_keyshare.proto

package types

import (
	fmt "fmt"
	proto "github.com/cosmos/gogoproto/proto"
	io "io"
	math "math"
	math_bits "math/bits"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.GoGoProtoPackageIsVersion3 // please upgrade the proto package

type KeyShareRequest struct {
	Identity     string               `protobuf:"bytes,1,opt,name=identity,proto3" json:"identity,omitempty"`
	Pubkey       string               `protobuf:"bytes,2,opt,name=pubkey,proto3" json:"pubkey,omitempty"`
	IbcInfo      *IBCInfo             `protobuf:"bytes,3,opt,name=ibc_info,json=ibcInfo,proto3" json:"ibc_info,omitempty"`
	Counterparty *CounterPartyIBCInfo `protobuf:"bytes,4,opt,name=counterparty,proto3" json:"counterparty,omitempty"`
	AggrKeyshare string               `protobuf:"bytes,5,opt,name=aggr_keyshare,json=aggrKeyshare,proto3" json:"aggr_keyshare,omitempty"`
	ProposalId   string               `protobuf:"bytes,6,opt,name=proposal_id,json=proposalId,proto3" json:"proposal_id,omitempty"`
	Sent         bool                 `protobuf:"varint,7,opt,name=sent,proto3" json:"sent,omitempty"`
}

func (m *KeyShareRequest) Reset()         { *m = KeyShareRequest{} }
func (m *KeyShareRequest) String() string { return proto.CompactTextString(m) }
func (*KeyShareRequest) ProtoMessage()    {}
func (*KeyShareRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_e8ed024b19ae59bd, []int{0}
}
func (m *KeyShareRequest) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *KeyShareRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_KeyShareRequest.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *KeyShareRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_KeyShareRequest.Merge(m, src)
}
func (m *KeyShareRequest) XXX_Size() int {
	return m.Size()
}
func (m *KeyShareRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_KeyShareRequest.DiscardUnknown(m)
}

var xxx_messageInfo_KeyShareRequest proto.InternalMessageInfo

func (m *KeyShareRequest) GetIdentity() string {
	if m != nil {
		return m.Identity
	}
	return ""
}

func (m *KeyShareRequest) GetPubkey() string {
	if m != nil {
		return m.Pubkey
	}
	return ""
}

func (m *KeyShareRequest) GetIbcInfo() *IBCInfo {
	if m != nil {
		return m.IbcInfo
	}
	return nil
}

func (m *KeyShareRequest) GetCounterparty() *CounterPartyIBCInfo {
	if m != nil {
		return m.Counterparty
	}
	return nil
}

func (m *KeyShareRequest) GetAggrKeyshare() string {
	if m != nil {
		return m.AggrKeyshare
	}
	return ""
}

func (m *KeyShareRequest) GetProposalId() string {
	if m != nil {
		return m.ProposalId
	}
	return ""
}

func (m *KeyShareRequest) GetSent() bool {
	if m != nil {
		return m.Sent
	}
	return false
}

type IBCInfo struct {
	ClientID     string `protobuf:"bytes,1,opt,name=ClientID,proto3" json:"ClientID,omitempty"`
	ConnectionID string `protobuf:"bytes,2,opt,name=ConnectionID,proto3" json:"ConnectionID,omitempty"`
	ChannelID    string `protobuf:"bytes,3,opt,name=ChannelID,proto3" json:"ChannelID,omitempty"`
	PortID       string `protobuf:"bytes,4,opt,name=PortID,proto3" json:"PortID,omitempty"`
}

func (m *IBCInfo) Reset()         { *m = IBCInfo{} }
func (m *IBCInfo) String() string { return proto.CompactTextString(m) }
func (*IBCInfo) ProtoMessage()    {}
func (*IBCInfo) Descriptor() ([]byte, []int) {
	return fileDescriptor_e8ed024b19ae59bd, []int{1}
}
func (m *IBCInfo) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *IBCInfo) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_IBCInfo.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *IBCInfo) XXX_Merge(src proto.Message) {
	xxx_messageInfo_IBCInfo.Merge(m, src)
}
func (m *IBCInfo) XXX_Size() int {
	return m.Size()
}
func (m *IBCInfo) XXX_DiscardUnknown() {
	xxx_messageInfo_IBCInfo.DiscardUnknown(m)
}

var xxx_messageInfo_IBCInfo proto.InternalMessageInfo

func (m *IBCInfo) GetClientID() string {
	if m != nil {
		return m.ClientID
	}
	return ""
}

func (m *IBCInfo) GetConnectionID() string {
	if m != nil {
		return m.ConnectionID
	}
	return ""
}

func (m *IBCInfo) GetChannelID() string {
	if m != nil {
		return m.ChannelID
	}
	return ""
}

func (m *IBCInfo) GetPortID() string {
	if m != nil {
		return m.PortID
	}
	return ""
}

type CounterPartyIBCInfo struct {
	ClientID     string `protobuf:"bytes,1,opt,name=ClientID,proto3" json:"ClientID,omitempty"`
	ConnectionID string `protobuf:"bytes,2,opt,name=ConnectionID,proto3" json:"ConnectionID,omitempty"`
	ChannelID    string `protobuf:"bytes,3,opt,name=ChannelID,proto3" json:"ChannelID,omitempty"`
	PortID       string `protobuf:"bytes,4,opt,name=PortID,proto3" json:"PortID,omitempty"`
}

func (m *CounterPartyIBCInfo) Reset()         { *m = CounterPartyIBCInfo{} }
func (m *CounterPartyIBCInfo) String() string { return proto.CompactTextString(m) }
func (*CounterPartyIBCInfo) ProtoMessage()    {}
func (*CounterPartyIBCInfo) Descriptor() ([]byte, []int) {
	return fileDescriptor_e8ed024b19ae59bd, []int{2}
}
func (m *CounterPartyIBCInfo) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *CounterPartyIBCInfo) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_CounterPartyIBCInfo.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *CounterPartyIBCInfo) XXX_Merge(src proto.Message) {
	xxx_messageInfo_CounterPartyIBCInfo.Merge(m, src)
}
func (m *CounterPartyIBCInfo) XXX_Size() int {
	return m.Size()
}
func (m *CounterPartyIBCInfo) XXX_DiscardUnknown() {
	xxx_messageInfo_CounterPartyIBCInfo.DiscardUnknown(m)
}

var xxx_messageInfo_CounterPartyIBCInfo proto.InternalMessageInfo

func (m *CounterPartyIBCInfo) GetClientID() string {
	if m != nil {
		return m.ClientID
	}
	return ""
}

func (m *CounterPartyIBCInfo) GetConnectionID() string {
	if m != nil {
		return m.ConnectionID
	}
	return ""
}

func (m *CounterPartyIBCInfo) GetChannelID() string {
	if m != nil {
		return m.ChannelID
	}
	return ""
}

func (m *CounterPartyIBCInfo) GetPortID() string {
	if m != nil {
		return m.PortID
	}
	return ""
}

func init() {
	proto.RegisterType((*KeyShareRequest)(nil), "fairyring.keyshare.KeyShareRequest")
	proto.RegisterType((*IBCInfo)(nil), "fairyring.keyshare.IBCInfo")
	proto.RegisterType((*CounterPartyIBCInfo)(nil), "fairyring.keyshare.CounterPartyIBCInfo")
}

func init() {
	proto.RegisterFile("fairyring/keyshare/requested_keyshare.proto", fileDescriptor_e8ed024b19ae59bd)
}

var fileDescriptor_e8ed024b19ae59bd = []byte{
	// 386 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xc4, 0x52, 0xcb, 0x4a, 0xc3, 0x40,
	0x14, 0xed, 0xd4, 0xda, 0xc7, 0xb4, 0x22, 0x8c, 0x20, 0x41, 0x25, 0x96, 0xb8, 0xb0, 0x20, 0x24,
	0xa0, 0xe0, 0x07, 0x34, 0x45, 0x08, 0xdd, 0x94, 0xb8, 0x73, 0x53, 0xf2, 0xb8, 0x4d, 0x87, 0xc6,
	0x99, 0x38, 0x99, 0x80, 0x59, 0xf9, 0x01, 0x6e, 0xfc, 0x08, 0x3f, 0xc6, 0x65, 0x97, 0x2e, 0xa5,
	0xfd, 0x11, 0xc9, 0xab, 0xa5, 0xd8, 0xbd, 0xbb, 0x39, 0xe7, 0x9e, 0x73, 0xef, 0x9d, 0xc3, 0xc5,
	0x37, 0x33, 0x87, 0x8a, 0x54, 0x50, 0x16, 0x18, 0x0b, 0x48, 0xe3, 0xb9, 0x23, 0xc0, 0x10, 0xf0,
	0x92, 0x40, 0x2c, 0xc1, 0x9f, 0x56, 0x94, 0x1e, 0x09, 0x2e, 0x39, 0x21, 0x1b, 0xb1, 0x5e, 0x55,
	0xb4, 0xcf, 0x3a, 0x3e, 0x1e, 0x43, 0xfa, 0x98, 0x01, 0xbb, 0x30, 0x92, 0x33, 0xdc, 0xa6, 0x3e,
	0x30, 0x49, 0x65, 0xaa, 0xa0, 0x3e, 0x1a, 0x74, 0xec, 0x0d, 0x26, 0xa7, 0xb8, 0x19, 0x25, 0xee,
	0x02, 0x52, 0xa5, 0x9e, 0x57, 0x4a, 0x44, 0xee, 0x71, 0x9b, 0xba, 0xde, 0x94, 0xb2, 0x19, 0x57,
	0x0e, 0xfa, 0x68, 0xd0, 0xbd, 0x3d, 0xd7, 0xff, 0x8e, 0xd3, 0xad, 0xa1, 0x69, 0xb1, 0x19, 0xb7,
	0x5b, 0xd4, 0xf5, 0xb2, 0x07, 0x19, 0xe3, 0x9e, 0xc7, 0x13, 0x26, 0x41, 0x44, 0x8e, 0x90, 0xa9,
	0xd2, 0xc8, 0xbd, 0xd7, 0xfb, 0xbc, 0x66, 0xa1, 0x9b, 0x64, 0xba, 0xaa, 0xcf, 0x8e, 0x99, 0x5c,
	0xe1, 0x23, 0x27, 0x08, 0xc4, 0xe6, 0xdf, 0xca, 0x61, 0xbe, 0x63, 0x2f, 0x23, 0xc7, 0x25, 0x47,
	0x2e, 0x71, 0x37, 0x12, 0x3c, 0xe2, 0xb1, 0x13, 0x4e, 0xa9, 0xaf, 0x34, 0x73, 0x09, 0xae, 0x28,
	0xcb, 0x27, 0x04, 0x37, 0x62, 0x60, 0x52, 0x69, 0xf5, 0xd1, 0xa0, 0x6d, 0xe7, 0x6f, 0xed, 0x0d,
	0xb7, 0xca, 0x91, 0x59, 0x3a, 0x66, 0x48, 0x81, 0x49, 0x6b, 0x54, 0xa5, 0x53, 0x61, 0xa2, 0xe1,
	0x9e, 0xc9, 0x19, 0x03, 0x4f, 0x52, 0xce, 0xac, 0x51, 0x99, 0xd1, 0x0e, 0x47, 0x2e, 0x70, 0xc7,
	0x9c, 0x3b, 0x8c, 0x41, 0x68, 0x8d, 0xf2, 0xa8, 0x3a, 0xf6, 0x96, 0xc8, 0xf2, 0x9d, 0x70, 0x91,
	0xf5, 0x6e, 0x14, 0xf9, 0x16, 0x48, 0x7b, 0x47, 0xf8, 0x64, 0x4f, 0x00, 0xff, 0xb3, 0xcd, 0xd0,
	0xfa, 0x5a, 0xa9, 0x68, 0xb9, 0x52, 0xd1, 0xcf, 0x4a, 0x45, 0x1f, 0x6b, 0xb5, 0xb6, 0x5c, 0xab,
	0xb5, 0xef, 0xb5, 0x5a, 0x7b, 0x32, 0x02, 0x2a, 0xe7, 0x89, 0xab, 0x7b, 0xfc, 0xd9, 0x78, 0x70,
	0xa8, 0x70, 0x43, 0xee, 0x2d, 0x8c, 0xed, 0x95, 0xbe, 0x6e, 0xef, 0x54, 0xa6, 0x11, 0xc4, 0x6e,
	0x33, 0xbf, 0xcd, 0xbb, 0xdf, 0x00, 0x00, 0x00, 0xff, 0xff, 0x2d, 0x54, 0x7a, 0x80, 0xca, 0x02,
	0x00, 0x00,
}

func (m *KeyShareRequest) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *KeyShareRequest) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *KeyShareRequest) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if m.Sent {
		i--
		if m.Sent {
			dAtA[i] = 1
		} else {
			dAtA[i] = 0
		}
		i--
		dAtA[i] = 0x38
	}
	if len(m.ProposalId) > 0 {
		i -= len(m.ProposalId)
		copy(dAtA[i:], m.ProposalId)
		i = encodeVarintRequestedKeyshare(dAtA, i, uint64(len(m.ProposalId)))
		i--
		dAtA[i] = 0x32
	}
	if len(m.AggrKeyshare) > 0 {
		i -= len(m.AggrKeyshare)
		copy(dAtA[i:], m.AggrKeyshare)
		i = encodeVarintRequestedKeyshare(dAtA, i, uint64(len(m.AggrKeyshare)))
		i--
		dAtA[i] = 0x2a
	}
	if m.Counterparty != nil {
		{
			size, err := m.Counterparty.MarshalToSizedBuffer(dAtA[:i])
			if err != nil {
				return 0, err
			}
			i -= size
			i = encodeVarintRequestedKeyshare(dAtA, i, uint64(size))
		}
		i--
		dAtA[i] = 0x22
	}
	if m.IbcInfo != nil {
		{
			size, err := m.IbcInfo.MarshalToSizedBuffer(dAtA[:i])
			if err != nil {
				return 0, err
			}
			i -= size
			i = encodeVarintRequestedKeyshare(dAtA, i, uint64(size))
		}
		i--
		dAtA[i] = 0x1a
	}
	if len(m.Pubkey) > 0 {
		i -= len(m.Pubkey)
		copy(dAtA[i:], m.Pubkey)
		i = encodeVarintRequestedKeyshare(dAtA, i, uint64(len(m.Pubkey)))
		i--
		dAtA[i] = 0x12
	}
	if len(m.Identity) > 0 {
		i -= len(m.Identity)
		copy(dAtA[i:], m.Identity)
		i = encodeVarintRequestedKeyshare(dAtA, i, uint64(len(m.Identity)))
		i--
		dAtA[i] = 0xa
	}
	return len(dAtA) - i, nil
}

func (m *IBCInfo) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *IBCInfo) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *IBCInfo) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if len(m.PortID) > 0 {
		i -= len(m.PortID)
		copy(dAtA[i:], m.PortID)
		i = encodeVarintRequestedKeyshare(dAtA, i, uint64(len(m.PortID)))
		i--
		dAtA[i] = 0x22
	}
	if len(m.ChannelID) > 0 {
		i -= len(m.ChannelID)
		copy(dAtA[i:], m.ChannelID)
		i = encodeVarintRequestedKeyshare(dAtA, i, uint64(len(m.ChannelID)))
		i--
		dAtA[i] = 0x1a
	}
	if len(m.ConnectionID) > 0 {
		i -= len(m.ConnectionID)
		copy(dAtA[i:], m.ConnectionID)
		i = encodeVarintRequestedKeyshare(dAtA, i, uint64(len(m.ConnectionID)))
		i--
		dAtA[i] = 0x12
	}
	if len(m.ClientID) > 0 {
		i -= len(m.ClientID)
		copy(dAtA[i:], m.ClientID)
		i = encodeVarintRequestedKeyshare(dAtA, i, uint64(len(m.ClientID)))
		i--
		dAtA[i] = 0xa
	}
	return len(dAtA) - i, nil
}

func (m *CounterPartyIBCInfo) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *CounterPartyIBCInfo) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *CounterPartyIBCInfo) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if len(m.PortID) > 0 {
		i -= len(m.PortID)
		copy(dAtA[i:], m.PortID)
		i = encodeVarintRequestedKeyshare(dAtA, i, uint64(len(m.PortID)))
		i--
		dAtA[i] = 0x22
	}
	if len(m.ChannelID) > 0 {
		i -= len(m.ChannelID)
		copy(dAtA[i:], m.ChannelID)
		i = encodeVarintRequestedKeyshare(dAtA, i, uint64(len(m.ChannelID)))
		i--
		dAtA[i] = 0x1a
	}
	if len(m.ConnectionID) > 0 {
		i -= len(m.ConnectionID)
		copy(dAtA[i:], m.ConnectionID)
		i = encodeVarintRequestedKeyshare(dAtA, i, uint64(len(m.ConnectionID)))
		i--
		dAtA[i] = 0x12
	}
	if len(m.ClientID) > 0 {
		i -= len(m.ClientID)
		copy(dAtA[i:], m.ClientID)
		i = encodeVarintRequestedKeyshare(dAtA, i, uint64(len(m.ClientID)))
		i--
		dAtA[i] = 0xa
	}
	return len(dAtA) - i, nil
}

func encodeVarintRequestedKeyshare(dAtA []byte, offset int, v uint64) int {
	offset -= sovRequestedKeyshare(v)
	base := offset
	for v >= 1<<7 {
		dAtA[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	dAtA[offset] = uint8(v)
	return base
}
func (m *KeyShareRequest) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = len(m.Identity)
	if l > 0 {
		n += 1 + l + sovRequestedKeyshare(uint64(l))
	}
	l = len(m.Pubkey)
	if l > 0 {
		n += 1 + l + sovRequestedKeyshare(uint64(l))
	}
	if m.IbcInfo != nil {
		l = m.IbcInfo.Size()
		n += 1 + l + sovRequestedKeyshare(uint64(l))
	}
	if m.Counterparty != nil {
		l = m.Counterparty.Size()
		n += 1 + l + sovRequestedKeyshare(uint64(l))
	}
	l = len(m.AggrKeyshare)
	if l > 0 {
		n += 1 + l + sovRequestedKeyshare(uint64(l))
	}
	l = len(m.ProposalId)
	if l > 0 {
		n += 1 + l + sovRequestedKeyshare(uint64(l))
	}
	if m.Sent {
		n += 2
	}
	return n
}

func (m *IBCInfo) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = len(m.ClientID)
	if l > 0 {
		n += 1 + l + sovRequestedKeyshare(uint64(l))
	}
	l = len(m.ConnectionID)
	if l > 0 {
		n += 1 + l + sovRequestedKeyshare(uint64(l))
	}
	l = len(m.ChannelID)
	if l > 0 {
		n += 1 + l + sovRequestedKeyshare(uint64(l))
	}
	l = len(m.PortID)
	if l > 0 {
		n += 1 + l + sovRequestedKeyshare(uint64(l))
	}
	return n
}

func (m *CounterPartyIBCInfo) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = len(m.ClientID)
	if l > 0 {
		n += 1 + l + sovRequestedKeyshare(uint64(l))
	}
	l = len(m.ConnectionID)
	if l > 0 {
		n += 1 + l + sovRequestedKeyshare(uint64(l))
	}
	l = len(m.ChannelID)
	if l > 0 {
		n += 1 + l + sovRequestedKeyshare(uint64(l))
	}
	l = len(m.PortID)
	if l > 0 {
		n += 1 + l + sovRequestedKeyshare(uint64(l))
	}
	return n
}

func sovRequestedKeyshare(x uint64) (n int) {
	return (math_bits.Len64(x|1) + 6) / 7
}
func sozRequestedKeyshare(x uint64) (n int) {
	return sovRequestedKeyshare(uint64((x << 1) ^ uint64((int64(x) >> 63))))
}
func (m *KeyShareRequest) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowRequestedKeyshare
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: KeyShareRequest: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: KeyShareRequest: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Identity", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Identity = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Pubkey", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Pubkey = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 3:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field IbcInfo", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				msglen |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if msglen < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			if m.IbcInfo == nil {
				m.IbcInfo = &IBCInfo{}
			}
			if err := m.IbcInfo.Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		case 4:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Counterparty", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				msglen |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if msglen < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			if m.Counterparty == nil {
				m.Counterparty = &CounterPartyIBCInfo{}
			}
			if err := m.Counterparty.Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		case 5:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field AggrKeyshare", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.AggrKeyshare = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 6:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field ProposalId", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.ProposalId = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 7:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field Sent", wireType)
			}
			var v int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				v |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			m.Sent = bool(v != 0)
		default:
			iNdEx = preIndex
			skippy, err := skipRequestedKeyshare(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func (m *IBCInfo) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowRequestedKeyshare
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: IBCInfo: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: IBCInfo: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field ClientID", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.ClientID = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field ConnectionID", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.ConnectionID = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 3:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field ChannelID", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.ChannelID = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 4:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field PortID", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.PortID = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipRequestedKeyshare(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func (m *CounterPartyIBCInfo) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowRequestedKeyshare
			}
			if iNdEx >= l {
				return io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= uint64(b&0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		fieldNum := int32(wire >> 3)
		wireType := int(wire & 0x7)
		if wireType == 4 {
			return fmt.Errorf("proto: CounterPartyIBCInfo: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: CounterPartyIBCInfo: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field ClientID", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.ClientID = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field ConnectionID", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.ConnectionID = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 3:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field ChannelID", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.ChannelID = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 4:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field PortID", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				stringLen |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			intStringLen := int(stringLen)
			if intStringLen < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.PortID = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipRequestedKeyshare(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthRequestedKeyshare
			}
			if (iNdEx + skippy) > l {
				return io.ErrUnexpectedEOF
			}
			iNdEx += skippy
		}
	}

	if iNdEx > l {
		return io.ErrUnexpectedEOF
	}
	return nil
}
func skipRequestedKeyshare(dAtA []byte) (n int, err error) {
	l := len(dAtA)
	iNdEx := 0
	depth := 0
	for iNdEx < l {
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return 0, ErrIntOverflowRequestedKeyshare
			}
			if iNdEx >= l {
				return 0, io.ErrUnexpectedEOF
			}
			b := dAtA[iNdEx]
			iNdEx++
			wire |= (uint64(b) & 0x7F) << shift
			if b < 0x80 {
				break
			}
		}
		wireType := int(wire & 0x7)
		switch wireType {
		case 0:
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return 0, ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return 0, io.ErrUnexpectedEOF
				}
				iNdEx++
				if dAtA[iNdEx-1] < 0x80 {
					break
				}
			}
		case 1:
			iNdEx += 8
		case 2:
			var length int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return 0, ErrIntOverflowRequestedKeyshare
				}
				if iNdEx >= l {
					return 0, io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				length |= (int(b) & 0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if length < 0 {
				return 0, ErrInvalidLengthRequestedKeyshare
			}
			iNdEx += length
		case 3:
			depth++
		case 4:
			if depth == 0 {
				return 0, ErrUnexpectedEndOfGroupRequestedKeyshare
			}
			depth--
		case 5:
			iNdEx += 4
		default:
			return 0, fmt.Errorf("proto: illegal wireType %d", wireType)
		}
		if iNdEx < 0 {
			return 0, ErrInvalidLengthRequestedKeyshare
		}
		if depth == 0 {
			return iNdEx, nil
		}
	}
	return 0, io.ErrUnexpectedEOF
}

var (
	ErrInvalidLengthRequestedKeyshare        = fmt.Errorf("proto: negative length found during unmarshaling")
	ErrIntOverflowRequestedKeyshare          = fmt.Errorf("proto: integer overflow")
	ErrUnexpectedEndOfGroupRequestedKeyshare = fmt.Errorf("proto: unexpected end of group")
)
