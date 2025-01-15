// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: fairyring/auction/sealed_bid_auction.proto

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

type BidderDetail struct {
	Creator       string `protobuf:"bytes,1,opt,name=creator,proto3" json:"creator,omitempty"`
	BidderAddress string `protobuf:"bytes,2,opt,name=bidder_address,json=bidderAddress,proto3" json:"bidder_address,omitempty"`
}

func (m *BidderDetail) Reset()         { *m = BidderDetail{} }
func (m *BidderDetail) String() string { return proto.CompactTextString(m) }
func (*BidderDetail) ProtoMessage()    {}
func (*BidderDetail) Descriptor() ([]byte, []int) {
	return fileDescriptor_0238fd9a748026c4, []int{0}
}
func (m *BidderDetail) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *BidderDetail) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_BidderDetail.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *BidderDetail) XXX_Merge(src proto.Message) {
	xxx_messageInfo_BidderDetail.Merge(m, src)
}
func (m *BidderDetail) XXX_Size() int {
	return m.Size()
}
func (m *BidderDetail) XXX_DiscardUnknown() {
	xxx_messageInfo_BidderDetail.DiscardUnknown(m)
}

var xxx_messageInfo_BidderDetail proto.InternalMessageInfo

func (m *BidderDetail) GetCreator() string {
	if m != nil {
		return m.Creator
	}
	return ""
}

func (m *BidderDetail) GetBidderAddress() string {
	if m != nil {
		return m.BidderAddress
	}
	return ""
}

type Bid struct {
	Bidder    string `protobuf:"bytes,1,opt,name=bidder,proto3" json:"bidder,omitempty"`
	SealedBid string `protobuf:"bytes,2,opt,name=sealed_bid,json=sealedBid,proto3" json:"sealed_bid,omitempty"`
}

func (m *Bid) Reset()         { *m = Bid{} }
func (m *Bid) String() string { return proto.CompactTextString(m) }
func (*Bid) ProtoMessage()    {}
func (*Bid) Descriptor() ([]byte, []int) {
	return fileDescriptor_0238fd9a748026c4, []int{1}
}
func (m *Bid) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *Bid) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_Bid.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *Bid) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Bid.Merge(m, src)
}
func (m *Bid) XXX_Size() int {
	return m.Size()
}
func (m *Bid) XXX_DiscardUnknown() {
	xxx_messageInfo_Bid.DiscardUnknown(m)
}

var xxx_messageInfo_Bid proto.InternalMessageInfo

func (m *Bid) GetBidder() string {
	if m != nil {
		return m.Bidder
	}
	return ""
}

func (m *Bid) GetSealedBid() string {
	if m != nil {
		return m.SealedBid
	}
	return ""
}

type AuctionDetail struct {
	Creator        string `protobuf:"bytes,1,opt,name=creator,proto3" json:"creator,omitempty"`
	Identity       string `protobuf:"bytes,2,opt,name=identity,proto3" json:"identity,omitempty"`
	Pubkey         string `protobuf:"bytes,3,opt,name=pubkey,proto3" json:"pubkey,omitempty"`
	AuctionId      string `protobuf:"bytes,4,opt,name=auction_id,json=auctionId,proto3" json:"auction_id,omitempty"`
	IsTimedAuction bool   `protobuf:"varint,5,opt,name=is_timed_auction,json=isTimedAuction,proto3" json:"is_timed_auction,omitempty"`
	Bids           []*Bid `protobuf:"bytes,6,rep,name=bids,proto3" json:"bids,omitempty"`
	IsResolved     bool   `protobuf:"varint,7,opt,name=is_resolved,json=isResolved,proto3" json:"is_resolved,omitempty"`
}

func (m *AuctionDetail) Reset()         { *m = AuctionDetail{} }
func (m *AuctionDetail) String() string { return proto.CompactTextString(m) }
func (*AuctionDetail) ProtoMessage()    {}
func (*AuctionDetail) Descriptor() ([]byte, []int) {
	return fileDescriptor_0238fd9a748026c4, []int{2}
}
func (m *AuctionDetail) XXX_Unmarshal(b []byte) error {
	return m.Unmarshal(b)
}
func (m *AuctionDetail) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	if deterministic {
		return xxx_messageInfo_AuctionDetail.Marshal(b, m, deterministic)
	} else {
		b = b[:cap(b)]
		n, err := m.MarshalToSizedBuffer(b)
		if err != nil {
			return nil, err
		}
		return b[:n], nil
	}
}
func (m *AuctionDetail) XXX_Merge(src proto.Message) {
	xxx_messageInfo_AuctionDetail.Merge(m, src)
}
func (m *AuctionDetail) XXX_Size() int {
	return m.Size()
}
func (m *AuctionDetail) XXX_DiscardUnknown() {
	xxx_messageInfo_AuctionDetail.DiscardUnknown(m)
}

var xxx_messageInfo_AuctionDetail proto.InternalMessageInfo

func (m *AuctionDetail) GetCreator() string {
	if m != nil {
		return m.Creator
	}
	return ""
}

func (m *AuctionDetail) GetIdentity() string {
	if m != nil {
		return m.Identity
	}
	return ""
}

func (m *AuctionDetail) GetPubkey() string {
	if m != nil {
		return m.Pubkey
	}
	return ""
}

func (m *AuctionDetail) GetAuctionId() string {
	if m != nil {
		return m.AuctionId
	}
	return ""
}

func (m *AuctionDetail) GetIsTimedAuction() bool {
	if m != nil {
		return m.IsTimedAuction
	}
	return false
}

func (m *AuctionDetail) GetBids() []*Bid {
	if m != nil {
		return m.Bids
	}
	return nil
}

func (m *AuctionDetail) GetIsResolved() bool {
	if m != nil {
		return m.IsResolved
	}
	return false
}

func init() {
	proto.RegisterType((*BidderDetail)(nil), "fairyring.auction.BidderDetail")
	proto.RegisterType((*Bid)(nil), "fairyring.auction.Bid")
	proto.RegisterType((*AuctionDetail)(nil), "fairyring.auction.AuctionDetail")
}

func init() {
	proto.RegisterFile("fairyring/auction/sealed_bid_auction.proto", fileDescriptor_0238fd9a748026c4)
}

var fileDescriptor_0238fd9a748026c4 = []byte{
	// 360 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x84, 0x92, 0xcf, 0x4a, 0xeb, 0x40,
	0x14, 0xc6, 0x9b, 0xdb, 0xde, 0xfe, 0x99, 0xde, 0x96, 0xeb, 0x20, 0x65, 0x28, 0x18, 0x4b, 0x41,
	0x08, 0x5d, 0x24, 0xa0, 0x5b, 0x37, 0x0d, 0x22, 0xba, 0x12, 0x82, 0x2b, 0x37, 0x21, 0x93, 0x19,
	0xe3, 0xa1, 0x69, 0xa7, 0xcc, 0x4c, 0xc5, 0xbc, 0x85, 0x8f, 0xe5, 0xb2, 0x4b, 0x97, 0xd2, 0x3e,
	0x82, 0x2f, 0x20, 0xc9, 0x8c, 0xe9, 0xc2, 0x85, 0xbb, 0x9c, 0xdf, 0x7c, 0x7c, 0xdf, 0xc7, 0xc9,
	0x41, 0xb3, 0xc7, 0x04, 0x64, 0x21, 0x61, 0x95, 0x05, 0xc9, 0x26, 0xd5, 0x20, 0x56, 0x81, 0xe2,
	0x49, 0xce, 0x59, 0x4c, 0x81, 0xc5, 0x16, 0xf9, 0x6b, 0x29, 0xb4, 0xc0, 0x47, 0xb5, 0xd6, 0xb7,
	0x0f, 0xe3, 0xe3, 0x4c, 0x64, 0xa2, 0x7a, 0x0d, 0xca, 0x2f, 0x23, 0x9c, 0xde, 0xa1, 0x7f, 0x21,
	0x30, 0xc6, 0xe5, 0x15, 0xd7, 0x09, 0xe4, 0x98, 0xa0, 0x4e, 0x2a, 0x79, 0xa2, 0x85, 0x24, 0xce,
	0xc4, 0xf1, 0x7a, 0xd1, 0xf7, 0x88, 0xcf, 0xd0, 0x90, 0x56, 0xca, 0x38, 0x61, 0x4c, 0x72, 0xa5,
	0xc8, 0x9f, 0x4a, 0x30, 0x30, 0x74, 0x6e, 0xe0, 0xf4, 0x12, 0x35, 0x43, 0x60, 0x78, 0x84, 0xda,
	0x86, 0x5b, 0x1b, 0x3b, 0xe1, 0x13, 0x84, 0x0e, 0xa5, 0xad, 0x43, 0xcf, 0x90, 0x10, 0xd8, 0xf4,
	0xd3, 0x41, 0x83, 0xb9, 0x29, 0xfc, 0x6b, 0xa1, 0x31, 0xea, 0x02, 0xe3, 0x2b, 0x0d, 0xba, 0xb0,
	0x46, 0xf5, 0x5c, 0xc6, 0xaf, 0x37, 0x74, 0xc1, 0x0b, 0xd2, 0x34, 0xf1, 0x66, 0x2a, 0xe3, 0xed,
	0x3e, 0x62, 0x60, 0xa4, 0x65, 0xe2, 0x2d, 0xb9, 0x65, 0xd8, 0x43, 0xff, 0x41, 0xc5, 0x1a, 0x96,
	0xbc, 0x5e, 0x28, 0xf9, 0x3b, 0x71, 0xbc, 0x6e, 0x34, 0x04, 0x75, 0x5f, 0x62, 0x5b, 0x0e, 0xcf,
	0x50, 0x8b, 0x02, 0x53, 0xa4, 0x3d, 0x69, 0x7a, 0xfd, 0xf3, 0x91, 0xff, 0x63, 0xdf, 0x7e, 0x08,
	0x2c, 0xaa, 0x34, 0xf8, 0x14, 0xf5, 0x41, 0xc5, 0x92, 0x2b, 0x91, 0x3f, 0x73, 0x46, 0x3a, 0x95,
	0x21, 0x02, 0x15, 0x59, 0x12, 0xde, 0xbc, 0xed, 0x5c, 0x67, 0xbb, 0x73, 0x9d, 0x8f, 0x9d, 0xeb,
	0xbc, 0xee, 0xdd, 0xc6, 0x76, 0xef, 0x36, 0xde, 0xf7, 0x6e, 0xe3, 0xc1, 0xcf, 0x40, 0x3f, 0x6d,
	0xa8, 0x9f, 0x8a, 0x65, 0x70, 0x9d, 0x80, 0xa4, 0xb9, 0x48, 0x17, 0xc1, 0xe1, 0x10, 0x5e, 0xea,
	0x53, 0xd0, 0xc5, 0x9a, 0x2b, 0xda, 0xae, 0xfe, 0xea, 0xc5, 0x57, 0x00, 0x00, 0x00, 0xff, 0xff,
	0xe9, 0x64, 0x6a, 0x21, 0x2c, 0x02, 0x00, 0x00,
}

func (m *BidderDetail) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *BidderDetail) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *BidderDetail) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if len(m.BidderAddress) > 0 {
		i -= len(m.BidderAddress)
		copy(dAtA[i:], m.BidderAddress)
		i = encodeVarintSealedBidAuction(dAtA, i, uint64(len(m.BidderAddress)))
		i--
		dAtA[i] = 0x12
	}
	if len(m.Creator) > 0 {
		i -= len(m.Creator)
		copy(dAtA[i:], m.Creator)
		i = encodeVarintSealedBidAuction(dAtA, i, uint64(len(m.Creator)))
		i--
		dAtA[i] = 0xa
	}
	return len(dAtA) - i, nil
}

func (m *Bid) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *Bid) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *Bid) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if len(m.SealedBid) > 0 {
		i -= len(m.SealedBid)
		copy(dAtA[i:], m.SealedBid)
		i = encodeVarintSealedBidAuction(dAtA, i, uint64(len(m.SealedBid)))
		i--
		dAtA[i] = 0x12
	}
	if len(m.Bidder) > 0 {
		i -= len(m.Bidder)
		copy(dAtA[i:], m.Bidder)
		i = encodeVarintSealedBidAuction(dAtA, i, uint64(len(m.Bidder)))
		i--
		dAtA[i] = 0xa
	}
	return len(dAtA) - i, nil
}

func (m *AuctionDetail) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}

func (m *AuctionDetail) MarshalTo(dAtA []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(dAtA[:size])
}

func (m *AuctionDetail) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if m.IsResolved {
		i--
		if m.IsResolved {
			dAtA[i] = 1
		} else {
			dAtA[i] = 0
		}
		i--
		dAtA[i] = 0x38
	}
	if len(m.Bids) > 0 {
		for iNdEx := len(m.Bids) - 1; iNdEx >= 0; iNdEx-- {
			{
				size, err := m.Bids[iNdEx].MarshalToSizedBuffer(dAtA[:i])
				if err != nil {
					return 0, err
				}
				i -= size
				i = encodeVarintSealedBidAuction(dAtA, i, uint64(size))
			}
			i--
			dAtA[i] = 0x32
		}
	}
	if m.IsTimedAuction {
		i--
		if m.IsTimedAuction {
			dAtA[i] = 1
		} else {
			dAtA[i] = 0
		}
		i--
		dAtA[i] = 0x28
	}
	if len(m.AuctionId) > 0 {
		i -= len(m.AuctionId)
		copy(dAtA[i:], m.AuctionId)
		i = encodeVarintSealedBidAuction(dAtA, i, uint64(len(m.AuctionId)))
		i--
		dAtA[i] = 0x22
	}
	if len(m.Pubkey) > 0 {
		i -= len(m.Pubkey)
		copy(dAtA[i:], m.Pubkey)
		i = encodeVarintSealedBidAuction(dAtA, i, uint64(len(m.Pubkey)))
		i--
		dAtA[i] = 0x1a
	}
	if len(m.Identity) > 0 {
		i -= len(m.Identity)
		copy(dAtA[i:], m.Identity)
		i = encodeVarintSealedBidAuction(dAtA, i, uint64(len(m.Identity)))
		i--
		dAtA[i] = 0x12
	}
	if len(m.Creator) > 0 {
		i -= len(m.Creator)
		copy(dAtA[i:], m.Creator)
		i = encodeVarintSealedBidAuction(dAtA, i, uint64(len(m.Creator)))
		i--
		dAtA[i] = 0xa
	}
	return len(dAtA) - i, nil
}

func encodeVarintSealedBidAuction(dAtA []byte, offset int, v uint64) int {
	offset -= sovSealedBidAuction(v)
	base := offset
	for v >= 1<<7 {
		dAtA[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	dAtA[offset] = uint8(v)
	return base
}
func (m *BidderDetail) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = len(m.Creator)
	if l > 0 {
		n += 1 + l + sovSealedBidAuction(uint64(l))
	}
	l = len(m.BidderAddress)
	if l > 0 {
		n += 1 + l + sovSealedBidAuction(uint64(l))
	}
	return n
}

func (m *Bid) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = len(m.Bidder)
	if l > 0 {
		n += 1 + l + sovSealedBidAuction(uint64(l))
	}
	l = len(m.SealedBid)
	if l > 0 {
		n += 1 + l + sovSealedBidAuction(uint64(l))
	}
	return n
}

func (m *AuctionDetail) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = len(m.Creator)
	if l > 0 {
		n += 1 + l + sovSealedBidAuction(uint64(l))
	}
	l = len(m.Identity)
	if l > 0 {
		n += 1 + l + sovSealedBidAuction(uint64(l))
	}
	l = len(m.Pubkey)
	if l > 0 {
		n += 1 + l + sovSealedBidAuction(uint64(l))
	}
	l = len(m.AuctionId)
	if l > 0 {
		n += 1 + l + sovSealedBidAuction(uint64(l))
	}
	if m.IsTimedAuction {
		n += 2
	}
	if len(m.Bids) > 0 {
		for _, e := range m.Bids {
			l = e.Size()
			n += 1 + l + sovSealedBidAuction(uint64(l))
		}
	}
	if m.IsResolved {
		n += 2
	}
	return n
}

func sovSealedBidAuction(x uint64) (n int) {
	return (math_bits.Len64(x|1) + 6) / 7
}
func sozSealedBidAuction(x uint64) (n int) {
	return sovSealedBidAuction(uint64((x << 1) ^ uint64((int64(x) >> 63))))
}
func (m *BidderDetail) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowSealedBidAuction
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
			return fmt.Errorf("proto: BidderDetail: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: BidderDetail: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Creator", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowSealedBidAuction
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
				return ErrInvalidLengthSealedBidAuction
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthSealedBidAuction
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Creator = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field BidderAddress", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowSealedBidAuction
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
				return ErrInvalidLengthSealedBidAuction
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthSealedBidAuction
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.BidderAddress = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipSealedBidAuction(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthSealedBidAuction
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
func (m *Bid) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowSealedBidAuction
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
			return fmt.Errorf("proto: Bid: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: Bid: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Bidder", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowSealedBidAuction
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
				return ErrInvalidLengthSealedBidAuction
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthSealedBidAuction
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Bidder = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field SealedBid", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowSealedBidAuction
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
				return ErrInvalidLengthSealedBidAuction
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthSealedBidAuction
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.SealedBid = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		default:
			iNdEx = preIndex
			skippy, err := skipSealedBidAuction(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthSealedBidAuction
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
func (m *AuctionDetail) Unmarshal(dAtA []byte) error {
	l := len(dAtA)
	iNdEx := 0
	for iNdEx < l {
		preIndex := iNdEx
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return ErrIntOverflowSealedBidAuction
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
			return fmt.Errorf("proto: AuctionDetail: wiretype end group for non-group")
		}
		if fieldNum <= 0 {
			return fmt.Errorf("proto: AuctionDetail: illegal tag %d (wire type %d)", fieldNum, wire)
		}
		switch fieldNum {
		case 1:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Creator", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowSealedBidAuction
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
				return ErrInvalidLengthSealedBidAuction
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthSealedBidAuction
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Creator = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 2:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Identity", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowSealedBidAuction
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
				return ErrInvalidLengthSealedBidAuction
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthSealedBidAuction
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Identity = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 3:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Pubkey", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowSealedBidAuction
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
				return ErrInvalidLengthSealedBidAuction
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthSealedBidAuction
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Pubkey = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 4:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field AuctionId", wireType)
			}
			var stringLen uint64
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowSealedBidAuction
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
				return ErrInvalidLengthSealedBidAuction
			}
			postIndex := iNdEx + intStringLen
			if postIndex < 0 {
				return ErrInvalidLengthSealedBidAuction
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.AuctionId = string(dAtA[iNdEx:postIndex])
			iNdEx = postIndex
		case 5:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field IsTimedAuction", wireType)
			}
			var v int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowSealedBidAuction
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
			m.IsTimedAuction = bool(v != 0)
		case 6:
			if wireType != 2 {
				return fmt.Errorf("proto: wrong wireType = %d for field Bids", wireType)
			}
			var msglen int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowSealedBidAuction
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
				return ErrInvalidLengthSealedBidAuction
			}
			postIndex := iNdEx + msglen
			if postIndex < 0 {
				return ErrInvalidLengthSealedBidAuction
			}
			if postIndex > l {
				return io.ErrUnexpectedEOF
			}
			m.Bids = append(m.Bids, &Bid{})
			if err := m.Bids[len(m.Bids)-1].Unmarshal(dAtA[iNdEx:postIndex]); err != nil {
				return err
			}
			iNdEx = postIndex
		case 7:
			if wireType != 0 {
				return fmt.Errorf("proto: wrong wireType = %d for field IsResolved", wireType)
			}
			var v int
			for shift := uint(0); ; shift += 7 {
				if shift >= 64 {
					return ErrIntOverflowSealedBidAuction
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
			m.IsResolved = bool(v != 0)
		default:
			iNdEx = preIndex
			skippy, err := skipSealedBidAuction(dAtA[iNdEx:])
			if err != nil {
				return err
			}
			if (skippy < 0) || (iNdEx+skippy) < 0 {
				return ErrInvalidLengthSealedBidAuction
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
func skipSealedBidAuction(dAtA []byte) (n int, err error) {
	l := len(dAtA)
	iNdEx := 0
	depth := 0
	for iNdEx < l {
		var wire uint64
		for shift := uint(0); ; shift += 7 {
			if shift >= 64 {
				return 0, ErrIntOverflowSealedBidAuction
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
					return 0, ErrIntOverflowSealedBidAuction
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
					return 0, ErrIntOverflowSealedBidAuction
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
				return 0, ErrInvalidLengthSealedBidAuction
			}
			iNdEx += length
		case 3:
			depth++
		case 4:
			if depth == 0 {
				return 0, ErrUnexpectedEndOfGroupSealedBidAuction
			}
			depth--
		case 5:
			iNdEx += 4
		default:
			return 0, fmt.Errorf("proto: illegal wireType %d", wireType)
		}
		if iNdEx < 0 {
			return 0, ErrInvalidLengthSealedBidAuction
		}
		if depth == 0 {
			return iNdEx, nil
		}
	}
	return 0, io.ErrUnexpectedEOF
}

var (
	ErrInvalidLengthSealedBidAuction        = fmt.Errorf("proto: negative length found during unmarshaling")
	ErrIntOverflowSealedBidAuction          = fmt.Errorf("proto: integer overflow")
	ErrUnexpectedEndOfGroupSealedBidAuction = fmt.Errorf("proto: unexpected end of group")
)