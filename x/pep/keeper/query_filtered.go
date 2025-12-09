package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/pep/types"
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

// Params delegates to keeper
func (f *FilteredQueryServer) Params(ctx context.Context, req *types.QueryParamsRequest) (*types.QueryParamsResponse, error) {
	return f.keeper.Params(ctx, req)
}

// EncryptedTx delegates to keeper
func (f *FilteredQueryServer) EncryptedTx(ctx context.Context, req *types.QueryEncryptedTxRequest) (*types.QueryEncryptedTxResponse, error) {
	return f.keeper.EncryptedTx(ctx, req)
}

// EncryptedTxAll delegates to keeper
func (f *FilteredQueryServer) EncryptedTxAll(ctx context.Context, req *types.QueryEncryptedTxAllRequest) (*types.QueryEncryptedTxAllResponse, error) {
	return f.keeper.EncryptedTxAll(ctx, req)
}

// EncryptedTxAllFromHeight delegates to keeper
func (f *FilteredQueryServer) EncryptedTxAllFromHeight(ctx context.Context, req *types.QueryEncryptedTxAllFromHeightRequest) (*types.QueryEncryptedTxAllFromHeightResponse, error) {
	return f.keeper.EncryptedTxAllFromHeight(ctx, req)
}

// LatestHeight delegates to keeper
func (f *FilteredQueryServer) LatestHeight(ctx context.Context, req *types.QueryLatestHeightRequest) (*types.QueryLatestHeightResponse, error) {
	return f.keeper.LatestHeight(ctx, req)
}

// PepNonce delegates to keeper
func (f *FilteredQueryServer) PepNonce(ctx context.Context, req *types.QueryPepNonceRequest) (*types.QueryPepNonceResponse, error) {
	return f.keeper.PepNonce(ctx, req)
}

// PepNonceAll delegates to keeper
func (f *FilteredQueryServer) PepNonceAll(ctx context.Context, req *types.QueryPepNonceAllRequest) (*types.QueryPepNonceAllResponse, error) {
	return f.keeper.PepNonceAll(ctx, req)
}

// Pubkey delegates to keeper
func (f *FilteredQueryServer) Pubkey(ctx context.Context, req *types.QueryPubkeyRequest) (*types.QueryPubkeyResponse, error) {
	return f.keeper.Pubkey(ctx, req)
}

// GeneralIdentity delegates to keeper
func (f *FilteredQueryServer) GeneralIdentity(ctx context.Context, req *types.QueryGeneralIdentityRequest) (*types.QueryGeneralIdentityResponse, error) {
	return f.keeper.GeneralIdentity(ctx, req)
}

// GeneralIdentityAll delegates to keeper
func (f *FilteredQueryServer) GeneralIdentityAll(ctx context.Context, req *types.QueryGeneralIdentityAllRequest) (*types.QueryGeneralIdentityAllResponse, error) {
	return f.keeper.GeneralIdentityAll(ctx, req)
}

// PrivateIdentity delegates to keeper
func (f *FilteredQueryServer) PrivateIdentity(ctx context.Context, req *types.QueryPrivateIdentityRequest) (*types.QueryPrivateIdentityResponse, error) {
	return f.keeper.PrivateIdentity(ctx, req)
}

// DecryptData delegates to keeper
func (f *FilteredQueryServer) DecryptData(ctx context.Context, req *types.QueryDecryptDataRequest) (*types.QueryDecryptDataResponse, error) {
	return f.keeper.DecryptData(ctx, req)
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
