// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: fairyring/keyshare/params.proto

package types

import (
	cosmossdk_io_math "cosmossdk.io/math"
	encoding_binary "encoding/binary"
	fmt "fmt"
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

// Params defines the parameters for the module.
type Params struct {
	KeyExpiry                  uint64                      `protobuf:"varint,1,opt,name=key_expiry,json=keyExpiry,proto3" json:"key_expiry,omitempty" yaml:"key_expiry"`
	MinimumBonded              uint64                      `protobuf:"varint,2,opt,name=minimum_bonded,json=minimumBonded,proto3" json:"minimum_bonded,omitempty" yaml:"minimum_bonded"`
	MaxIdledBlock              uint64                      `protobuf:"varint,3,opt,name=max_idled_block,json=maxIdledBlock,proto3" json:"max_idled_block,omitempty" yaml:"max_idled_block"`
	TrustedAddresses           []string                    `protobuf:"bytes,4,rep,name=trusted_addresses,json=trustedAddresses,proto3" json:"trusted_addresses,omitempty" yaml:"trusted_addresses"`
	SlashFractionNoKeyshare    cosmossdk_io_math.LegacyDec `protobuf:"bytes,5,opt,name=slash_fraction_no_keyshare,json=slashFractionNoKeyshare,proto3,customtype=cosmossdk.io/math.LegacyDec" json:"slash_fraction_no_keyshare" yaml:"slash_fraction_no_keyshare"`
	SlashFractionWrongKeyshare cosmossdk_io_math.LegacyDec `protobuf:"bytes,6,opt,name=slash_fraction_wrong_keyshare,json=slashFractionWrongKeyshare,proto3,customtype=cosmossdk.io/math.LegacyDec" json:"slash_fraction_wrong_keyshare" yaml:"slash_fraction_wrong_keyshare"`
	AvgBlockTime               float32                     `protobuf:"fixed32,7,opt,name=avg_block_time,json=avgBlockTime,proto3" json:"avg_block_time,omitempty" yaml:"avg_block_time"`
}

func (m *Params) Reset()         { *m = Params{} }
func (m *Params) String() string { return proto.CompactTextString(m) }
func (*Params) ProtoMessage()    {}
func (*Params) Descriptor() ([]byte, []int) {
	return fileDescriptor_09ef7bd565425b36, []int{0}
}
func (m *Params) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *Params) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_Params.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *Params) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Params.Merge(m, src)
}
func (m *Params) XXX_Size() int {
	return m.Size()
}
func (m *Params) XXX_DiscardUnknown() {
	xxx_messageInfo_Params.DiscardUnknown(m)
}

var xxx_messageInfo_Params proto.InternalMessageInfo

func (m *Params) GetKeyExpiry() uint64 {
	if m != nil {
		return m.KeyExpiry
	}
	return 0
}

func (m *Params) GetMinimumBonded() uint64 {
	if m != nil {
		return m.MinimumBonded
	}
	return 0
}

func (m *Params) GetMaxIdledBlock() uint64 {
	if m != nil {
		return m.MaxIdledBlock
	}
	return 0
}

func (m *Params) GetTrustedAddresses() []string {
	if m != nil {
		return m.TrustedAddresses
	}
	return nil
}

func (m *Params) GetAvgBlockTime() float32 {
	if m != nil {
		return m.AvgBlockTime
	}
	return 0
}

func init() {
	proto.RegisterType((*Params)(nil), "fairyring.keyshare.Params")
}

func init() { proto.RegisterFile("fairyring/keyshare/params.proto", fileDescriptor_09ef7bd565425b36) }

var fileDescriptor_09ef7bd565425b36 = []byte{
	// 497 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x8c, 0x52, 0xcb, 0x6e, 0xd3, 0x40,
	0x14, 0xcd, 0xf4, 0x11, 0xd4, 0x51, 0x29, 0xc4, 0xa2, 0x60, 0x02, 0x78, 0x82, 0xc5, 0x22, 0x62,
	0x61, 0x23, 0xc1, 0x86, 0x6e, 0x00, 0x0b, 0x2a, 0xa2, 0x22, 0x84, 0x2c, 0x24, 0x24, 0x36, 0xa3,
	0x89, 0x3d, 0x75, 0x46, 0xce, 0x78, 0xa2, 0x19, 0xa7, 0xc4, 0x1f, 0xc0, 0x86, 0x05, 0xe2, 0x13,
	0x58, 0xf0, 0x01, 0x7c, 0x46, 0x97, 0x5d, 0x22, 0x16, 0x16, 0x4a, 0x16, 0xb0, 0xf6, 0x17, 0x20,
	0x8f, 0x9d, 0x06, 0x03, 0x95, 0xba, 0xb1, 0xee, 0x3d, 0xe7, 0xdc, 0xe3, 0xa3, 0xb9, 0x17, 0xa2,
	0x43, 0xc2, 0x64, 0x26, 0x59, 0x12, 0xb9, 0x31, 0xcd, 0xd4, 0x88, 0x48, 0xea, 0x4e, 0x88, 0x24,
	0x5c, 0x39, 0x13, 0x29, 0x52, 0x61, 0x18, 0xa7, 0x02, 0x67, 0x29, 0xe8, 0x76, 0x08, 0x67, 0x89,
	0x70, 0xf5, 0xb7, 0x92, 0x75, 0xaf, 0x44, 0x22, 0x12, 0xba, 0x74, 0xcb, 0xaa, 0x42, 0xed, 0x2f,
	0x9b, 0xb0, 0xfd, 0x4a, 0xbb, 0x19, 0x0f, 0x20, 0x8c, 0x69, 0x86, 0xe9, 0x6c, 0xc2, 0x64, 0x66,
	0x82, 0x1e, 0xe8, 0x6f, 0x78, 0xbb, 0x45, 0x8e, 0x3a, 0x19, 0xe1, 0xe3, 0x3d, 0x7b, 0xc5, 0xd9,
	0xfe, 0x56, 0x4c, 0xb3, 0x67, 0xba, 0x36, 0x1e, 0xc3, 0x1d, 0xce, 0x12, 0xc6, 0xa7, 0x1c, 0x0f,
	0x45, 0x12, 0xd2, 0xd0, 0x5c, 0xd3, 0x93, 0xd7, 0x8b, 0x1c, 0xed, 0x56, 0x93, 0x4d, 0xde, 0xf6,
	0x2f, 0xd6, 0x80, 0xa7, 0x7b, 0xc3, 0x83, 0x97, 0x38, 0x99, 0x61, 0x16, 0x8e, 0x69, 0x88, 0x87,
	0x63, 0x11, 0xc4, 0xe6, 0xba, 0xb6, 0xe8, 0x16, 0x39, 0xba, 0x5a, 0x5b, 0x34, 0x05, 0xa5, 0x07,
	0x99, 0x0d, 0x4a, 0xc0, 0x2b, 0x7b, 0x63, 0x00, 0x3b, 0xa9, 0x9c, 0xaa, 0x94, 0x86, 0x98, 0x84,
	0xa1, 0xa4, 0x4a, 0x51, 0x65, 0x6e, 0xf4, 0xd6, 0xfb, 0x5b, 0xde, 0xcd, 0x22, 0x47, 0x66, 0xe5,
	0xf2, 0x8f, 0xc4, 0xf6, 0x2f, 0xd7, 0xd8, 0x93, 0x25, 0x64, 0xbc, 0x07, 0xb0, 0xab, 0xc6, 0x44,
	0x8d, 0xf0, 0xa1, 0x24, 0x41, 0xca, 0x44, 0x82, 0x13, 0x81, 0x97, 0x2f, 0x6b, 0x6e, 0xf6, 0x40,
	0x7f, 0xdb, 0x7b, 0x7e, 0x9c, 0xa3, 0xd6, 0xf7, 0x1c, 0xdd, 0x08, 0x84, 0xe2, 0x42, 0xa9, 0x30,
	0x76, 0x98, 0x70, 0x39, 0x49, 0x47, 0xce, 0x0b, 0x1a, 0x91, 0x20, 0x7b, 0x4a, 0x83, 0x22, 0x47,
	0xb7, 0xab, 0xff, 0x9e, 0x6d, 0x67, 0xfb, 0xd7, 0x34, 0xb9, 0x5f, 0x73, 0x2f, 0xc5, 0x41, 0xcd,
	0x18, 0x1f, 0x01, 0xbc, 0xf5, 0xd7, 0xe0, 0x3b, 0x29, 0x92, 0x68, 0x15, 0xa5, 0xad, 0xa3, 0x1c,
	0x9c, 0x2f, 0xca, 0x9d, 0xff, 0x46, 0x69, 0x3a, 0xda, 0x7e, 0xb7, 0x91, 0xe6, 0x4d, 0xc9, 0x9e,
	0x06, 0x7a, 0x04, 0x77, 0xc8, 0x51, 0x54, 0x2d, 0x00, 0xa7, 0x8c, 0x53, 0xf3, 0x42, 0x0f, 0xf4,
	0xd7, 0xfe, 0xdc, 0x74, 0x93, 0xb7, 0xfd, 0x6d, 0x72, 0x14, 0xe9, 0x05, 0xbd, 0x66, 0x9c, 0xee,
	0x3d, 0xfc, 0xf5, 0x19, 0x81, 0x0f, 0x3f, 0xbf, 0xde, 0xbd, 0x17, 0xb1, 0x74, 0x34, 0x1d, 0x3a,
	0x81, 0xe0, 0xee, 0x3e, 0x61, 0x52, 0x8f, 0xb8, 0xab, 0x3b, 0x9f, 0xad, 0x2e, 0xbd, 0xba, 0x4d,
	0x6f, 0x70, 0x3c, 0xb7, 0xc0, 0xc9, 0xdc, 0x02, 0x3f, 0xe6, 0x16, 0xf8, 0xb4, 0xb0, 0x5a, 0x27,
	0x0b, 0xab, 0xf5, 0x6d, 0x61, 0xb5, 0xde, 0xba, 0xe7, 0xf7, 0x4a, 0xb3, 0x09, 0x55, 0xc3, 0xb6,
	0x3e, 0xfc, 0xfb, 0xbf, 0x03, 0x00, 0x00, 0xff, 0xff, 0xb3, 0xa7, 0x9b, 0xa0, 0x58, 0x03, 0x00,
	0x00,
}

func (this *Params) Equal(that interface{}) bool {
	if that == nil {
		return this == nil
	}

	that1, ok := that.(*Params)
	if !ok {
		that2, ok := that.(Params)
		if ok {
			that1 = &that2
		} else {
			return false
		}
	}
	if that1 == nil {
		return this == nil
	} else if this == nil {
		return false
	}
	if this.KeyExpiry != that1.KeyExpiry {
		return false
	}
	if this.MinimumBonded != that1.MinimumBonded {
		return false
	}
	if this.MaxIdledBlock != that1.MaxIdledBlock {
		return false
	}
	if len(this.TrustedAddresses) != len(that1.TrustedAddresses) {
		return false
	}
	for i := range this.TrustedAddresses {
		if this.TrustedAddresses[i] != that1.TrustedAddresses[i] {
			return false
		}
	}
	if !this.SlashFractionNoKeyshare.Equal(that1.SlashFractionNoKeyshare) {
		return false
	}
	if !this.SlashFractionWrongKeyshare.Equal(that1.SlashFractionWrongKeyshare) {
		return false
	}
	if this.AvgBlockTime != that1.AvgBlockTime {
		return false
	}
	return true
}
func (m *Params) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *Params) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *Params) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if m.AvgBlockTime != 0 {
		i -= 4
		encoding_binary.LittleEndian.PutUint32(dAtA[i:], uint32(math.Float32bits(float32(m.AvgBlockTime))))
		i--
		dAtA[i] = 0x3d
	}
	{
		size := m.SlashFractionWrongKeyshare.Size()
		i -= size
		if _, err := m.SlashFractionWrongKeyshare.MarshalTo(dAtA[i:]); err != nil {
			return 0, err
		}
		i = encodeVarintParams(dAtA, i, uint64(size))
	}
	i--
	dAtA[i] = 0x32
	{
		size := m.SlashFractionNoKeyshare.Size()
		i -= size
		if _, err := m.SlashFractionNoKeyshare.MarshalTo(dAtA[i:]); err != nil {
			return 0, err
		}
		i = encodeVarintParams(dAtA, i, uint64(size))
	}
	i--
	dAtA[i] = 0x2a
	if len(m.TrustedAddresses) > 0 {
		for iNdEx := len(m.TrustedAddresses) - 1; iNdEx >= 0; iNdEx-- {
			i -= len(m.TrustedAddresses[iNdEx])
			copy(dAtA[i:], m.TrustedAddresses[iNdEx])
			i = encodeVarintParams(dAtA, i, uint64(len(m.TrustedAddresses[iNdEx])))
			i--
			dAtA[i] = 0x22
		}
	}
	if m.MaxIdledBlock != 0 {
		i = encodeVarintParams(dAtA, i, uint64(m.MaxIdledBlock))
		i--
		dAtA[i] = 0x18
	}
	if m.MinimumBonded != 0 {
		i = encodeVarintParams(dAtA, i, uint64(m.MinimumBonded))
		i--
		dAtA[i] = 0x10
	}
	if m.KeyExpiry != 0 {
		i = encodeVarintParams(dAtA, i, uint64(m.KeyExpiry))
		i--
		dAtA[i] = 0x8
	}
	return len(dAtA) - i, nil
}

func encodeVarintParams(dAtA []byte, offset int, v uint64) int {
	offset -= sovParams(v)
	base := offset
	for v >= 1<<7 {
		dAtA[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	dAtA[offset] = uint8(v)
	return base
}
func (m *Params) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	if m.KeyExpiry != 0 {
		n += 1 + sovParams(uint64(m.KeyExpiry))
	}
	if m.MinimumBonded != 0 {
		n += 1 + sovParams(uint64(m.MinimumBonded))
	}
	if m.MaxIdledBlock != 0 {
		n += 1 + sovParams(uint64(m.MaxIdledBlock))
	}
	if len(m.TrustedAddresses) > 0 {
		for _, s := range m.TrustedAddresses {
			l = len(s)
			n += 1 + l + sovParams(uint64(l))
		}
	}
	l = m.SlashFractionNoKeyshare.Size()
	n += 1 + l + sovParams(uint64(l))
	l = m.SlashFractionWrongKeyshare.Size()
	n += 1 + l + sovParams(uint64(l))
	if m.AvgBlockTime != 0 {
		n += 5
	}
	return n
}

func sovParams(x uint64) (n int) {
	return (math_bits.Len64(x|1) + 6) / 7
}
func sozParams(x uint64) (n int) {
	return sovParams(uint64((x << 1) ^ uint64((int64(x) >> 63))))
}
func (m *Params) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowParams
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
			return fmt.Errorf("proto: Params: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: Params: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field KeyExpiry", wireType)
			}
			m.KeyExpiry = 0
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowParams
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				m.KeyExpiry |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
		case 2:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field MinimumBonded", wireType)
			}
			m.MinimumBonded = 0
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowParams
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				m.MinimumBonded |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
		case 3:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field MaxIdledBlock", wireType)
			}
			m.MaxIdledBlock = 0
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowParams
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				m.MaxIdledBlock |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
		case 4:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field TrustedAddresses", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowParams
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
				return ErrInvalidLengthParams
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthParams
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.TrustedAddresses = append(m.TrustedAddresses, string(dAtA[iNdEx:postIndex]))
			iNdEx = postIndex
		case 5:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field SlashFractionNoKeyshare", wireType)
			}
			var byteLen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowParams
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				byteLen |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if byteLen < 0 {
				return ErrInvalidLengthParams
			}
			postIndex := iNdEx + byteLen
			if postIndex < 0 {
				return ErrInvalidLengthParams
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			if err := m.SlashFractionNoKeyshare.Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		case 6:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field SlashFractionWrongKeyshare", wireType)
			}
			var byteLen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowParams
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				byteLen |= int(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
			if byteLen < 0 {
				return ErrInvalidLengthParams
			}
			postIndex := iNdEx + byteLen
			if postIndex < 0 {
				return ErrInvalidLengthParams
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			if err := m.SlashFractionWrongKeyshare.Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		case 7:
			if wireType != 5 {
				return fmt.Errorf("proto: wrong wireType = %d for field AvgBlockTime", wireType)
			}
			var v uint32
			if (iNdEx + 4) > l {
				return io.ErrUnexpectedEOF
			}
			v = uint32(encoding_binary.LittleEndian.Uint32(dAtA[iNdEx:]))
			iNdEx += 4
			m.AvgBlockTime = float32(math.Float32frombits(v))
		default:
			iNdEx = preIndex
			skippy, err := skipParams(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthParams
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
func skipParams(dAtA []byte) (n int, err error) {
	l := len(dAtA)
	iNdEx := 0
	depth := 0
	for iNdEx < l {
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return 0, ErrIntOverflowParams
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
					return 0, ErrIntOverflowParams
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
					return 0, ErrIntOverflowParams
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
				return 0, ErrInvalidLengthParams
			}
			iNdEx += length
		case 3:
			depth++
		case 4:
			if depth == 0 {
				return 0, ErrUnexpectedEndOfGroupParams
			}
			depth--
		case 5:
			iNdEx += 4
		default:
			return 0, fmt.Errorf("proto: illegal wireType %d", wireType)
		}
		if iNdEx < 0 {
			return 0, ErrInvalidLengthParams
		}
		if depth == 0 {
			return iNdEx, nil
		}
	}
	return 0, io.ErrUnexpectedEOF
}

var (
	ErrInvalidLengthParams        = fmt.Errorf("proto: negative length found during unmarshaling")
	ErrIntOverflowParams          = fmt.Errorf("proto: integer overflow")
	ErrUnexpectedEndOfGroupParams = fmt.Errorf("proto: unexpected end of group")
)
