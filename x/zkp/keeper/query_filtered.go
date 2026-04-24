package keeper

import (
	"context"

	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/Fairblock/fairyring/x/zkp/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type FilteredQueryServer struct {
	keeper Keeper
}

func NewFilteredQueryServer(keeper Keeper) types.QueryServer {
	return &FilteredQueryServer{keeper: keeper}
}

func (f *FilteredQueryServer) TrustedContracts(goCtx context.Context, req *types.TrustedContractsRequest) (*types.TrustedContractsResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	contracts := f.keeper.GetAllTrustedContracts(ctx)
	return &types.TrustedContractsResponse{ContractAddresses: contracts}, nil
}

func (f *FilteredQueryServer) VerifyWithdrawRangeProof(ctx context.Context, req *types.QueryVerifyWithdrawRangeProofRequest) (*types.QueryVerifyWithdrawRangeProofResponse, error) {
	return nil, status.Errorf(codes.PermissionDenied, "ZKP verification queries are only accessible through CosmWasm contracts, not via gRPC or REST API")
}

func (f *FilteredQueryServer) VerifyTransferRangeProof(ctx context.Context, req *types.QueryVerifyTransferRangeProofRequest) (*types.QueryVerifyTransferRangeProofResponse, error) {
	return nil, status.Errorf(codes.PermissionDenied, "ZKP verification queries are only accessible through CosmWasm contracts, not via gRPC or REST API")
}

func (f *FilteredQueryServer) VerifyValidityProof(ctx context.Context, req *types.QueryVerifyValidityProofRequest) (*types.QueryVerifyValidityProofResponse, error) {
	return nil, status.Errorf(codes.PermissionDenied, "ZKP verification queries are only accessible through CosmWasm contracts, not via gRPC or REST API")
}

func (f *FilteredQueryServer) VerifyEqualityProof(ctx context.Context, req *types.QueryVerifyEqualityProofRequest) (*types.QueryVerifyEqualityProofResponse, error) {
	return nil, status.Errorf(codes.PermissionDenied, "ZKP verification queries are only accessible through CosmWasm contracts, not via gRPC or REST API")
}

func (f *FilteredQueryServer) VerifyTransferProofs(ctx context.Context, req *types.QueryVerifyTransferProofsRequest) (*types.QueryVerifyTransferProofsResponse, error) {
	return nil, status.Errorf(codes.PermissionDenied, "ZKP verification queries are only accessible through CosmWasm contracts, not via gRPC or REST API")
}

func (f *FilteredQueryServer) VerifyWithdrawProofs(ctx context.Context, req *types.QueryVerifyWithdrawProofsRequest) (*types.QueryVerifyWithdrawProofsResponse, error) {
	return nil, status.Errorf(codes.PermissionDenied, "ZKP verification queries are only accessible through CosmWasm contracts, not via gRPC or REST API")
}
