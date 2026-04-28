package keeper

import (
	"context"
	"testing"

	"github.com/Fairblock/fairyring/x/zkp/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func requireInvalidArgument(t *testing.T, err error) {
	t.Helper()
	if err == nil {
		t.Fatal("expected error")
	}
	st, ok := status.FromError(err)
	if !ok {
		t.Fatalf("expected gRPC status error, got %T: %v", err, err)
	}
	if st.Code() != codes.InvalidArgument {
		t.Fatalf("expected InvalidArgument, got %s", st.Code())
	}
	if st.Message() != "invalid request" {
		t.Fatalf("unexpected error message: %q", st.Message())
	}
}

func TestProofVerificationQueriesRejectNilRequests(t *testing.T) {
	k := Keeper{}
	ctx := context.Background()

	_, err := k.VerifyWithdrawRangeProof(ctx, (*types.QueryVerifyWithdrawRangeProofRequest)(nil))
	requireInvalidArgument(t, err)

	_, err = k.VerifyTransferRangeProof(ctx, (*types.QueryVerifyTransferRangeProofRequest)(nil))
	requireInvalidArgument(t, err)

	_, err = k.VerifyValidityProof(ctx, (*types.QueryVerifyValidityProofRequest)(nil))
	requireInvalidArgument(t, err)

	_, err = k.VerifyEqualityProof(ctx, (*types.QueryVerifyEqualityProofRequest)(nil))
	requireInvalidArgument(t, err)

	_, err = k.VerifyTransferProofs(ctx, (*types.QueryVerifyTransferProofsRequest)(nil))
	requireInvalidArgument(t, err)

	_, err = k.VerifyWithdrawProofs(ctx, (*types.QueryVerifyWithdrawProofsRequest)(nil))
	requireInvalidArgument(t, err)
}
