package keeper

import (
	"context"

	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/Fairblock/fairyring/x/zkp/types"
	"github.com/Fairblock/fairyring/x/zkp/verification/commitment"
	rangeproof "github.com/Fairblock/fairyring/x/zkp/verification/range"
	"github.com/Fairblock/fairyring/x/zkp/verification/transferctx"
	"github.com/Fairblock/fairyring/x/zkp/verification/validity"
	"github.com/Fairblock/fairyring/x/zkp/verification/withdrawctx"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) VerifyWithdrawRangeProof(goCtx context.Context, req *types.QueryVerifyWithdrawRangeProofRequest) (*types.QueryVerifyWithdrawRangeProofResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)
	ctx.GasMeter().ConsumeGas(types.GasVerifyWithdrawRangeProof, "verify_withdraw_range_proof")

	if len(req.ProofData) < 8*32+8+8+672 {
		return &types.QueryVerifyWithdrawRangeProofResponse{
			Valid: false,
			Error: "invalid proof data length",
		}, nil
	}

	var proofData rangeproof.WithdrawBatchedRangeProofU64Data
	offset := 0

	for i := 0; i < 8; i++ {
		if offset+32 > len(req.ProofData) {
			return &types.QueryVerifyWithdrawRangeProofResponse{
				Valid: false,
				Error: "invalid commitments data",
			}, nil
		}
		copy(proofData.Context.Commitments[i].Bytes[:], req.ProofData[offset:offset+32])
		offset += 32
	}

	for i := 0; i < 8; i++ {
		if offset >= len(req.ProofData) {
			return &types.QueryVerifyWithdrawRangeProofResponse{
				Valid: false,
				Error: "invalid bit lengths data",
			}, nil
		}
		proofData.Context.BitLengths[i] = req.ProofData[offset]
		offset++
	}

	if offset+8 > len(req.ProofData) {
		return &types.QueryVerifyWithdrawRangeProofResponse{
			Valid: false,
			Error: "invalid nonce data",
		}, nil
	}
	copy(proofData.Context.Nonce[:], req.ProofData[offset:offset+8])
	offset += 8

	if offset+672 > len(req.ProofData) {
		return &types.QueryVerifyWithdrawRangeProofResponse{
			Valid: false,
			Error: "invalid proof data",
		}, nil
	}
	copy(proofData.Proof[:], req.ProofData[offset:offset+672])

	err := rangeproof.VerifyWithdrawRangeWithNonce(&proofData)
	if err != nil {
		return &types.QueryVerifyWithdrawRangeProofResponse{
			Valid: false,
			Error: err.Error(),
		}, nil
	}

	return &types.QueryVerifyWithdrawRangeProofResponse{
		Valid: true,
		Error: "",
	}, nil
}

func (k Keeper) VerifyTransferRangeProof(goCtx context.Context, req *types.QueryVerifyTransferRangeProofRequest) (*types.QueryVerifyTransferRangeProofResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)
	ctx.GasMeter().ConsumeGas(types.GasVerifyTransferRangeProof, "verify_transfer_range_proof")

	if len(req.ProofData) < 8*32+8+736 {
		return &types.QueryVerifyTransferRangeProofResponse{
			Valid: false,
			Error: "invalid proof data length",
		}, nil
	}

	var proofData rangeproof.BatchedRangeProofU128Data
	offset := 0

	// Deserialize commitments
	for i := 0; i < 8; i++ {
		if offset+32 > len(req.ProofData) {
			return &types.QueryVerifyTransferRangeProofResponse{
				Valid: false,
				Error: "invalid commitments data",
			}, nil
		}
		copy(proofData.Context.Commitments[i].Bytes[:], req.ProofData[offset:offset+32])
		offset += 32
	}

	// Deserialize bit lengths
	for i := 0; i < 8; i++ {
		if offset >= len(req.ProofData) {
			return &types.QueryVerifyTransferRangeProofResponse{
				Valid: false,
				Error: "invalid bit lengths data",
			}, nil
		}
		proofData.Context.BitLengths[i] = req.ProofData[offset]
		offset++
	}

	// Deserialize proof
	if offset+736 > len(req.ProofData) {
		return &types.QueryVerifyTransferRangeProofResponse{
			Valid: false,
			Error: "invalid proof data",
		}, nil
	}
	copy(proofData.Proof[:], req.ProofData[offset:offset+736])

	// Verify proof using the verification module
	err := rangeproof.VerifyTransferRange(&proofData)
	if err != nil {
		return &types.QueryVerifyTransferRangeProofResponse{
			Valid: false,
			Error: err.Error(),
		}, nil
	}

	return &types.QueryVerifyTransferRangeProofResponse{
		Valid: true,
		Error: "",
	}, nil
}

func (k Keeper) VerifyValidityProof(goCtx context.Context, req *types.QueryVerifyValidityProofRequest) (*types.QueryVerifyValidityProofResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)
	ctx.GasMeter().ConsumeGas(types.GasVerifyValidityProof, "verify_validity_proof")

	if len(req.ProofData) < 416 {
		return &types.QueryVerifyValidityProofResponse{
			Valid: false,
			Error: "invalid proof data length",
		}, nil
	}

	var proofData validity.BatchedGroupedCiphertext2HandlesValidityProofData
	offset := 0

	// Deserialize first pubkey
	copy(proofData.Context.FirstPubkey.Bytes[:], req.ProofData[offset:offset+32])
	offset += 32

	// Deserialize second pubkey
	copy(proofData.Context.SecondPubkey.Bytes[:], req.ProofData[offset:offset+32])
	offset += 32

	// Deserialize grouped ciphertext lo
	copy(proofData.Context.GroupedCiphertextLo.Bytes[:], req.ProofData[offset:offset+96])
	offset += 96

	// Deserialize grouped ciphertext hi
	copy(proofData.Context.GroupedCiphertextHi.Bytes[:], req.ProofData[offset:offset+96])
	offset += 96

	// Deserialize proof
	copy(proofData.Proof.Bytes[:], req.ProofData[offset:offset+160])

	// Verify proof using the verification module
	err := validity.VerifyValidityProof(&proofData)
	if err != nil {
		return &types.QueryVerifyValidityProofResponse{
			Valid: false,
			Error: err.Error(),
		}, nil
	}

	return &types.QueryVerifyValidityProofResponse{
		Valid: true,
		Error: "",
	}, nil
}

func (k Keeper) VerifyEqualityProof(goCtx context.Context, req *types.QueryVerifyEqualityProofRequest) (*types.QueryVerifyEqualityProofResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)
	ctx.GasMeter().ConsumeGas(types.GasVerifyEqualityProof, "verify_equality_proof")

	if len(req.ProofData) < 320 {
		return &types.QueryVerifyEqualityProofResponse{
			Valid: false,
			Error: "invalid proof data length",
		}, nil
	}

	var proofData commitment.CiphertextCommitmentEqualityProofData
	offset := 0

	// Deserialize pubkey
	copy(proofData.Context.Pubkey.Bytes[:], req.ProofData[offset:offset+32])
	offset += 32

	// Deserialize ciphertext
	copy(proofData.Context.Ciphertext.Commitment[:], req.ProofData[offset:offset+32])
	offset += 32
	copy(proofData.Context.Ciphertext.Handle[:], req.ProofData[offset:offset+32])
	offset += 32

	// Deserialize commitment
	copy(proofData.Context.Commitment.Bytes[:], req.ProofData[offset:offset+32])
	offset += 32

	// Deserialize proof
	copy(proofData.Proof.Y0[:], req.ProofData[offset:offset+32])
	offset += 32
	copy(proofData.Proof.Y1[:], req.ProofData[offset:offset+32])
	offset += 32
	copy(proofData.Proof.Y2[:], req.ProofData[offset:offset+32])
	offset += 32
	copy(proofData.Proof.Zs[:], req.ProofData[offset:offset+32])
	offset += 32
	copy(proofData.Proof.Zx[:], req.ProofData[offset:offset+32])
	offset += 32
	copy(proofData.Proof.Zr[:], req.ProofData[offset:offset+32])

	// Verify proof using the verification module
	err := commitment.VerifyEqualityProof(&proofData)
	if err != nil {
		return &types.QueryVerifyEqualityProofResponse{
			Valid: false,
			Error: err.Error(),
		}, nil
	}

	return &types.QueryVerifyEqualityProofResponse{
		Valid: true,
		Error: "",
	}, nil
}

func (k Keeper) VerifyTransferProofs(goCtx context.Context, req *types.QueryVerifyTransferProofsRequest) (*types.QueryVerifyTransferProofsResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)
	ctx.GasMeter().ConsumeGas(types.GasVerifyTransferProofs, "verify_transfer_proofs")

	if len(req.EqualityProofData) < 320 {
		return &types.QueryVerifyTransferProofsResponse{
			Valid: false,
			Error: "invalid equality proof data length",
		}, nil
	}

	var equalityProofData commitment.CiphertextCommitmentEqualityProofData
	offset := 0

	// Deserialize equality proof
	copy(equalityProofData.Context.Pubkey.Bytes[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Context.Ciphertext.Commitment[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Context.Ciphertext.Handle[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Context.Commitment.Bytes[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Proof.Y0[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Proof.Y1[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Proof.Y2[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Proof.Zs[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Proof.Zx[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Proof.Zr[:], req.EqualityProofData[offset:offset+32])

	// Deserialize range proof
	if len(req.RangeProofData) < 8*32+8+736 {
		return &types.QueryVerifyTransferProofsResponse{
			Valid: false,
			Error: "invalid range proof data length",
		}, nil
	}

	var rangeProofData rangeproof.BatchedRangeProofU128Data
	offset = 0

	// Deserialize range proof commitments
	for i := 0; i < 8; i++ {
		if offset+32 > len(req.RangeProofData) {
			return &types.QueryVerifyTransferProofsResponse{
				Valid: false,
				Error: "invalid range proof commitments data",
			}, nil
		}
		copy(rangeProofData.Context.Commitments[i].Bytes[:], req.RangeProofData[offset:offset+32])
		offset += 32
	}

	// Deserialize bit lengths
	for i := 0; i < 8; i++ {
		if offset >= len(req.RangeProofData) {
			return &types.QueryVerifyTransferProofsResponse{
				Valid: false,
				Error: "invalid range proof bit lengths data",
			}, nil
		}
		rangeProofData.Context.BitLengths[i] = req.RangeProofData[offset]
		offset++
	}

	// Deserialize proof
	if offset+736 > len(req.RangeProofData) {
		return &types.QueryVerifyTransferProofsResponse{
			Valid: false,
			Error: "invalid range proof data",
		}, nil
	}
	copy(rangeProofData.Proof[:], req.RangeProofData[offset:offset+736])

	// Deserialize validity proof
	if len(req.ValidityProofData) < 416 {
		return &types.QueryVerifyTransferProofsResponse{
			Valid: false,
			Error: "invalid validity proof data length",
		}, nil
	}

	var validityProofData validity.BatchedGroupedCiphertext2HandlesValidityProofData
	offset = 0

	// Deserialize validity proof
	copy(validityProofData.Context.FirstPubkey.Bytes[:], req.ValidityProofData[offset:offset+32])
	offset += 32
	copy(validityProofData.Context.SecondPubkey.Bytes[:], req.ValidityProofData[offset:offset+32])
	offset += 32
	copy(validityProofData.Context.GroupedCiphertextLo.Bytes[:], req.ValidityProofData[offset:offset+96])
	offset += 96
	copy(validityProofData.Context.GroupedCiphertextHi.Bytes[:], req.ValidityProofData[offset:offset+96])
	offset += 96
	copy(validityProofData.Proof.Bytes[:], req.ValidityProofData[offset:offset+160])

	if len(req.SenderPubkey) != 32 || len(req.RecipientPubkey) != 32 ||
		len(req.CurrentBalanceCommitment) != 32 || len(req.CurrentBalanceHandle) != 32 {
		return &types.QueryVerifyTransferProofsResponse{
			Valid: false,
			Error: "transfer binding verification failed: missing or invalid pubkey/balance fields (expected 32-byte values)",
		}, nil
	}

	err := transferctx.VerifyBindings(
		&equalityProofData,
		&rangeProofData,
		&validityProofData,
		req.CurrentBalanceCommitment,
		req.CurrentBalanceHandle,
		req.SenderPubkey,
		req.RecipientPubkey,
	)
	if err != nil {
		return &types.QueryVerifyTransferProofsResponse{
			Valid: false,
			Error: "transfer binding verification failed: " + err.Error(),
		}, nil
	}

	err = commitment.VerifyEqualityProof(&equalityProofData)
	if err != nil {
		return &types.QueryVerifyTransferProofsResponse{
			Valid: false,
			Error: "equality proof verification failed: " + err.Error(),
		}, nil
	}

	err = rangeproof.VerifyTransferRange(&rangeProofData)
	if err != nil {
		return &types.QueryVerifyTransferProofsResponse{
			Valid: false,
			Error: "range proof verification failed: " + err.Error(),
		}, nil
	}

	err = validity.VerifyValidityProof(&validityProofData)
	if err != nil {
		return &types.QueryVerifyTransferProofsResponse{
			Valid: false,
			Error: "validity proof verification failed: " + err.Error(),
		}, nil
	}

	return &types.QueryVerifyTransferProofsResponse{
		Valid: true,
		Error: "",
	}, nil
}

func (k Keeper) VerifyWithdrawProofs(goCtx context.Context, req *types.QueryVerifyWithdrawProofsRequest) (*types.QueryVerifyWithdrawProofsResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)
	ctx.GasMeter().ConsumeGas(types.GasVerifyWithdrawProofs, "verify_withdraw_proofs")

	if len(req.EqualityProofData) < 328 {
		return &types.QueryVerifyWithdrawProofsResponse{
			Valid: false,
			Error: "invalid equality proof data length",
		}, nil
	}

	var equalityProofData commitment.WithdrawCiphertextCommitmentEqualityProofData
	offset := 0

	copy(equalityProofData.Context.Pubkey.Bytes[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Context.Ciphertext.Commitment[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Context.Ciphertext.Handle[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Context.Commitment.Bytes[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Context.Nonce[:], req.EqualityProofData[offset:offset+8])
	offset += 8
	copy(equalityProofData.Proof.Y0[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Proof.Y1[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Proof.Y2[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Proof.Zs[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Proof.Zx[:], req.EqualityProofData[offset:offset+32])
	offset += 32
	copy(equalityProofData.Proof.Zr[:], req.EqualityProofData[offset:offset+32])

	// Deserialize range proof
	if len(req.RangeProofData) < 8*32+8+8+672 {
		return &types.QueryVerifyWithdrawProofsResponse{
			Valid: false,
			Error: "invalid range proof data length",
		}, nil
	}

	var rangeProofData rangeproof.WithdrawBatchedRangeProofU64Data
	offset = 0

	for i := 0; i < 8; i++ {
		if offset+32 > len(req.RangeProofData) {
			return &types.QueryVerifyWithdrawProofsResponse{
				Valid: false,
				Error: "invalid range proof commitments data",
			}, nil
		}
		copy(rangeProofData.Context.Commitments[i].Bytes[:], req.RangeProofData[offset:offset+32])
		offset += 32
	}

	for i := 0; i < 8; i++ {
		if offset >= len(req.RangeProofData) {
			return &types.QueryVerifyWithdrawProofsResponse{
				Valid: false,
				Error: "invalid range proof bit lengths data",
			}, nil
		}
		rangeProofData.Context.BitLengths[i] = req.RangeProofData[offset]
		offset++
	}

	if offset+8 > len(req.RangeProofData) {
		return &types.QueryVerifyWithdrawProofsResponse{
			Valid: false,
			Error: "invalid range proof nonce data",
		}, nil
	}
	copy(rangeProofData.Context.Nonce[:], req.RangeProofData[offset:offset+8])
	offset += 8

	if offset+672 > len(req.RangeProofData) {
		return &types.QueryVerifyWithdrawProofsResponse{
			Valid: false,
			Error: "invalid range proof data",
		}, nil
	}
	copy(rangeProofData.Proof[:], req.RangeProofData[offset:offset+672])

	if len(req.UserPubkey) != 32 || len(req.CiphertextCommitment) != 32 || len(req.CiphertextHandle) != 32 {
		return &types.QueryVerifyWithdrawProofsResponse{
			Valid: false,
			Error: "withdraw binding verification failed: missing or invalid pubkey/ciphertext fields (expected 32-byte values)",
		}, nil
	}

	err := withdrawctx.VerifyBindings(
		&equalityProofData,
		&rangeProofData,
		req.UserPubkey,
		req.CiphertextCommitment,
		req.CiphertextHandle,
		req.ExpectedNonce,
	)
	if err != nil {
		return &types.QueryVerifyWithdrawProofsResponse{
			Valid: false,
			Error: "withdraw binding verification failed: " + err.Error(),
		}, nil
	}

	err = commitment.VerifyWithdrawEqualityProof(&equalityProofData)
	if err != nil {
		return &types.QueryVerifyWithdrawProofsResponse{
			Valid: false,
			Error: "equality proof verification failed: " + err.Error(),
		}, nil
	}

	err = rangeproof.VerifyWithdrawRangeWithNonce(&rangeProofData)
	if err != nil {
		return &types.QueryVerifyWithdrawProofsResponse{
			Valid: false,
			Error: "range proof verification failed: " + err.Error(),
		}, nil
	}

	return &types.QueryVerifyWithdrawProofsResponse{
		Valid: true,
		Error: "",
	}, nil
}

