// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: fairyring/fairblock/packet.proto

package types

import (
	types "fairyring/x/fairyring/types"
	fmt "fmt"
	proto "github.com/gogo/protobuf/proto"
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

type FairblockPacketData struct {
	// Types that are valid to be assigned to Packet:
	//	*FairblockPacketData_NoData
	//	*FairblockPacketData_CurrentKeysPacket
	Packet isFairblockPacketData_Packet `protobuf_oneof:"packet"`
}

func (m *FairblockPacketData) Reset()         { *m = FairblockPacketData{} }
func (m *FairblockPacketData) String() string { return proto.CompactTextString(m) }
func (*FairblockPacketData) ProtoMessage()    {}
func (*FairblockPacketData) Descriptor() ([]byte, []int) {
	return fileDescriptor_ec20dffec3ff8327, []int{0}
}
func (m *FairblockPacketData) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *FairblockPacketData) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_FairblockPacketData.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *FairblockPacketData) XXX_Merge(src proto.Message) {
	xxx_messageInfo_FairblockPacketData.Merge(m, src)
}
func (m *FairblockPacketData) XXX_Size() int {
	return m.Size()
}
func (m *FairblockPacketData) XXX_DiscardUnknown() {
	xxx_messageInfo_FairblockPacketData.DiscardUnknown(m)
}

var xxx_messageInfo_FairblockPacketData proto.InternalMessageInfo

type isFairblockPacketData_Packet interface {
	isFairblockPacketData_Packet()
	MarshalTo([]byte) (int, error)
	Size() int
}

type FairblockPacketData_NoData struct {
	NoData *NoData `protobuf:"bytes,1,opt,name=noData,proto3,oneof" json:"noData,omitempty"`
}
type FairblockPacketData_CurrentKeysPacket struct {
	CurrentKeysPacket *CurrentKeysPacketData `protobuf:"bytes,2,opt,name=currentKeysPacket,proto3,oneof" json:"currentKeysPacket,omitempty"`
}

func (*FairblockPacketData_NoData) isFairblockPacketData_Packet()            {}
func (*FairblockPacketData_CurrentKeysPacket) isFairblockPacketData_Packet() {}

func (m *FairblockPacketData) GetPacket() isFairblockPacketData_Packet {
	if m != nil {
		return m.Packet
	}
	return nil
}

func (m *FairblockPacketData) GetNoData() *NoData {
	if x, ok := m.GetPacket().(*FairblockPacketData_NoData); ok {
		return x.NoData
	}
	return nil
}

func (m *FairblockPacketData) GetCurrentKeysPacket() *CurrentKeysPacketData {
	if x, ok := m.GetPacket().(*FairblockPacketData_CurrentKeysPacket); ok {
		return x.CurrentKeysPacket
	}
	return nil
}

// XXX_OneofWrappers is for the internal use of the proto package.
func (*FairblockPacketData) XXX_OneofWrappers() []interface{} {
	return []interface{}{
		(*FairblockPacketData_NoData)(nil),
		(*FairblockPacketData_CurrentKeysPacket)(nil),
	}
}

type NoData struct {
}

func (m *NoData) Reset()         { *m = NoData{} }
func (m *NoData) String() string { return proto.CompactTextString(m) }
func (*NoData) ProtoMessage()    {}
func (*NoData) Descriptor() ([]byte, []int) {
	return fileDescriptor_ec20dffec3ff8327, []int{1}
}
func (m *NoData) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *NoData) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_NoData.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *NoData) XXX_Merge(src proto.Message) {
	xxx_messageInfo_NoData.Merge(m, src)
}
func (m *NoData) XXX_Size() int {
	return m.Size()
}
func (m *NoData) XXX_DiscardUnknown() {
	xxx_messageInfo_NoData.DiscardUnknown(m)
}

var xxx_messageInfo_NoData proto.InternalMessageInfo

// CurrentKeysPacketData defines a struct for the packet payload
type CurrentKeysPacketData struct {
}

func (m *CurrentKeysPacketData) Reset()         { *m = CurrentKeysPacketData{} }
func (m *CurrentKeysPacketData) String() string { return proto.CompactTextString(m) }
func (*CurrentKeysPacketData) ProtoMessage()    {}
func (*CurrentKeysPacketData) Descriptor() ([]byte, []int) {
	return fileDescriptor_ec20dffec3ff8327, []int{2}
}
func (m *CurrentKeysPacketData) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *CurrentKeysPacketData) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_CurrentKeysPacketData.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *CurrentKeysPacketData) XXX_Merge(src proto.Message) {
	xxx_messageInfo_CurrentKeysPacketData.Merge(m, src)
}
func (m *CurrentKeysPacketData) XXX_Size() int {
	return m.Size()
}
func (m *CurrentKeysPacketData) XXX_DiscardUnknown() {
	xxx_messageInfo_CurrentKeysPacketData.DiscardUnknown(m)
}

var xxx_messageInfo_CurrentKeysPacketData proto.InternalMessageInfo

// CurrentKeysPacketAck defines a struct for the packet acknowledgment
type CurrentKeysPacketAck struct {
	ActiveKey *types.ActivePubKey `protobuf:"bytes,2,opt,name=activeKey,proto3" json:"activeKey,omitempty"`
	QueuedKey *types.QueuedPubKey `protobuf:"bytes,3,opt,name=queuedKey,proto3" json:"queuedKey,omitempty"`
}

func (m *CurrentKeysPacketAck) Reset()         { *m = CurrentKeysPacketAck{} }
func (m *CurrentKeysPacketAck) String() string { return proto.CompactTextString(m) }
func (*CurrentKeysPacketAck) ProtoMessage()    {}
func (*CurrentKeysPacketAck) Descriptor() ([]byte, []int) {
	return fileDescriptor_ec20dffec3ff8327, []int{3}
}
func (m *CurrentKeysPacketAck) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *CurrentKeysPacketAck) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_CurrentKeysPacketAck.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *CurrentKeysPacketAck) XXX_Merge(src proto.Message) {
	xxx_messageInfo_CurrentKeysPacketAck.Merge(m, src)
}
func (m *CurrentKeysPacketAck) XXX_Size() int {
	return m.Size()
}
func (m *CurrentKeysPacketAck) XXX_DiscardUnknown() {
	xxx_messageInfo_CurrentKeysPacketAck.DiscardUnknown(m)
}

var xxx_messageInfo_CurrentKeysPacketAck proto.InternalMessageInfo

func (m *CurrentKeysPacketAck) GetActiveKey() *types.ActivePubKey {
	if m != nil {
		return m.ActiveKey
	}
	return nil
}

func (m *CurrentKeysPacketAck) GetQueuedKey() *types.QueuedPubKey {
	if m != nil {
		return m.QueuedKey
	}
	return nil
}

func init() {
	proto.RegisterType((*FairblockPacketData)(nil), "fairyring.fairblock.FairblockPacketData")
	proto.RegisterType((*NoData)(nil), "fairyring.fairblock.NoData")
	proto.RegisterType((*CurrentKeysPacketData)(nil), "fairyring.fairblock.CurrentKeysPacketData")
	proto.RegisterType((*CurrentKeysPacketAck)(nil), "fairyring.fairblock.CurrentKeysPacketAck")
}

func init() { proto.RegisterFile("fairyring/fairblock/packet.proto", fileDescriptor_ec20dffec3ff8327) }

var fileDescriptor_ec20dffec3ff8327 = []byte{
	// 288 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0x52, 0x48, 0x4b, 0xcc, 0x2c,
	0xaa, 0x2c, 0xca, 0xcc, 0x4b, 0xd7, 0x07, 0xb1, 0x92, 0x72, 0xf2, 0x93, 0xb3, 0xf5, 0x0b, 0x12,
	0x93, 0xb3, 0x53, 0x4b, 0xf4, 0x0a, 0x8a, 0xf2, 0x4b, 0xf2, 0x85, 0x84, 0xe1, 0x2a, 0xf4, 0xe0,
	0x2a, 0xa4, 0x34, 0x50, 0xb5, 0x41, 0x58, 0x39, 0x89, 0x25, 0xa9, 0xc5, 0x25, 0xf1, 0x05, 0xa5,
	0x49, 0xf1, 0xd9, 0xa9, 0x95, 0x10, 0xed, 0x4a, 0x9b, 0x18, 0xb9, 0x84, 0xdd, 0x60, 0xfa, 0x02,
	0xc0, 0x06, 0xbb, 0x24, 0x96, 0x24, 0x0a, 0x99, 0x72, 0xb1, 0xe5, 0xe5, 0x83, 0x58, 0x12, 0x8c,
	0x0a, 0x8c, 0x1a, 0xdc, 0x46, 0xd2, 0x7a, 0x58, 0xec, 0xd1, 0xf3, 0x03, 0x2b, 0xf1, 0x60, 0x08,
	0x82, 0x2a, 0x16, 0x8a, 0xe2, 0x12, 0x4c, 0x2e, 0x2d, 0x2a, 0x4a, 0xcd, 0x2b, 0xf1, 0x4e, 0xad,
	0x2c, 0x86, 0x98, 0x27, 0xc1, 0x04, 0x36, 0x41, 0x0b, 0xab, 0x09, 0xce, 0xe8, 0xaa, 0xa1, 0x06,
	0x62, 0x1a, 0xe3, 0xc4, 0xc1, 0xc5, 0x06, 0xf1, 0xb9, 0x12, 0x07, 0x17, 0x1b, 0xc4, 0x66, 0x25,
	0x71, 0x2e, 0x51, 0xac, 0x26, 0x28, 0xcd, 0x60, 0xe4, 0x12, 0xc1, 0x90, 0x71, 0x4c, 0xce, 0x16,
	0xb2, 0xe7, 0xe2, 0x4c, 0x4c, 0x2e, 0xc9, 0x2c, 0x4b, 0xf5, 0x4e, 0xad, 0x84, 0xba, 0x4c, 0x11,
	0xcd, 0x65, 0x10, 0x96, 0x23, 0x58, 0x55, 0x40, 0x69, 0x92, 0x77, 0x6a, 0x65, 0x10, 0x42, 0x0f,
	0xc8, 0x80, 0xc2, 0xd2, 0xd4, 0xd2, 0xd4, 0x14, 0x90, 0x01, 0xcc, 0x78, 0x0c, 0x08, 0x04, 0xab,
	0x82, 0x19, 0x00, 0xd7, 0xe3, 0x64, 0x7a, 0xe2, 0x91, 0x1c, 0xe3, 0x85, 0x47, 0x72, 0x8c, 0x0f,
	0x1e, 0xc9, 0x31, 0x4e, 0x78, 0x2c, 0xc7, 0x70, 0xe1, 0xb1, 0x1c, 0xc3, 0x8d, 0xc7, 0x72, 0x0c,
	0x51, 0xd2, 0x88, 0xc8, 0xaa, 0x40, 0x8a, 0xef, 0x92, 0xca, 0x82, 0xd4, 0xe2, 0x24, 0x36, 0x70,
	0x84, 0x19, 0x03, 0x02, 0x00, 0x00, 0xff, 0xff, 0x87, 0x6d, 0x89, 0x71, 0x13, 0x02, 0x00, 0x00,
}

func (m *FairblockPacketData) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *FairblockPacketData) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *FairblockPacketData) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if m.Packet != nil {
		{
			size := m.Packet.Size()
			i -= size
			if _, err := m.Packet.MarshalTo(dAtA[i:]); err != nil {
				return 0, err
			}
		}
	}
	return len(dAtA) - i, nil
}

func (m *FairblockPacketData_NoData) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *FairblockPacketData_NoData) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	if m.NoData != nil {
		{
			size, err := m.NoData.MarshalToSizedBuffer(dAtA[:i])
			if err != nil {
				return 0, err
			}
			i -= size
			i = encodeVarintPacket(dAtA, i, uint64(size))
		}
		i--
		dAtA[i] = 0xa
	}
	return len(dAtA) - i, nil
}
func (m *FairblockPacketData_CurrentKeysPacket) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *FairblockPacketData_CurrentKeysPacket) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	if m.CurrentKeysPacket != nil {
		{
			size, err := m.CurrentKeysPacket.MarshalToSizedBuffer(dAtA[:i])
			if err != nil {
				return 0, err
			}
			i -= size
			i = encodeVarintPacket(dAtA, i, uint64(size))
		}
		i--
		dAtA[i] = 0x12
	}
	return len(dAtA) - i, nil
}
func (m *NoData) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *NoData) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *NoData) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	return len(dAtA) - i, nil
}

func (m *CurrentKeysPacketData) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *CurrentKeysPacketData) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *CurrentKeysPacketData) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	return len(dAtA) - i, nil
}

func (m *CurrentKeysPacketAck) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *CurrentKeysPacketAck) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *CurrentKeysPacketAck) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if m.QueuedKey != nil {
		{
			size, err := m.QueuedKey.MarshalToSizedBuffer(dAtA[:i])
			if err != nil {
				return 0, err
			}
			i -= size
			i = encodeVarintPacket(dAtA, i, uint64(size))
		}
		i--
		dAtA[i] = 0x1a
	}
	if m.ActiveKey != nil {
		{
			size, err := m.ActiveKey.MarshalToSizedBuffer(dAtA[:i])
			if err != nil {
				return 0, err
			}
			i -= size
			i = encodeVarintPacket(dAtA, i, uint64(size))
		}
		i--
		dAtA[i] = 0x12
	}
	return len(dAtA) - i, nil
}

func encodeVarintPacket(dAtA []byte, offset int, v uint64) int {
	offset -= sovPacket(v)
	base := offset
	for v >= 1<<7 {
		dAtA[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	dAtA[offset] = uint8(v)
	return base
}
func (m *FairblockPacketData) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	if m.Packet != nil {
		n += m.Packet.Size()
	}
	return n
}

func (m *FairblockPacketData_NoData) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	if m.NoData != nil {
		l = m.NoData.Size()
		n += 1 + l + sovPacket(uint64(l))
	}
	return n
}
func (m *FairblockPacketData_CurrentKeysPacket) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	if m.CurrentKeysPacket != nil {
		l = m.CurrentKeysPacket.Size()
		n += 1 + l + sovPacket(uint64(l))
	}
	return n
}
func (m *NoData) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	return n
}

func (m *CurrentKeysPacketData) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	return n
}

func (m *CurrentKeysPacketAck) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	if m.ActiveKey != nil {
		l = m.ActiveKey.Size()
		n += 1 + l + sovPacket(uint64(l))
	}
	if m.QueuedKey != nil {
		l = m.QueuedKey.Size()
		n += 1 + l + sovPacket(uint64(l))
	}
	return n
}

func sovPacket(x uint64) (n int) {
	return (math_bits.Len64(x|1) + 6) / 7
}
func sozPacket(x uint64) (n int) {
	return sovPacket(uint64((x << 1) ^ uint64((int64(x) >> 63))))
}
func (m *FairblockPacketData) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowPacket
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
			return fmt.Errorf("proto: FairblockPacketData: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: FairblockPacketData: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field NoData", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowPacket
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
				return ErrInvalidLengthPacket
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthPacket
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			v := &NoData{}
			if err := v.Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			m.Packet = &FairblockPacketData_NoData{v}
			iNdEx = postIndex
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field CurrentKeysPacket", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowPacket
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
				return ErrInvalidLengthPacket
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthPacket
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			v := &CurrentKeysPacketData{}
			if err := v.Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			m.Packet = &FairblockPacketData_CurrentKeysPacket{v}
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipPacket(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthPacket
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
func (m *NoData) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowPacket
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
			return fmt.Errorf("proto: NoData: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: NoData: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		default:
			iNdEx = preIndex
			skippy, err := skipPacket(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthPacket
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
func (m *CurrentKeysPacketData) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowPacket
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
			return fmt.Errorf("proto: CurrentKeysPacketData: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: CurrentKeysPacketData: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		default:
			iNdEx = preIndex
			skippy, err := skipPacket(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthPacket
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
func (m *CurrentKeysPacketAck) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowPacket
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
			return fmt.Errorf("proto: CurrentKeysPacketAck: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: CurrentKeysPacketAck: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field ActiveKey", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowPacket
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
				return ErrInvalidLengthPacket
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthPacket
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			if m.ActiveKey == nil {
				m.ActiveKey = &types.ActivePubKey{}
			}
			if err := m.ActiveKey.Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		case 3:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field QueuedKey", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowPacket
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
				return ErrInvalidLengthPacket
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthPacket
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			if m.QueuedKey == nil {
				m.QueuedKey = &types.QueuedPubKey{}
			}
			if err := m.QueuedKey.Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipPacket(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthPacket
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
func skipPacket(dAtA []byte) (n int, err error) {
	l := len(dAtA)
	iNdEx := 0
	depth := 0
	for iNdEx < l {
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return 0, ErrIntOverflowPacket
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
					return 0, ErrIntOverflowPacket
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
					return 0, ErrIntOverflowPacket
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
				return 0, ErrInvalidLengthPacket
			}
			iNdEx += length
		case 3:
			depth++
		case 4:
			if depth == 0 {
				return 0, ErrUnexpectedEndOfGroupPacket
			}
			depth--
		case 5:
			iNdEx += 4
		default:
			return 0, fmt.Errorf("proto: illegal wireType %d", wireType)
		}
		if iNdEx < 0 {
			return 0, ErrInvalidLengthPacket
		}
		if depth == 0 {
			return iNdEx, nil
		}
	}
	return 0, io.ErrUnexpectedEOF
}

var (
	ErrInvalidLengthPacket        = fmt.Errorf("proto: negative length found during unmarshaling")
	ErrIntOverflowPacket          = fmt.Errorf("proto: integer overflow")
	ErrUnexpectedEndOfGroupPacket = fmt.Errorf("proto: unexpected end of group")
)