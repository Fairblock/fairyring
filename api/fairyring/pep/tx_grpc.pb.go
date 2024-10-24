// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.3.0
// - protoc             (unknown)
// source: fairyring/pep/tx.proto

package pep

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
	Msg_UpdateParams_FullMethodName                = "/fairyring.pep.Msg/UpdateParams"
	Msg_SubmitEncryptedTx_FullMethodName           = "/fairyring.pep.Msg/SubmitEncryptedTx"
	Msg_SubmitGeneralEncryptedTx_FullMethodName    = "/fairyring.pep.Msg/SubmitGeneralEncryptedTx"
	Msg_SubmitDecryptionKey_FullMethodName         = "/fairyring.pep.Msg/SubmitDecryptionKey"
	Msg_RequestGeneralIdentity_FullMethodName      = "/fairyring.pep.Msg/RequestGeneralIdentity"
	Msg_RequestGeneralDecryptionKey_FullMethodName = "/fairyring.pep.Msg/RequestGeneralDecryptionKey"
	Msg_RequestPrivateIdentity_FullMethodName      = "/fairyring.pep.Msg/RequestPrivateIdentity"
	Msg_RequestPrivateDecryptionKey_FullMethodName = "/fairyring.pep.Msg/RequestPrivateDecryptionKey"
	Msg_RegisterContract_FullMethodName            = "/fairyring.pep.Msg/RegisterContract"
	Msg_UnregisterContract_FullMethodName          = "/fairyring.pep.Msg/UnregisterContract"
)

// MsgClient is the client API for Msg service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type MsgClient interface {
	// UpdateParams defines a (governance) operation for updating the module
	// parameters. The authority defaults to the x/gov module account.
	UpdateParams(ctx context.Context, in *MsgUpdateParams, opts ...grpc.CallOption) (*MsgUpdateParamsResponse, error)
	// SubmitEncryptedTx defines an operation to submit an
	// encrypted transaction for a particular target block height
	SubmitEncryptedTx(ctx context.Context, in *MsgSubmitEncryptedTx, opts ...grpc.CallOption) (*MsgSubmitEncryptedTxResponse, error)
	// SubmitGeneralEncryptedTx defines an operation to submit an
	// encrypted transaction for a particular identity
	SubmitGeneralEncryptedTx(ctx context.Context, in *MsgSubmitGeneralEncryptedTx, opts ...grpc.CallOption) (*MsgSubmitGeneralEncryptedTxResponse, error)
	// SubmitDecryptionKey defines an operation to submit a
	// decryption to a destination chain
	SubmitDecryptionKey(ctx context.Context, in *MsgSubmitDecryptionKey, opts ...grpc.CallOption) (*MsgSubmitDecryptionKeyResponse, error)
	// RequestGeneralIdentity defines an operation to request the
	// creation of a new identity to which validators will be required
	// to submit keyshares
	RequestGeneralIdentity(ctx context.Context, in *MsgRequestGeneralIdentity, opts ...grpc.CallOption) (*MsgRequestGeneralIdentityResponse, error)
	// RequestGeneralDecryptionKey defines an operation to signal validators to start
	// submitting keyshares for a particular identity
	RequestGeneralDecryptionKey(ctx context.Context, in *MsgRequestGeneralDecryptionKey, opts ...grpc.CallOption) (*MsgRequestGeneralDecryptionKeyResponse, error)
	// RequestPrivateIdentity defines an operation to request the
	// creation of a new identity to which validators will be required
	// to submit encrypted keyshares
	RequestPrivateIdentity(ctx context.Context, in *MsgRequestPrivateIdentity, opts ...grpc.CallOption) (*MsgRequestPrivateIdentityResponse, error)
	// RequestPrivateDecryptionKey defines an operation to signal validators to start
	// submitting encrypted keyshares for a particular identity
	RequestPrivateDecryptionKey(ctx context.Context, in *MsgRequestPrivateDecryptionKey, opts ...grpc.CallOption) (*MsgRequestPrivateDecryptionKeyResponse, error)
	// RegisterContract defines an operation to make an instantiated
	// contract eligible to be automatically executed when a particular
	// identity has decryption key available for it
	RegisterContract(ctx context.Context, in *MsgRegisterContract, opts ...grpc.CallOption) (*MsgRegisterContractResponse, error)
	// UnregisterContract defines an operation to remove a registered contract
	// from the list of contracts set to be automatically executed when
	// decryption key is available for a particular identity
	UnregisterContract(ctx context.Context, in *MsgUnregisterContract, opts ...grpc.CallOption) (*MsgUnregisterContractResponse, error)
}

type msgClient struct {
	cc grpc.ClientConnInterface
}

func NewMsgClient(cc grpc.ClientConnInterface) MsgClient {
	return &msgClient{cc}
}

func (c *msgClient) UpdateParams(ctx context.Context, in *MsgUpdateParams, opts ...grpc.CallOption) (*MsgUpdateParamsResponse, error) {
	out := new(MsgUpdateParamsResponse)
	err := c.cc.Invoke(ctx, Msg_UpdateParams_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *msgClient) SubmitEncryptedTx(ctx context.Context, in *MsgSubmitEncryptedTx, opts ...grpc.CallOption) (*MsgSubmitEncryptedTxResponse, error) {
	out := new(MsgSubmitEncryptedTxResponse)
	err := c.cc.Invoke(ctx, Msg_SubmitEncryptedTx_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *msgClient) SubmitGeneralEncryptedTx(ctx context.Context, in *MsgSubmitGeneralEncryptedTx, opts ...grpc.CallOption) (*MsgSubmitGeneralEncryptedTxResponse, error) {
	out := new(MsgSubmitGeneralEncryptedTxResponse)
	err := c.cc.Invoke(ctx, Msg_SubmitGeneralEncryptedTx_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *msgClient) SubmitDecryptionKey(ctx context.Context, in *MsgSubmitDecryptionKey, opts ...grpc.CallOption) (*MsgSubmitDecryptionKeyResponse, error) {
	out := new(MsgSubmitDecryptionKeyResponse)
	err := c.cc.Invoke(ctx, Msg_SubmitDecryptionKey_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *msgClient) RequestGeneralIdentity(ctx context.Context, in *MsgRequestGeneralIdentity, opts ...grpc.CallOption) (*MsgRequestGeneralIdentityResponse, error) {
	out := new(MsgRequestGeneralIdentityResponse)
	err := c.cc.Invoke(ctx, Msg_RequestGeneralIdentity_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *msgClient) RequestGeneralDecryptionKey(ctx context.Context, in *MsgRequestGeneralDecryptionKey, opts ...grpc.CallOption) (*MsgRequestGeneralDecryptionKeyResponse, error) {
	out := new(MsgRequestGeneralDecryptionKeyResponse)
	err := c.cc.Invoke(ctx, Msg_RequestGeneralDecryptionKey_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *msgClient) RequestPrivateIdentity(ctx context.Context, in *MsgRequestPrivateIdentity, opts ...grpc.CallOption) (*MsgRequestPrivateIdentityResponse, error) {
	out := new(MsgRequestPrivateIdentityResponse)
	err := c.cc.Invoke(ctx, Msg_RequestPrivateIdentity_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *msgClient) RequestPrivateDecryptionKey(ctx context.Context, in *MsgRequestPrivateDecryptionKey, opts ...grpc.CallOption) (*MsgRequestPrivateDecryptionKeyResponse, error) {
	out := new(MsgRequestPrivateDecryptionKeyResponse)
	err := c.cc.Invoke(ctx, Msg_RequestPrivateDecryptionKey_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *msgClient) RegisterContract(ctx context.Context, in *MsgRegisterContract, opts ...grpc.CallOption) (*MsgRegisterContractResponse, error) {
	out := new(MsgRegisterContractResponse)
	err := c.cc.Invoke(ctx, Msg_RegisterContract_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *msgClient) UnregisterContract(ctx context.Context, in *MsgUnregisterContract, opts ...grpc.CallOption) (*MsgUnregisterContractResponse, error) {
	out := new(MsgUnregisterContractResponse)
	err := c.cc.Invoke(ctx, Msg_UnregisterContract_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// MsgServer is the server API for Msg service.
// All implementations must embed UnimplementedMsgServer
// for forward compatibility
type MsgServer interface {
	// UpdateParams defines a (governance) operation for updating the module
	// parameters. The authority defaults to the x/gov module account.
	UpdateParams(context.Context, *MsgUpdateParams) (*MsgUpdateParamsResponse, error)
	// SubmitEncryptedTx defines an operation to submit an
	// encrypted transaction for a particular target block height
	SubmitEncryptedTx(context.Context, *MsgSubmitEncryptedTx) (*MsgSubmitEncryptedTxResponse, error)
	// SubmitGeneralEncryptedTx defines an operation to submit an
	// encrypted transaction for a particular identity
	SubmitGeneralEncryptedTx(context.Context, *MsgSubmitGeneralEncryptedTx) (*MsgSubmitGeneralEncryptedTxResponse, error)
	// SubmitDecryptionKey defines an operation to submit a
	// decryption to a destination chain
	SubmitDecryptionKey(context.Context, *MsgSubmitDecryptionKey) (*MsgSubmitDecryptionKeyResponse, error)
	// RequestGeneralIdentity defines an operation to request the
	// creation of a new identity to which validators will be required
	// to submit keyshares
	RequestGeneralIdentity(context.Context, *MsgRequestGeneralIdentity) (*MsgRequestGeneralIdentityResponse, error)
	// RequestGeneralDecryptionKey defines an operation to signal validators to start
	// submitting keyshares for a particular identity
	RequestGeneralDecryptionKey(context.Context, *MsgRequestGeneralDecryptionKey) (*MsgRequestGeneralDecryptionKeyResponse, error)
	// RequestPrivateIdentity defines an operation to request the
	// creation of a new identity to which validators will be required
	// to submit encrypted keyshares
	RequestPrivateIdentity(context.Context, *MsgRequestPrivateIdentity) (*MsgRequestPrivateIdentityResponse, error)
	// RequestPrivateDecryptionKey defines an operation to signal validators to start
	// submitting encrypted keyshares for a particular identity
	RequestPrivateDecryptionKey(context.Context, *MsgRequestPrivateDecryptionKey) (*MsgRequestPrivateDecryptionKeyResponse, error)
	// RegisterContract defines an operation to make an instantiated
	// contract eligible to be automatically executed when a particular
	// identity has decryption key available for it
	RegisterContract(context.Context, *MsgRegisterContract) (*MsgRegisterContractResponse, error)
	// UnregisterContract defines an operation to remove a registered contract
	// from the list of contracts set to be automatically executed when
	// decryption key is available for a particular identity
	UnregisterContract(context.Context, *MsgUnregisterContract) (*MsgUnregisterContractResponse, error)
	mustEmbedUnimplementedMsgServer()
}

// UnimplementedMsgServer must be embedded to have forward compatible implementations.
type UnimplementedMsgServer struct {
}

func (UnimplementedMsgServer) UpdateParams(context.Context, *MsgUpdateParams) (*MsgUpdateParamsResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateParams not implemented")
}
func (UnimplementedMsgServer) SubmitEncryptedTx(context.Context, *MsgSubmitEncryptedTx) (*MsgSubmitEncryptedTxResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SubmitEncryptedTx not implemented")
}
func (UnimplementedMsgServer) SubmitGeneralEncryptedTx(context.Context, *MsgSubmitGeneralEncryptedTx) (*MsgSubmitGeneralEncryptedTxResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SubmitGeneralEncryptedTx not implemented")
}
func (UnimplementedMsgServer) SubmitDecryptionKey(context.Context, *MsgSubmitDecryptionKey) (*MsgSubmitDecryptionKeyResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SubmitDecryptionKey not implemented")
}
func (UnimplementedMsgServer) RequestGeneralIdentity(context.Context, *MsgRequestGeneralIdentity) (*MsgRequestGeneralIdentityResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RequestGeneralIdentity not implemented")
}
func (UnimplementedMsgServer) RequestGeneralDecryptionKey(context.Context, *MsgRequestGeneralDecryptionKey) (*MsgRequestGeneralDecryptionKeyResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RequestGeneralDecryptionKey not implemented")
}
func (UnimplementedMsgServer) RequestPrivateIdentity(context.Context, *MsgRequestPrivateIdentity) (*MsgRequestPrivateIdentityResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RequestPrivateIdentity not implemented")
}
func (UnimplementedMsgServer) RequestPrivateDecryptionKey(context.Context, *MsgRequestPrivateDecryptionKey) (*MsgRequestPrivateDecryptionKeyResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RequestPrivateDecryptionKey not implemented")
}
func (UnimplementedMsgServer) RegisterContract(context.Context, *MsgRegisterContract) (*MsgRegisterContractResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RegisterContract not implemented")
}
func (UnimplementedMsgServer) UnregisterContract(context.Context, *MsgUnregisterContract) (*MsgUnregisterContractResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UnregisterContract not implemented")
}
func (UnimplementedMsgServer) mustEmbedUnimplementedMsgServer() {}

// UnsafeMsgServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to MsgServer will
// result in compilation errors.
type UnsafeMsgServer interface {
	mustEmbedUnimplementedMsgServer()
}

func RegisterMsgServer(s grpc.ServiceRegistrar, srv MsgServer) {
	s.RegisterService(&Msg_ServiceDesc, srv)
}

func _Msg_UpdateParams_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MsgUpdateParams)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MsgServer).UpdateParams(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Msg_UpdateParams_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MsgServer).UpdateParams(ctx, req.(*MsgUpdateParams))
	}
	return interceptor(ctx, in, info, handler)
}

func _Msg_SubmitEncryptedTx_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MsgSubmitEncryptedTx)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MsgServer).SubmitEncryptedTx(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Msg_SubmitEncryptedTx_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MsgServer).SubmitEncryptedTx(ctx, req.(*MsgSubmitEncryptedTx))
	}
	return interceptor(ctx, in, info, handler)
}

func _Msg_SubmitGeneralEncryptedTx_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MsgSubmitGeneralEncryptedTx)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MsgServer).SubmitGeneralEncryptedTx(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Msg_SubmitGeneralEncryptedTx_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MsgServer).SubmitGeneralEncryptedTx(ctx, req.(*MsgSubmitGeneralEncryptedTx))
	}
	return interceptor(ctx, in, info, handler)
}

func _Msg_SubmitDecryptionKey_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MsgSubmitDecryptionKey)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MsgServer).SubmitDecryptionKey(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Msg_SubmitDecryptionKey_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MsgServer).SubmitDecryptionKey(ctx, req.(*MsgSubmitDecryptionKey))
	}
	return interceptor(ctx, in, info, handler)
}

func _Msg_RequestGeneralIdentity_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MsgRequestGeneralIdentity)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MsgServer).RequestGeneralIdentity(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Msg_RequestGeneralIdentity_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MsgServer).RequestGeneralIdentity(ctx, req.(*MsgRequestGeneralIdentity))
	}
	return interceptor(ctx, in, info, handler)
}

func _Msg_RequestGeneralDecryptionKey_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MsgRequestGeneralDecryptionKey)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MsgServer).RequestGeneralDecryptionKey(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Msg_RequestGeneralDecryptionKey_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MsgServer).RequestGeneralDecryptionKey(ctx, req.(*MsgRequestGeneralDecryptionKey))
	}
	return interceptor(ctx, in, info, handler)
}

func _Msg_RequestPrivateIdentity_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MsgRequestPrivateIdentity)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MsgServer).RequestPrivateIdentity(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Msg_RequestPrivateIdentity_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MsgServer).RequestPrivateIdentity(ctx, req.(*MsgRequestPrivateIdentity))
	}
	return interceptor(ctx, in, info, handler)
}

func _Msg_RequestPrivateDecryptionKey_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MsgRequestPrivateDecryptionKey)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MsgServer).RequestPrivateDecryptionKey(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Msg_RequestPrivateDecryptionKey_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MsgServer).RequestPrivateDecryptionKey(ctx, req.(*MsgRequestPrivateDecryptionKey))
	}
	return interceptor(ctx, in, info, handler)
}

func _Msg_RegisterContract_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MsgRegisterContract)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MsgServer).RegisterContract(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Msg_RegisterContract_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MsgServer).RegisterContract(ctx, req.(*MsgRegisterContract))
	}
	return interceptor(ctx, in, info, handler)
}

func _Msg_UnregisterContract_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(MsgUnregisterContract)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MsgServer).UnregisterContract(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: Msg_UnregisterContract_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MsgServer).UnregisterContract(ctx, req.(*MsgUnregisterContract))
	}
	return interceptor(ctx, in, info, handler)
}

// Msg_ServiceDesc is the grpc.ServiceDesc for Msg service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Msg_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "fairyring.pep.Msg",
	HandlerType: (*MsgServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "UpdateParams",
			Handler:    _Msg_UpdateParams_Handler,
		},
		{
			MethodName: "SubmitEncryptedTx",
			Handler:    _Msg_SubmitEncryptedTx_Handler,
		},
		{
			MethodName: "SubmitGeneralEncryptedTx",
			Handler:    _Msg_SubmitGeneralEncryptedTx_Handler,
		},
		{
			MethodName: "SubmitDecryptionKey",
			Handler:    _Msg_SubmitDecryptionKey_Handler,
		},
		{
			MethodName: "RequestGeneralIdentity",
			Handler:    _Msg_RequestGeneralIdentity_Handler,
		},
		{
			MethodName: "RequestGeneralDecryptionKey",
			Handler:    _Msg_RequestGeneralDecryptionKey_Handler,
		},
		{
			MethodName: "RequestPrivateIdentity",
			Handler:    _Msg_RequestPrivateIdentity_Handler,
		},
		{
			MethodName: "RequestPrivateDecryptionKey",
			Handler:    _Msg_RequestPrivateDecryptionKey_Handler,
		},
		{
			MethodName: "RegisterContract",
			Handler:    _Msg_RegisterContract_Handler,
		},
		{
			MethodName: "UnregisterContract",
			Handler:    _Msg_UnregisterContract_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "fairyring/pep/tx.proto",
}
