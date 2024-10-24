// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.3.0
// - protoc             (unknown)
// source: fairyring/keyshare/query.proto

package keyshare

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

const (
	Query_Params_FullMethodName               = "/fairyring.keyshare.Query/Params"
	Query_Commitments_FullMethodName          = "/fairyring.keyshare.Query/Commitments"
	Query_ValidatorSet_FullMethodName         = "/fairyring.keyshare.Query/ValidatorSet"
	Query_ValidatorSetAll_FullMethodName      = "/fairyring.keyshare.Query/ValidatorSetAll"
	Query_Keyshare_FullMethodName             = "/fairyring.keyshare.Query/Keyshare"
	Query_KeyshareAll_FullMethodName          = "/fairyring.keyshare.Query/KeyshareAll"
	Query_DecryptionKey_FullMethodName        = "/fairyring.keyshare.Query/DecryptionKey"
	Query_DecryptionKeyAll_FullMethodName     = "/fairyring.keyshare.Query/DecryptionKeyAll"
	Query_Pubkey_FullMethodName               = "/fairyring.keyshare.Query/Pubkey"
	Query_AuthorizedAddress_FullMethodName    = "/fairyring.keyshare.Query/AuthorizedAddress"
	Query_AuthorizedAddressAll_FullMethodName = "/fairyring.keyshare.Query/AuthorizedAddressAll"
	Query_GeneralKeyshare_FullMethodName      = "/fairyring.keyshare.Query/GeneralKeyshare"
	Query_GeneralKeyshareAll_FullMethodName   = "/fairyring.keyshare.Query/GeneralKeyshareAll"
	Query_VerifiableRandomness_FullMethodName = "/fairyring.keyshare.Query/VerifiableRandomness"
)

// QueryClient is the client API for Query service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type QueryClient interface {
	// Parameters queries the parameters of the module.
	Params(ctx context.Context, in *QueryParamsRequest, opts ...grpc.CallOption) (*QueryParamsResponse, error)
	// Commitments queries the lists of active and queued commitments
	Commitments(ctx context.Context, in *QueryCommitmentsRequest, opts ...grpc.CallOption) (*QueryCommitmentsResponse, error)
	// Queries a ValidatorSet by index.
	ValidatorSet(ctx context.Context, in *QueryValidatorSetRequest, opts ...grpc.CallOption) (*QueryValidatorSetResponse, error)
	// Queries a list of ValidatorSet items.
	ValidatorSetAll(ctx context.Context, in *QueryValidatorSetAllRequest, opts ...grpc.CallOption) (*QueryValidatorSetAllResponse, error)
	// Queries a Keyshare by index.
	Keyshare(ctx context.Context, in *QueryKeyshareRequest, opts ...grpc.CallOption) (*QueryKeyshareResponse, error)
	// Queries a list of Keyshare items.
	KeyshareAll(ctx context.Context, in *QueryKeyshareAllRequest, opts ...grpc.CallOption) (*QueryKeyshareAllResponse, error)
	// DecryptionKey queries a DecryptionKey item by height.
	DecryptionKey(ctx context.Context, in *QueryDecryptionKeyRequest, opts ...grpc.CallOption) (*QueryDecryptionKeyResponse, error)
	// DecryptionKeyAll Queries a list of DecryptionKey items.
	DecryptionKeyAll(ctx context.Context, in *QueryDecryptionKeyAllRequest, opts ...grpc.CallOption) (*QueryDecryptionKeyAllResponse, error)
	// Queries the public keys
	Pubkey(ctx context.Context, in *QueryPubkeyRequest, opts ...grpc.CallOption) (*QueryPubkeyResponse, error)
	// Queries a AuthorizedAddress item by target.
	AuthorizedAddress(ctx context.Context, in *QueryAuthorizedAddressRequest, opts ...grpc.CallOption) (*QueryAuthorizedAddressResponse, error)
	// Queries a list of AuthorizedAddress items
	AuthorizedAddressAll(ctx context.Context, in *QueryAuthorizedAddressAllRequest, opts ...grpc.CallOption) (*QueryAuthorizedAddressAllResponse, error)
	// Queries a GeneralKeyshare item by validator address and identity.
	GeneralKeyshare(ctx context.Context, in *QueryGeneralKeyshareRequest, opts ...grpc.CallOption) (*QueryGeneralKeyshareResponse, error)
	// Queries a list of GeneralKeyshare items
	GeneralKeyshareAll(ctx context.Context, in *QueryGeneralKeyshareAllRequest, opts ...grpc.CallOption) (*QueryGeneralKeyshareAllResponse, error)
	// Queries verifiable randomness
	VerifiableRandomness(ctx context.Context, in *QueryVerifiableRandomnessRequest, opts ...grpc.CallOption) (*QueryVerifiableRandomnessResponse, error)
}

type queryClient struct {
	cc grpc.ClientConnInterface
}

func NewQueryClient(cc grpc.ClientConnInterface) QueryClient {
	return &queryClient{cc}
}

func (c *queryClient) Params(ctx context.Context, in *QueryParamsRequest, opts ...grpc.CallOption) (*QueryParamsResponse, error) {
	out := new(QueryParamsResponse)
	err := c.cc.Invoke(ctx, Query_Params_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *queryClient) Commitments(ctx context.Context, in *QueryCommitmentsRequest, opts ...grpc.CallOption) (*QueryCommitmentsResponse, error) {
	out := new(QueryCommitmentsResponse)
	err := c.cc.Invoke(ctx, Query_Commitments_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *queryClient) ValidatorSet(ctx context.Context, in *QueryValidatorSetRequest, opts ...grpc.CallOption) (*QueryValidatorSetResponse, error) {
	out := new(QueryValidatorSetResponse)
	err := c.cc.Invoke(ctx, Query_ValidatorSet_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *queryClient) ValidatorSetAll(ctx context.Context, in *QueryValidatorSetAllRequest, opts ...grpc.CallOption) (*QueryValidatorSetAllResponse, error) {
	out := new(QueryValidatorSetAllResponse)
	err := c.cc.Invoke(ctx, Query_ValidatorSetAll_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *queryClient) Keyshare(ctx context.Context, in *QueryKeyshareRequest, opts ...grpc.CallOption) (*QueryKeyshareResponse, error) {
	out := new(QueryKeyshareResponse)
	err := c.cc.Invoke(ctx, Query_Keyshare_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *queryClient) KeyshareAll(ctx context.Context, in *QueryKeyshareAllRequest, opts ...grpc.CallOption) (*QueryKeyshareAllResponse, error) {
	out := new(QueryKeyshareAllResponse)
	err := c.cc.Invoke(ctx, Query_KeyshareAll_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *queryClient) DecryptionKey(ctx context.Context, in *QueryDecryptionKeyRequest, opts ...grpc.CallOption) (*QueryDecryptionKeyResponse, error) {
	out := new(QueryDecryptionKeyResponse)
	err := c.cc.Invoke(ctx, Query_DecryptionKey_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *queryClient) DecryptionKeyAll(ctx context.Context, in *QueryDecryptionKeyAllRequest, opts ...grpc.CallOption) (*QueryDecryptionKeyAllResponse, error) {
	out := new(QueryDecryptionKeyAllResponse)
	err := c.cc.Invoke(ctx, Query_DecryptionKeyAll_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *queryClient) Pubkey(ctx context.Context, in *QueryPubkeyRequest, opts ...grpc.CallOption) (*QueryPubkeyResponse, error) {
	out := new(QueryPubkeyResponse)
	err := c.cc.Invoke(ctx, Query_Pubkey_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *queryClient) AuthorizedAddress(ctx context.Context, in *QueryAuthorizedAddressRequest, opts ...grpc.CallOption) (*QueryAuthorizedAddressResponse, error) {
	out := new(QueryAuthorizedAddressResponse)
	err := c.cc.Invoke(ctx, Query_AuthorizedAddress_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *queryClient) AuthorizedAddressAll(ctx context.Context, in *QueryAuthorizedAddressAllRequest, opts ...grpc.CallOption) (*QueryAuthorizedAddressAllResponse, error) {
	out := new(QueryAuthorizedAddressAllResponse)
	err := c.cc.Invoke(ctx, Query_AuthorizedAddressAll_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *queryClient) GeneralKeyshare(ctx context.Context, in *QueryGeneralKeyshareRequest, opts ...grpc.CallOption) (*QueryGeneralKeyshareResponse, error) {
	out := new(QueryGeneralKeyshareResponse)
	err := c.cc.Invoke(ctx, Query_GeneralKeyshare_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *queryClient) GeneralKeyshareAll(ctx context.Context, in *QueryGeneralKeyshareAllRequest, opts ...grpc.CallOption) (*QueryGeneralKeyshareAllResponse, error) {
	out := new(QueryGeneralKeyshareAllResponse)
	err := c.cc.Invoke(ctx, Query_GeneralKeyshareAll_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *queryClient) VerifiableRandomness(ctx context.Context, in *QueryVerifiableRandomnessRequest, opts ...grpc.CallOption) (*QueryVerifiableRandomnessResponse, error) {
	out := new(QueryVerifiableRandomnessResponse)
	err := c.cc.Invoke(ctx, Query_VerifiableRandomness_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// QueryServer is the server API for Query service.
// All implementations must embed UnimplementedQueryServer
// for forward compatibility
type QueryServer interface {
	// Parameters queries the parameters of the module.
	Params(context.Context, *QueryParamsRequest) (*QueryParamsResponse, error)
	// Commitments queries the lists of active and queued commitments
	Commitments(context.Context, *QueryCommitmentsRequest) (*QueryCommitmentsResponse, error)
	// Queries a ValidatorSet by index.
	ValidatorSet(context.Context, *QueryValidatorSetRequest) (*QueryValidatorSetResponse, error)
	// Queries a list of ValidatorSet items.
	ValidatorSetAll(context.Context, *QueryValidatorSetAllRequest) (*QueryValidatorSetAllResponse, error)
	// Queries a Keyshare by index.
	Keyshare(context.Context, *QueryKeyshareRequest) (*QueryKeyshareResponse, error)
	// Queries a list of Keyshare items.
	KeyshareAll(context.Context, *QueryKeyshareAllRequest) (*QueryKeyshareAllResponse, error)
	// DecryptionKey queries a DecryptionKey item by height.
	DecryptionKey(context.Context, *QueryDecryptionKeyRequest) (*QueryDecryptionKeyResponse, error)
	// DecryptionKeyAll Queries a list of DecryptionKey items.
	DecryptionKeyAll(context.Context, *QueryDecryptionKeyAllRequest) (*QueryDecryptionKeyAllResponse, error)
	// Queries the public keys
	Pubkey(context.Context, *QueryPubkeyRequest) (*QueryPubkeyResponse, error)
	// Queries a AuthorizedAddress item by target.
	AuthorizedAddress(context.Context, *QueryAuthorizedAddressRequest) (*QueryAuthorizedAddressResponse, error)
	// Queries a list of AuthorizedAddress items
	AuthorizedAddressAll(context.Context, *QueryAuthorizedAddressAllRequest) (*QueryAuthorizedAddressAllResponse, error)
	// Queries a GeneralKeyshare item by validator address and identity.
	GeneralKeyshare(context.Context, *QueryGeneralKeyshareRequest) (*QueryGeneralKeyshareResponse, error)
	// Queries a list of GeneralKeyshare items
	GeneralKeyshareAll(context.Context, *QueryGeneralKeyshareAllRequest) (*QueryGeneralKeyshareAllResponse, error)
	// Queries verifiable randomness
	VerifiableRandomness(context.Context, *QueryVerifiableRandomnessRequest) (*QueryVerifiableRandomnessResponse, error)
	mustEmbedUnimplementedQueryServer()
}

// UnimplementedQueryServer must be embedded to have forward compatible implementations.
type UnimplementedQueryServer struct {
}

func (UnimplementedQueryServer) Params(context.Context, *QueryParamsRequest) (*QueryParamsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Params not implemented")
}
func (UnimplementedQueryServer) Commitments(context.Context, *QueryCommitmentsRequest) (*QueryCommitmentsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Commitments not implemented")
}
func (UnimplementedQueryServer) ValidatorSet(context.Context, *QueryValidatorSetRequest) (*QueryValidatorSetResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ValidatorSet not implemented")
}
func (UnimplementedQueryServer) ValidatorSetAll(context.Context, *QueryValidatorSetAllRequest) (*QueryValidatorSetAllResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ValidatorSetAll not implemented")
}
func (UnimplementedQueryServer) Keyshare(context.Context, *QueryKeyshareRequest) (*QueryKeyshareResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Keyshare not implemented")
}
func (UnimplementedQueryServer) KeyshareAll(context.Context, *QueryKeyshareAllRequest) (*QueryKeyshareAllResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method KeyshareAll not implemented")
}
func (UnimplementedQueryServer) DecryptionKey(context.Context, *QueryDecryptionKeyRequest) (*QueryDecryptionKeyResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DecryptionKey not implemented")
}
func (UnimplementedQueryServer) DecryptionKeyAll(context.Context, *QueryDecryptionKeyAllRequest) (*QueryDecryptionKeyAllResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DecryptionKeyAll not implemented")
}
func (UnimplementedQueryServer) Pubkey(context.Context, *QueryPubkeyRequest) (*QueryPubkeyResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Pubkey not implemented")
}
func (UnimplementedQueryServer) AuthorizedAddress(context.Context, *QueryAuthorizedAddressRequest) (*QueryAuthorizedAddressResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method AuthorizedAddress not implemented")
}
func (UnimplementedQueryServer) AuthorizedAddressAll(context.Context, *QueryAuthorizedAddressAllRequest) (*QueryAuthorizedAddressAllResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method AuthorizedAddressAll not implemented")
}
func (UnimplementedQueryServer) GeneralKeyshare(context.Context, *QueryGeneralKeyshareRequest) (*QueryGeneralKeyshareResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GeneralKeyshare not implemented")
}
func (UnimplementedQueryServer) GeneralKeyshareAll(context.Context, *QueryGeneralKeyshareAllRequest) (*QueryGeneralKeyshareAllResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GeneralKeyshareAll not implemented")
}
func (UnimplementedQueryServer) VerifiableRandomness(context.Context, *QueryVerifiableRandomnessRequest) (*QueryVerifiableRandomnessResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method VerifiableRandomness not implemented")
}
func (UnimplementedQueryServer) mustEmbedUnimplementedQueryServer() {}

// UnsafeQueryServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to QueryServer will
// result in compilation errors.
type UnsafeQueryServer interface {
	mustEmbedUnimplementedQueryServer()
}

func RegisterQueryServer(s grpc.ServiceRegistrar, srv QueryServer) {
	s.RegisterService(&Query_ServiceDesc, srv)
}

func _Query_Params_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryParamsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QueryServer).Params(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Query_Params_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QueryServer).Params(ctx, req.(*QueryParamsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Query_Commitments_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryCommitmentsRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QueryServer).Commitments(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Query_Commitments_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QueryServer).Commitments(ctx, req.(*QueryCommitmentsRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Query_ValidatorSet_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryValidatorSetRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QueryServer).ValidatorSet(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Query_ValidatorSet_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QueryServer).ValidatorSet(ctx, req.(*QueryValidatorSetRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Query_ValidatorSetAll_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryValidatorSetAllRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QueryServer).ValidatorSetAll(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Query_ValidatorSetAll_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QueryServer).ValidatorSetAll(ctx, req.(*QueryValidatorSetAllRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Query_Keyshare_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryKeyshareRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QueryServer).Keyshare(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Query_Keyshare_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QueryServer).Keyshare(ctx, req.(*QueryKeyshareRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Query_KeyshareAll_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryKeyshareAllRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QueryServer).KeyshareAll(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Query_KeyshareAll_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QueryServer).KeyshareAll(ctx, req.(*QueryKeyshareAllRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Query_DecryptionKey_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryDecryptionKeyRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QueryServer).DecryptionKey(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Query_DecryptionKey_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QueryServer).DecryptionKey(ctx, req.(*QueryDecryptionKeyRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Query_DecryptionKeyAll_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryDecryptionKeyAllRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QueryServer).DecryptionKeyAll(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Query_DecryptionKeyAll_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QueryServer).DecryptionKeyAll(ctx, req.(*QueryDecryptionKeyAllRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Query_Pubkey_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryPubkeyRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QueryServer).Pubkey(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Query_Pubkey_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QueryServer).Pubkey(ctx, req.(*QueryPubkeyRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Query_AuthorizedAddress_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryAuthorizedAddressRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QueryServer).AuthorizedAddress(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Query_AuthorizedAddress_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QueryServer).AuthorizedAddress(ctx, req.(*QueryAuthorizedAddressRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Query_AuthorizedAddressAll_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryAuthorizedAddressAllRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QueryServer).AuthorizedAddressAll(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Query_AuthorizedAddressAll_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QueryServer).AuthorizedAddressAll(ctx, req.(*QueryAuthorizedAddressAllRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Query_GeneralKeyshare_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryGeneralKeyshareRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QueryServer).GeneralKeyshare(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Query_GeneralKeyshare_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QueryServer).GeneralKeyshare(ctx, req.(*QueryGeneralKeyshareRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Query_GeneralKeyshareAll_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryGeneralKeyshareAllRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QueryServer).GeneralKeyshareAll(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Query_GeneralKeyshareAll_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QueryServer).GeneralKeyshareAll(ctx, req.(*QueryGeneralKeyshareAllRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Query_VerifiableRandomness_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(QueryVerifiableRandomnessRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QueryServer).VerifiableRandomness(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Query_VerifiableRandomness_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QueryServer).VerifiableRandomness(ctx, req.(*QueryVerifiableRandomnessRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// Query_ServiceDesc is the grpc.ServiceDesc for Query service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Query_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "fairyring.keyshare.Query",
	HandlerType: (*QueryServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "Params",
			Handler:    _Query_Params_Handler,
		},
		{
			MethodName: "Commitments",
			Handler:    _Query_Commitments_Handler,
		},
		{
			MethodName: "ValidatorSet",
			Handler:    _Query_ValidatorSet_Handler,
		},
		{
			MethodName: "ValidatorSetAll",
			Handler:    _Query_ValidatorSetAll_Handler,
		},
		{
			MethodName: "Keyshare",
			Handler:    _Query_Keyshare_Handler,
		},
		{
			MethodName: "KeyshareAll",
			Handler:    _Query_KeyshareAll_Handler,
		},
		{
			MethodName: "DecryptionKey",
			Handler:    _Query_DecryptionKey_Handler,
		},
		{
			MethodName: "DecryptionKeyAll",
			Handler:    _Query_DecryptionKeyAll_Handler,
		},
		{
			MethodName: "Pubkey",
			Handler:    _Query_Pubkey_Handler,
		},
		{
			MethodName: "AuthorizedAddress",
			Handler:    _Query_AuthorizedAddress_Handler,
		},
		{
			MethodName: "AuthorizedAddressAll",
			Handler:    _Query_AuthorizedAddressAll_Handler,
		},
		{
			MethodName: "GeneralKeyshare",
			Handler:    _Query_GeneralKeyshare_Handler,
		},
		{
			MethodName: "GeneralKeyshareAll",
			Handler:    _Query_GeneralKeyshareAll_Handler,
		},
		{
			MethodName: "VerifiableRandomness",
			Handler:    _Query_VerifiableRandomness_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "fairyring/keyshare/query.proto",
}
