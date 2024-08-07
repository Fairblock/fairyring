// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: fairyring/pep/genesis.proto

package types

import (
	fmt "fmt"
	types "github.com/Fairblock/fairyring/x/common/types"
	_ "github.com/cosmos/cosmos-sdk/types/tx/amino"
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
	// params defines all the parameters of the module.
	Params           Params             `protobuf:"bytes,1,opt,name=params,proto3" json:"params"`
	PortId           string             `protobuf:"bytes,2,opt,name=port_id,json=portId,proto3" json:"port_id,omitempty"`
	EncryptedTxArray []EncryptedTxArray `protobuf:"bytes,3,rep,name=encryptedTxArray,proto3" json:"encryptedTxArray"`
	PepNonceList     []PepNonce         `protobuf:"bytes,4,rep,name=pepNonceList,proto3" json:"pepNonceList"`
	// this line is used by starport scaffolding # genesis/proto/state
	AggregatedKeyShareList []AggregatedKeyShare  `protobuf:"bytes,6,rep,name=aggregatedKeyShareList,proto3" json:"aggregatedKeyShareList"`
	ActivePubKey           types.ActivePublicKey `protobuf:"bytes,7,opt,name=activePubKey,proto3" json:"activePubKey"`
	QueuedPubKey           types.QueuedPublicKey `protobuf:"bytes,8,opt,name=queuedPubKey,proto3" json:"queuedPubKey"`
	RequestCount           uint64                `protobuf:"varint,9,opt,name=request_count,json=requestCount,proto3" json:"request_count,omitempty"`
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

func (m *GenesisState) GetActivePubKey() types.ActivePublicKey {
	if m != nil {
		return m.ActivePubKey
	}
	return types.ActivePublicKey{}
}

func (m *GenesisState) GetQueuedPubKey() types.QueuedPublicKey {
	if m != nil {
		return m.QueuedPubKey
	}
	return types.QueuedPublicKey{}
}

func (m *GenesisState) GetRequestCount() uint64 {
	if m != nil {
		return m.RequestCount
	}
	return 0
}

func init() {
	proto.RegisterType((*GenesisState)(nil), "fairyring.pep.GenesisState")
}

func init() { proto.RegisterFile("fairyring/pep/genesis.proto", fileDescriptor_c02ca82ac7a8fa8f) }

var fileDescriptor_c02ca82ac7a8fa8f = []byte{
	// 466 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x74, 0x92, 0xcf, 0x6e, 0xd3, 0x40,
	0x10, 0xc6, 0x63, 0x1a, 0xa5, 0x64, 0x9b, 0x4a, 0xb0, 0x02, 0x6a, 0x05, 0xe1, 0x1a, 0x7a, 0xb1,
	0x7a, 0xb0, 0xa5, 0x72, 0xe1, 0x9a, 0xf0, 0x4f, 0x28, 0x08, 0xb5, 0x29, 0x27, 0x2e, 0xd6, 0xc6,
	0x1e, 0xb6, 0xab, 0x36, 0xbb, 0xdb, 0xf5, 0x1a, 0xc5, 0x6f, 0xc1, 0x8d, 0x57, 0xe0, 0xc8, 0x63,
	0xf4, 0xd8, 0x23, 0x27, 0x84, 0x92, 0x03, 0xaf, 0x81, 0x76, 0xb3, 0x69, 0x6a, 0x57, 0xb9, 0x58,
	0xeb, 0xf9, 0xbe, 0xf9, 0xed, 0xcc, 0xec, 0xa0, 0xa7, 0x5f, 0x09, 0x53, 0x95, 0x62, 0x9c, 0x26,
	0x12, 0x64, 0x42, 0x81, 0x43, 0xc1, 0x8a, 0x58, 0x2a, 0xa1, 0x05, 0xde, 0xbd, 0x11, 0x63, 0x09,
	0xb2, 0xff, 0x90, 0x4c, 0x19, 0x17, 0x89, 0xfd, 0x2e, 0x1d, 0xfd, 0x47, 0x54, 0x50, 0x61, 0x8f,
	0x89, 0x39, 0xb9, 0x68, 0xbf, 0x0e, 0x95, 0x44, 0x91, 0xa9, 0x63, 0xf6, 0xc3, 0xba, 0x06, 0x3c,
	0x53, 0x95, 0xd4, 0x90, 0xa7, 0x7a, 0xe6, 0x1c, 0xcf, 0x1a, 0xd9, 0x20, 0x53, 0x2e, 0x78, 0x06,
	0x4e, 0x8e, 0xea, 0x32, 0xa1, 0x54, 0x01, 0x25, 0x86, 0x70, 0x0e, 0x55, 0x5a, 0x9c, 0x11, 0xb5,
	0x72, 0x1e, 0xac, 0x9d, 0x99, 0x98, 0x4e, 0x05, 0x4f, 0xac, 0x9a, 0xa7, 0xba, 0x92, 0xe0, 0xea,
	0x79, 0xf1, 0xa3, 0x8d, 0x7a, 0xef, 0x97, 0x5d, 0x9f, 0x6a, 0xa2, 0x01, 0xbf, 0x42, 0x9d, 0x65,
	0xc1, 0xbe, 0x17, 0x7a, 0xd1, 0xce, 0xd1, 0xe3, 0xb8, 0x36, 0x85, 0xf8, 0xd8, 0x8a, 0xc3, 0xee,
	0xd5, 0x9f, 0xfd, 0xd6, 0xcf, 0x7f, 0xbf, 0x0e, 0xbd, 0xb1, 0xf3, 0xe3, 0x3d, 0xb4, 0x2d, 0x85,
	0xd2, 0x29, 0xcb, 0xfd, 0x7b, 0xa1, 0x17, 0x75, 0xc7, 0x1d, 0xf3, 0xfb, 0x21, 0xc7, 0x27, 0xe8,
	0xc1, 0x4d, 0x9f, 0x9f, 0x67, 0x03, 0xa5, 0x48, 0xe5, 0x6f, 0x85, 0x5b, 0xd1, 0xce, 0xd1, 0x7e,
	0x03, 0xfe, 0xb6, 0x61, 0x1b, 0xb6, 0xcd, 0x35, 0xe3, 0x3b, 0xe9, 0x78, 0x80, 0x7a, 0x12, 0xe4,
	0x27, 0x33, 0x97, 0x8f, 0xac, 0xd0, 0x7e, 0xdb, 0xe2, 0xf6, 0x9a, 0xb5, 0x3a, 0x8b, 0xc3, 0xd4,
	0x52, 0x70, 0x8a, 0x9e, 0xac, 0x87, 0x37, 0x82, 0xea, 0xd4, 0x0c, 0xc7, 0xc2, 0x3a, 0x16, 0xf6,
	0xbc, 0x01, 0x1b, 0xdc, 0x31, 0x3b, 0xec, 0x06, 0x0c, 0x1e, 0xa1, 0x1e, 0xc9, 0x34, 0xfb, 0x06,
	0xc7, 0xe5, 0x64, 0x04, 0x95, 0xbf, 0x6d, 0xe7, 0x79, 0x1b, 0xbb, 0x7c, 0x96, 0x78, 0xb0, 0x72,
	0x5d, 0xb0, 0x6c, 0x04, 0xab, 0xa6, 0x6b, 0xc9, 0x06, 0x76, 0x59, 0x42, 0x09, 0xb9, 0x83, 0xdd,
	0xdf, 0x04, 0x3b, 0x59, 0xb9, 0xea, 0xb0, 0xdb, 0xc9, 0xf8, 0x00, 0xed, 0x2a, 0xb8, 0x2c, 0xa1,
	0xd0, 0x69, 0x26, 0x4a, 0xae, 0xfd, 0x6e, 0xe8, 0x45, 0xed, 0x71, 0xcf, 0x05, 0x5f, 0x9b, 0xd8,
	0xf0, 0xcd, 0xd5, 0x3c, 0xf0, 0xae, 0xe7, 0x81, 0xf7, 0x77, 0x1e, 0x78, 0xdf, 0x17, 0x41, 0xeb,
	0x7a, 0x11, 0xb4, 0x7e, 0x2f, 0x82, 0xd6, 0x97, 0x43, 0xca, 0xf4, 0x59, 0x39, 0x31, 0x37, 0x26,
	0xef, 0x08, 0x53, 0x93, 0x0b, 0x91, 0x9d, 0x27, 0xeb, 0x6d, 0x9b, 0xd9, 0xcd, 0xb4, 0x5b, 0x36,
	0xe9, 0xd8, 0x35, 0x7b, 0xf9, 0x3f, 0x00, 0x00, 0xff, 0xff, 0xae, 0xf1, 0x05, 0xa2, 0x69, 0x03,
	0x00, 0x00,
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
	if m.RequestCount != 0 {
		i = encodeVarintGenesis(dAtA, i, uint64(m.RequestCount))
		i--
		dAtA[i] = 0x48
	}
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
	if m.RequestCount != 0 {
		n += 1 + sovGenesis(uint64(m.RequestCount))
	}
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
		case 9:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field RequestCount", wireType)
			}
			m.RequestCount = 0
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowGenesis
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				m.RequestCount |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
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
