// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: fairyring/keyshare/decryption_key.proto

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

// Decryption key defines the structure and height for a decryption key
type DecryptionKey struct {
	Height uint64 `protobuf:"varint,1,opt,name=height,proto3" json:"height,omitempty"`
	Data   string `protobuf:"bytes,2,opt,name=data,proto3" json:"data,omitempty"`
}

func (m *DecryptionKey) Reset()         { *m = DecryptionKey{} }
func (m *DecryptionKey) String() string { return proto.CompactTextString(m) }
func (*DecryptionKey) ProtoMessage()    {}
func (*DecryptionKey) Descriptor() ([]byte, []int) {
	return fileDescriptor_e56832c246acc99a, []int{0}
}
func (m *DecryptionKey) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *DecryptionKey) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_DecryptionKey.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *DecryptionKey) XXX_Merge(src proto.Message) {
	xxx_messageInfo_DecryptionKey.Merge(m, src)
}
func (m *DecryptionKey) XXX_Size() int {
	return m.Size()
}
func (m *DecryptionKey) XXX_DiscardUnknown() {
	xxx_messageInfo_DecryptionKey.DiscardUnknown(m)
}

var xxx_messageInfo_DecryptionKey proto.InternalMessageInfo

func (m *DecryptionKey) GetHeight() uint64 {
	if m != nil {
		return m.Height
	}
	return 0
}

func (m *DecryptionKey) GetData() string {
	if m != nil {
		return m.Data
	}
	return ""
}

func init() {
	proto.RegisterType((*DecryptionKey)(nil), "fairyring.keyshare.DecryptionKey")
}

func init() {
	proto.RegisterFile("fairyring/keyshare/decryption_key.proto", fileDescriptor_e56832c246acc99a)
}

var fileDescriptor_e56832c246acc99a = []byte{
	// 184 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0x52, 0x4f, 0x4b, 0xcc, 0x2c,
	0xaa, 0x2c, 0xca, 0xcc, 0x4b, 0xd7, 0xcf, 0x4e, 0xad, 0x2c, 0xce, 0x48, 0x2c, 0x4a, 0xd5, 0x4f,
	0x49, 0x4d, 0x2e, 0xaa, 0x2c, 0x28, 0xc9, 0xcc, 0xcf, 0x8b, 0xcf, 0x4e, 0xad, 0xd4, 0x2b, 0x28,
	0xca, 0x2f, 0xc9, 0x17, 0x12, 0x82, 0x2b, 0xd4, 0x83, 0x29, 0x54, 0xb2, 0xe6, 0xe2, 0x75, 0x81,
	0xab, 0xf5, 0x4e, 0xad, 0x14, 0x12, 0xe3, 0x62, 0xcb, 0x48, 0xcd, 0x4c, 0xcf, 0x28, 0x91, 0x60,
	0x54, 0x60, 0xd4, 0x60, 0x09, 0x82, 0xf2, 0x84, 0x84, 0xb8, 0x58, 0x52, 0x12, 0x4b, 0x12, 0x25,
	0x98, 0x14, 0x18, 0x35, 0x38, 0x83, 0xc0, 0x6c, 0x27, 0xcf, 0x13, 0x8f, 0xe4, 0x18, 0x2f, 0x3c,
	0x92, 0x63, 0x7c, 0xf0, 0x48, 0x8e, 0x71, 0xc2, 0x63, 0x39, 0x86, 0x0b, 0x8f, 0xe5, 0x18, 0x6e,
	0x3c, 0x96, 0x63, 0x88, 0xd2, 0x4f, 0xcf, 0x2c, 0xc9, 0x28, 0x4d, 0xd2, 0x4b, 0xce, 0xcf, 0xd5,
	0x77, 0x4b, 0xcc, 0x2c, 0x4a, 0xca, 0xc9, 0x4f, 0xce, 0xd6, 0x47, 0x38, 0xb4, 0x02, 0xe1, 0xd4,
	0x92, 0xca, 0x82, 0xd4, 0xe2, 0x24, 0x36, 0xb0, 0x13, 0x8d, 0x01, 0x01, 0x00, 0x00, 0xff, 0xff,
	0x3d, 0xe7, 0x93, 0x1c, 0xcd, 0x00, 0x00, 0x00,
}

func (m *DecryptionKey) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *DecryptionKey) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *DecryptionKey) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if len(m.Data) > 0 {
		i -= len(m.Data)
		copy(dAtA[i:], m.Data)
		i = encodeVarintDecryptionKey(dAtA, i, uint64(len(m.Data)))
		i--
		dAtA[i] = 0x12
	}
	if m.Height != 0 {
		i = encodeVarintDecryptionKey(dAtA, i, uint64(m.Height))
		i--
		dAtA[i] = 0x8
	}
	return len(dAtA) - i, nil
}

func encodeVarintDecryptionKey(dAtA []byte, offset int, v uint64) int {
	offset -= sovDecryptionKey(v)
	base := offset
	for v >= 1<<7 {
		dAtA[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	dAtA[offset] = uint8(v)
	return base
}
func (m *DecryptionKey) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	if m.Height != 0 {
		n += 1 + sovDecryptionKey(uint64(m.Height))
	}
	l = len(m.Data)
	if l > 0 {
		n += 1 + l + sovDecryptionKey(uint64(l))
	}
	return n
}

func sovDecryptionKey(x uint64) (n int) {
	return (math_bits.Len64(x|1) + 6) / 7
}
func sozDecryptionKey(x uint64) (n int) {
	return sovDecryptionKey(uint64((x << 1) ^ uint64((int64(x) >> 63))))
}
func (m *DecryptionKey) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowDecryptionKey
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
			return fmt.Errorf("proto: DecryptionKey: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: DecryptionKey: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field Height", wireType)
			}
			m.Height = 0
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowDecryptionKey
				}
				if iNdEx >= l {
					return io.ErrUnexpectedEOF
				}
				b := dAtA[iNdEx]
				iNdEx++
				m.Height |= uint64(b&0x7F) << shift
				if b < 0x80 {
					break
				}
			}
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Data", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowDecryptionKey
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
				return ErrInvalidLengthDecryptionKey
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthDecryptionKey
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Data = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipDecryptionKey(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthDecryptionKey
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
func skipDecryptionKey(dAtA []byte) (n int, err error) {
	l := len(dAtA)
	iNdEx := 0
	depth := 0
	for iNdEx < l {
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return 0, ErrIntOverflowDecryptionKey
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
					return 0, ErrIntOverflowDecryptionKey
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
					return 0, ErrIntOverflowDecryptionKey
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
				return 0, ErrInvalidLengthDecryptionKey
			}
			iNdEx += length
		case 3:
			depth++
		case 4:
			if depth == 0 {
				return 0, ErrUnexpectedEndOfGroupDecryptionKey
			}
			depth--
		case 5:
			iNdEx += 4
		default:
			return 0, fmt.Errorf("proto: illegal wireType %d", wireType)
		}
		if iNdEx < 0 {
			return 0, ErrInvalidLengthDecryptionKey
		}
		if depth == 0 {
			return iNdEx, nil
		}
	}
	return 0, io.ErrUnexpectedEOF
}

var (
	ErrInvalidLengthDecryptionKey        = fmt.Errorf("proto: negative length found during unmarshaling")
	ErrIntOverflowDecryptionKey          = fmt.Errorf("proto: integer overflow")
	ErrUnexpectedEndOfGroupDecryptionKey = fmt.Errorf("proto: unexpected end of group")
)
