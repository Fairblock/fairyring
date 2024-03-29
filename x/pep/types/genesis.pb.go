// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: fairyring/pep/genesis.proto

package types

import (
	fmt "fmt"
	_ "github.com/cosmos/gogoproto/gogoproto"
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

// GenesisState defines the pep module's genesis state.
type GenesisState struct {
	Params           Params             `protobuf:"bytes,1,opt,name=params,proto3" json:"params"`
	PortId           string             `protobuf:"bytes,2,opt,name=port_id,json=portId,proto3" json:"port_id,omitempty"`
	EncryptedTxArray []EncryptedTxArray `protobuf:"bytes,3,rep,name=encryptedTxArray,proto3" json:"encryptedTxArray"`
	PepNonceList     []PepNonce         `protobuf:"bytes,4,rep,name=pepNonceList,proto3" json:"pepNonceList"`
	// this line is used by starport scaffolding # genesis/proto/state
	AggregatedKeyShareList []AggregatedKeyShare `protobuf:"bytes,6,rep,name=aggregatedKeyShareList,proto3" json:"aggregatedKeyShareList"`
	ActivePubKey           ActivePubKey         `protobuf:"bytes,7,opt,name=activePubKey,proto3" json:"activePubKey"`
	QueuedPubKey           QueuedPubKey         `protobuf:"bytes,8,opt,name=queuedPubKey,proto3" json:"queuedPubKey"`
}

func (m *GenesisState) Reset()         { *m = GenesisState{} }
func (m *GenesisState) String() string { return proto.CompactTextString(m) }
func (*GenesisState) ProtoMessage()    {}
func (*GenesisState) Descriptor() ([]byte, []int) {
	return fileDescriptor_c02ca82ac7a8fa8f, []int{0}
}
func (m *GenesisState) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *GenesisState) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_GenesisState.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *GenesisState) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GenesisState.Merge(m, src)
}
func (m *GenesisState) XXX_Size() int {
	return m.Size()
}
func (m *GenesisState) XXX_DiscardUnknown() {
	xxx_messageInfo_GenesisState.DiscardUnknown(m)
}

var xxx_messageInfo_GenesisState proto.InternalMessageInfo

func (m *GenesisState) GetParams() Params {
	if m != nil {
		return m.Params
	}
	return Params{}
}

func (m *GenesisState) GetPortId() string {
	if m != nil {
		return m.PortId
	}
	return ""
}

func (m *GenesisState) GetEncryptedTxArray() []EncryptedTxArray {
	if m != nil {
		return m.EncryptedTxArray
	}
	return nil
}

func (m *GenesisState) GetPepNonceList() []PepNonce {
	if m != nil {
		return m.PepNonceList
	}
	return nil
}

func (m *GenesisState) GetAggregatedKeyShareList() []AggregatedKeyShare {
	if m != nil {
		return m.AggregatedKeyShareList
	}
	return nil
}

func (m *GenesisState) GetActivePubKey() ActivePubKey {
	if m != nil {
		return m.ActivePubKey
	}
	return ActivePubKey{}
}

func (m *GenesisState) GetQueuedPubKey() QueuedPubKey {
	if m != nil {
		return m.QueuedPubKey
	}
	return QueuedPubKey{}
}

func init() {
	proto.RegisterType((*GenesisState)(nil), "fairyring.pep.GenesisState")
}

func init() { proto.RegisterFile("fairyring/pep/genesis.proto", fileDescriptor_c02ca82ac7a8fa8f) }

var fileDescriptor_c02ca82ac7a8fa8f = []byte{
	// 405 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x74, 0x92, 0x41, 0x8f, 0x93, 0x40,
	0x14, 0xc7, 0xc1, 0x6e, 0x58, 0x9d, 0xad, 0x89, 0x21, 0xea, 0x12, 0x36, 0xb2, 0xe8, 0x89, 0x78,
	0x80, 0x64, 0xf7, 0x13, 0x74, 0xe3, 0x6a, 0xcc, 0x1a, 0xb3, 0x6d, 0x3d, 0x79, 0x21, 0x03, 0x3c,
	0xa7, 0x93, 0x5a, 0x66, 0x1c, 0x06, 0x53, 0xbe, 0x85, 0x1f, 0xab, 0xc7, 0x1e, 0x3d, 0x19, 0x6d,
	0xbf, 0x88, 0x61, 0x98, 0xb6, 0x40, 0xf5, 0x06, 0xf9, 0xff, 0xde, 0x6f, 0xde, 0x7b, 0x79, 0xe8,
	0xe2, 0x0b, 0xa6, 0xa2, 0x12, 0x34, 0x27, 0x11, 0x07, 0x1e, 0x11, 0xc8, 0xa1, 0xa0, 0x45, 0xc8,
	0x05, 0x93, 0xcc, 0x7e, 0xbc, 0x0f, 0x43, 0x0e, 0xdc, 0x7d, 0x4a, 0x18, 0x61, 0x2a, 0x89, 0xea,
	0xaf, 0x06, 0x72, 0xdd, 0xae, 0x81, 0x63, 0x81, 0x17, 0x5a, 0xe0, 0xfa, 0xdd, 0x0c, 0xf2, 0x54,
	0x54, 0x5c, 0x42, 0x16, 0xcb, 0xa5, 0x26, 0x5e, 0xf4, 0xaa, 0x81, 0xc7, 0x39, 0xcb, 0x53, 0xd0,
	0x71, 0xd0, 0x8d, 0x31, 0x21, 0x02, 0x08, 0xae, 0x0d, 0x73, 0xa8, 0xe2, 0x62, 0x86, 0xc5, 0x8e,
	0xec, 0x0d, 0xc2, 0xcb, 0xa4, 0x46, 0x9a, 0xf0, 0xd5, 0x9f, 0x01, 0x1a, 0xbe, 0x6b, 0x46, 0x9b,
	0x4a, 0x2c, 0xc1, 0xbe, 0x46, 0x56, 0xd3, 0xa8, 0x63, 0xfa, 0x66, 0x70, 0x76, 0xf5, 0x2c, 0xec,
	0x8c, 0x1a, 0xde, 0xab, 0xf0, 0xe6, 0x64, 0xf5, 0xeb, 0xd2, 0x98, 0x68, 0xd4, 0x3e, 0x47, 0xa7,
	0x9c, 0x09, 0x19, 0xd3, 0xcc, 0x79, 0xe0, 0x9b, 0xc1, 0xa3, 0x89, 0x55, 0xff, 0xbe, 0xcf, 0xec,
	0x31, 0x7a, 0xb2, 0x1f, 0xed, 0xd3, 0x72, 0x24, 0x04, 0xae, 0x9c, 0x81, 0x3f, 0x08, 0xce, 0xae,
	0x2e, 0x7b, 0xde, 0xdb, 0x1e, 0xa6, 0x5f, 0x38, 0x2a, 0xb7, 0x47, 0x68, 0xc8, 0x81, 0x7f, 0xac,
	0x57, 0xf1, 0x81, 0x16, 0xd2, 0x39, 0x51, 0xba, 0xf3, 0x7e, 0x9b, 0x1a, 0xd1, 0x9a, 0x4e, 0x89,
	0x1d, 0xa3, 0xe7, 0x87, 0x7d, 0xdd, 0x41, 0x35, 0xad, 0xb7, 0xa5, 0x64, 0x96, 0x92, 0xbd, 0xec,
	0xc9, 0x46, 0x47, 0xb0, 0xd6, 0xfe, 0x47, 0x63, 0xdf, 0xa2, 0x21, 0x4e, 0x25, 0xfd, 0x0e, 0xf7,
	0x65, 0x72, 0x07, 0x95, 0x73, 0xaa, 0x56, 0x79, 0xd1, 0xd7, 0xb6, 0x90, 0x5d, 0x9f, 0xed, 0xb2,
	0x5a, 0xf3, 0xad, 0x84, 0x12, 0x32, 0xad, 0x79, 0xf8, 0x4f, 0xcd, 0xb8, 0x85, 0xec, 0x34, 0xed,
	0xb2, 0x9b, 0x37, 0xab, 0x8d, 0x67, 0xae, 0x37, 0x9e, 0xf9, 0x7b, 0xe3, 0x99, 0x3f, 0xb6, 0x9e,
	0xb1, 0xde, 0x7a, 0xc6, 0xcf, 0xad, 0x67, 0x7c, 0x7e, 0x4d, 0xa8, 0x9c, 0x95, 0x49, 0x98, 0xb2,
	0x45, 0xf4, 0x16, 0x53, 0x91, 0x7c, 0x65, 0xe9, 0x3c, 0x3a, 0xdc, 0xcb, 0x52, 0x5d, 0x8c, 0xac,
	0x38, 0x14, 0x89, 0xa5, 0x0e, 0xe6, 0xfa, 0x6f, 0x00, 0x00, 0x00, 0xff, 0xff, 0x7a, 0x89, 0x45,
	0x6a, 0x18, 0x03, 0x00, 0x00,
}

func (m *GenesisState) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *GenesisState) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *GenesisState) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	{
		size, err := m.QueuedPubKey.MarshalToSizedBuffer(dAtA[:i])
		if err != nil {
			return 0, err
		}
		i -= size
		i = encodeVarintGenesis(dAtA, i, uint64(size))
	}
	i--
	dAtA[i] = 0x42
	{
		size, err := m.ActivePubKey.MarshalToSizedBuffer(dAtA[:i])
		if err != nil {
			return 0, err
		}
		i -= size
		i = encodeVarintGenesis(dAtA, i, uint64(size))
	}
	i--
	dAtA[i] = 0x3a
	if len(m.AggregatedKeyShareList) > 0 {
		for iNdEx := len(m.AggregatedKeyShareList) - 1; iNdEx >= 0; iNdEx-- {
			{
				size, err := m.AggregatedKeyShareList[iNdEx].MarshalToSizedBuffer(dAtA[:i])
				if err != nil {
					return 0, err
				}
				i -= size
				i = encodeVarintGenesis(dAtA, i, uint64(size))
			}
			i--
			dAtA[i] = 0x32
		}
	}
	if len(m.PepNonceList) > 0 {
		for iNdEx := len(m.PepNonceList) - 1; iNdEx >= 0; iNdEx-- {
			{
				size, err := m.PepNonceList[iNdEx].MarshalToSizedBuffer(dAtA[:i])
				if err != nil {
					return 0, err
				}
				i -= size
				i = encodeVarintGenesis(dAtA, i, uint64(size))
			}
			i--
			dAtA[i] = 0x22
		}
	}
	if len(m.EncryptedTxArray) > 0 {
		for iNdEx := len(m.EncryptedTxArray) - 1; iNdEx >= 0; iNdEx-- {
			{
				size, err := m.EncryptedTxArray[iNdEx].MarshalToSizedBuffer(dAtA[:i])
				if err != nil {
					return 0, err
				}
				i -= size
				i = encodeVarintGenesis(dAtA, i, uint64(size))
			}
			i--
			dAtA[i] = 0x1a
		}
	}
	if len(m.PortId) > 0 {
		i -= len(m.PortId)
		copy(dAtA[i:], m.PortId)
		i = encodeVarintGenesis(dAtA, i, uint64(len(m.PortId)))
		i--
		dAtA[i] = 0x12
	}
	{
		size, err := m.Params.MarshalToSizedBuffer(dAtA[:i])
		if err != nil {
			return 0, err
		}
		i -= size
		i = encodeVarintGenesis(dAtA, i, uint64(size))
	}
	i--
	dAtA[i] = 0xa
	return len(dAtA) - i, nil
}

func encodeVarintGenesis(dAtA []byte, offset int, v uint64) int {
	offset -= sovGenesis(v)
	base := offset
	for v >= 1<<7 {
		dAtA[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	dAtA[offset] = uint8(v)
	return base
}
func (m *GenesisState) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = m.Params.Size()
	n += 1 + l + sovGenesis(uint64(l))
	l = len(m.PortId)
	if l > 0 {
		n += 1 + l + sovGenesis(uint64(l))
	}
	if len(m.EncryptedTxArray) > 0 {
		for _, e := range m.EncryptedTxArray {
			l = e.Size()
			n += 1 + l + sovGenesis(uint64(l))
		}
	}
	if len(m.PepNonceList) > 0 {
		for _, e := range m.PepNonceList {
			l = e.Size()
			n += 1 + l + sovGenesis(uint64(l))
		}
	}
	if len(m.AggregatedKeyShareList) > 0 {
		for _, e := range m.AggregatedKeyShareList {
			l = e.Size()
			n += 1 + l + sovGenesis(uint64(l))
		}
	}
	l = m.ActivePubKey.Size()
	n += 1 + l + sovGenesis(uint64(l))
	l = m.QueuedPubKey.Size()
	n += 1 + l + sovGenesis(uint64(l))
	return n
}

func sovGenesis(x uint64) (n int) {
	return (math_bits.Len64(x|1) + 6) / 7
}
func sozGenesis(x uint64) (n int) {
	return sovGenesis(uint64((x << 1) ^ uint64((int64(x) >> 63))))
}
func (m *GenesisState) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowGenesis
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
			return fmt.Errorf("proto: GenesisState: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: GenesisState: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Params", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowGenesis
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
				return ErrInvalidLengthGenesis
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthGenesis
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			if err := m.Params.Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field PortId", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowGenesis
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
				return ErrInvalidLengthGenesis
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthGenesis
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.PortId = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 3:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field EncryptedTxArray", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowGenesis
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
				return ErrInvalidLengthGenesis
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthGenesis
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.EncryptedTxArray = append(m.EncryptedTxArray, EncryptedTxArray{})
			if err := m.EncryptedTxArray[len(m.EncryptedTxArray)-1].Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		case 4:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field PepNonceList", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowGenesis
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
				return ErrInvalidLengthGenesis
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthGenesis
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.PepNonceList = append(m.PepNonceList, PepNonce{})
			if err := m.PepNonceList[len(m.PepNonceList)-1].Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		case 6:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field AggregatedKeyShareList", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowGenesis
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
				return ErrInvalidLengthGenesis
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthGenesis
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.AggregatedKeyShareList = append(m.AggregatedKeyShareList, AggregatedKeyShare{})
			if err := m.AggregatedKeyShareList[len(m.AggregatedKeyShareList)-1].Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		case 7:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field ActivePubKey", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowGenesis
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
				return ErrInvalidLengthGenesis
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthGenesis
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			if err := m.ActivePubKey.Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		case 8:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field QueuedPubKey", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowGenesis
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
				return ErrInvalidLengthGenesis
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthGenesis
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			if err := m.QueuedPubKey.Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipGenesis(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthGenesis
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
func skipGenesis(dAtA []byte) (n int, err error) {
	l := len(dAtA)
	iNdEx := 0
	depth := 0
	for iNdEx < l {
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return 0, ErrIntOverflowGenesis
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
					return 0, ErrIntOverflowGenesis
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
					return 0, ErrIntOverflowGenesis
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
				return 0, ErrInvalidLengthGenesis
			}
			iNdEx += length
		case 3:
			depth++
		case 4:
			if depth == 0 {
				return 0, ErrUnexpectedEndOfGroupGenesis
			}
			depth--
		case 5:
			iNdEx += 4
		default:
			return 0, fmt.Errorf("proto: illegal wireType %d", wireType)
		}
		if iNdEx < 0 {
			return 0, ErrInvalidLengthGenesis
		}
		if depth == 0 {
			return iNdEx, nil
		}
	}
	return 0, io.ErrUnexpectedEOF
}

var (
	ErrInvalidLengthGenesis        = fmt.Errorf("proto: negative length found during unmarshaling")
	ErrIntOverflowGenesis          = fmt.Errorf("proto: integer overflow")
	ErrUnexpectedEndOfGroupGenesis = fmt.Errorf("proto: unexpected end of group")
)
