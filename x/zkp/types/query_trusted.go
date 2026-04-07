package types

import (
	"context"
	"fmt"

	grpc1 "github.com/cosmos/gogoproto/grpc"
	proto "github.com/cosmos/gogoproto/proto"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

type QueryTrustedContractsRequest struct{}

func (m *QueryTrustedContractsRequest) Reset()         { *m = QueryTrustedContractsRequest{} }
func (m *QueryTrustedContractsRequest) String() string { return proto.CompactTextString(m) }
func (m *QueryTrustedContractsRequest) ProtoMessage()  {}
func (m *QueryTrustedContractsRequest) Marshal() ([]byte, error)           { return []byte{}, nil }
func (m *QueryTrustedContractsRequest) MarshalTo(data []byte) (int, error) { return 0, nil }
func (m *QueryTrustedContractsRequest) MarshalToSizedBuffer(data []byte) (int, error) {
	return len(data), nil
}
func (m *QueryTrustedContractsRequest) Size() int             { return 0 }
func (m *QueryTrustedContractsRequest) Unmarshal([]byte) error { return nil }

type QueryTrustedContractsResponse struct {
	ContractAddresses []string `protobuf:"bytes,1,rep,name=contract_addresses,json=contractAddresses,proto3" json:"contract_addresses,omitempty"`
}

func (m *QueryTrustedContractsResponse) Reset()         { *m = QueryTrustedContractsResponse{} }
func (m *QueryTrustedContractsResponse) String() string { return proto.CompactTextString(m) }
func (m *QueryTrustedContractsResponse) ProtoMessage()  {}

func (m *QueryTrustedContractsResponse) Marshal() ([]byte, error) {
	size := m.Size()
	buf := make([]byte, size)
	n, err := m.MarshalToSizedBuffer(buf)
	if err != nil {
		return nil, err
	}
	return buf[:n], nil
}

func (m *QueryTrustedContractsResponse) MarshalTo(data []byte) (int, error) {
	size := m.Size()
	return m.MarshalToSizedBuffer(data[:size])
}

func (m *QueryTrustedContractsResponse) MarshalToSizedBuffer(data []byte) (int, error) {
	i := len(data)
	if len(m.ContractAddresses) > 0 {
		for idx := len(m.ContractAddresses) - 1; idx >= 0; idx-- {
			i -= len(m.ContractAddresses[idx])
			copy(data[i:], m.ContractAddresses[idx])
			i = encodeVarint(data, i, uint64(len(m.ContractAddresses[idx])))
			i--
			data[i] = 0x0a
		}
	}
	return len(data) - i, nil
}

func (m *QueryTrustedContractsResponse) Size() int {
	n := 0
	for _, s := range m.ContractAddresses {
		n += 1 + len(s) + sovMsg(uint64(len(s)))
	}
	return n
}

func (m *QueryTrustedContractsResponse) Unmarshal(data []byte) error {
	l := len(data)
	idx := 0
	for idx < l {
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
		if wireType != 2 || fieldNum != 1 {
			return fmt.Errorf("unexpected field %d wire type %d", fieldNum, wireType)
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
		m.ContractAddresses = append(m.ContractAddresses, string(data[idx:idx+int(strLen)]))
		idx += int(strLen)
	}
	return nil
}

type TrustedContractsQueryServer interface {
	TrustedContracts(context.Context, *QueryTrustedContractsRequest) (*QueryTrustedContractsResponse, error)
}

type UnimplementedTrustedContractsQueryServer struct{}

func (*UnimplementedTrustedContractsQueryServer) TrustedContracts(context.Context, *QueryTrustedContractsRequest) (*QueryTrustedContractsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method TrustedContracts not implemented")
}

func RegisterTrustedContractsQueryServer(s grpc1.Server, srv TrustedContractsQueryServer) {
	s.RegisterService(&_TrustedContractsQuery_serviceDesc, srv)
}

func _TrustedContractsQuery_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryTrustedContractsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TrustedContractsQueryServer).TrustedContracts(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/fairyring.zkp.TrustedContractsQuery/TrustedContracts",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TrustedContractsQueryServer).TrustedContracts(ctx, req.(*QueryTrustedContractsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var _TrustedContractsQuery_serviceDesc = grpc.ServiceDesc{
	ServiceName: "fairyring.zkp.TrustedContractsQuery",
	HandlerType: (*TrustedContractsQueryServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "TrustedContracts",
			Handler:    _TrustedContractsQuery_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "fairyring/zkp/tx.proto",
}
