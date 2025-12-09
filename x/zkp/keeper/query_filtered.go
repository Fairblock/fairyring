package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/zkp/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// FilteredQueryServer wraps the keeper to block ZKP verification queries via gRPC/REST
// These queries are only accessible through CosmWasm contracts
type FilteredQueryServer struct {
	keeper Keeper
}

// NewFilteredQueryServer creates a new filtered query server
func NewFilteredQueryServer(keeper Keeper) types.QueryServer {
	return &FilteredQueryServer{keeper: keeper}
}

// ZKP Verification queries are blocked via gRPC/REST

// VerifyWithdrawRangeProof blocks access via gRPC/REST
func (f *FilteredQueryServer) VerifyWithdrawRangeProof(ctx context.Context, req *types.QueryVerifyWithdrawRangeProofRequest) (*types.QueryVerifyWithdrawRangeProofResponse, error) {
	return nil, status.Errorf(codes.PermissionDenied, "ZKP verification queries are only accessible through CosmWasm contracts, not via gRPC or REST API")
}

// VerifyTransferRangeProof blocks access via gRPC/REST
func (f *FilteredQueryServer) VerifyTransferRangeProof(ctx context.Context, req *types.QueryVerifyTransferRangeProofRequest) (*types.QueryVerifyTransferRangeProofResponse, error) {
	return nil, status.Errorf(codes.PermissionDenied, "ZKP verification queries are only accessible through CosmWasm contracts, not via gRPC or REST API")
}

// VerifyValidityProof blocks access via gRPC/REST
func (f *FilteredQueryServer) VerifyValidityProof(ctx context.Context, req *types.QueryVerifyValidityProofRequest) (*types.QueryVerifyValidityProofResponse, error) {
	return nil, status.Errorf(codes.PermissionDenied, "ZKP verification queries are only accessible through CosmWasm contracts, not via gRPC or REST API")
}

// VerifyEqualityProof blocks access via gRPC/REST
func (f *FilteredQueryServer) VerifyEqualityProof(ctx context.Context, req *types.QueryVerifyEqualityProofRequest) (*types.QueryVerifyEqualityProofResponse, error) {
	return nil, status.Errorf(codes.PermissionDenied, "ZKP verification queries are only accessible through CosmWasm contracts, not via gRPC or REST API")
}

// VerifyTransferProofs blocks access via gRPC/REST
func (f *FilteredQueryServer) VerifyTransferProofs(ctx context.Context, req *types.QueryVerifyTransferProofsRequest) (*types.QueryVerifyTransferProofsResponse, error) {
	return nil, status.Errorf(codes.PermissionDenied, "ZKP verification queries are only accessible through CosmWasm contracts, not via gRPC or REST API")
}

// VerifyWithdrawProofs blocks access via gRPC/REST
func (f *FilteredQueryServer) VerifyWithdrawProofs(ctx context.Context, req *types.QueryVerifyWithdrawProofsRequest) (*types.QueryVerifyWithdrawProofsResponse, error) {
	return nil, status.Errorf(codes.PermissionDenied, "ZKP verification queries are only accessible through CosmWasm contracts, not via gRPC or REST API")
}

