package keeper

import (
	"context"

	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/Fairblock/fairyring/x/pep/verification/commitment"
	rangeproof "github.com/Fairblock/fairyring/x/pep/verification/range"
	"github.com/Fairblock/fairyring/x/pep/verification/validity"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// VerifyWithdrawRangeProof verifies a withdraw range proof (U64)
func (k Keeper) VerifyWithdrawRangeProof(goCtx context.Context, req *types.QueryVerifyWithdrawRangeProofRequest) (*types.QueryVerifyWithdrawRangeProofResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	// Deserialize proof data
	if len(req.ProofData) < 8*32+8+672 {
		return &types.QueryVerifyWithdrawRangeProofResponse{
			Valid: false,
			Error: "invalid proof data length",
		}, nil
	}

	var proofData rangeproof.BatchedRangeProofU64Data
	offset := 0

	// Deserialize commitments
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

	// Deserialize bit lengths
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

	// Deserialize proof
	if offset+672 > len(req.ProofData) {
		return &types.QueryVerifyWithdrawRangeProofResponse{
			Valid: false,
			Error: "invalid proof data",
		}, nil
	}
	copy(proofData.Proof[:], req.ProofData[offset:offset+672])

	// Verify proof using the verification module
	err := rangeproof.VerifyWithdrawRange(&proofData)
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

// VerifyTransferRangeProof verifies a transfer range proof (U128)
func (k Keeper) VerifyTransferRangeProof(goCtx context.Context, req *types.QueryVerifyTransferRangeProofRequest) (*types.QueryVerifyTransferRangeProofResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	// Deserialize proof data
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

// VerifyValidityProof verifies a validity proof for grouped ciphertexts
func (k Keeper) VerifyValidityProof(goCtx context.Context, req *types.QueryVerifyValidityProofRequest) (*types.QueryVerifyValidityProofResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	// Deserialize proof data
	// Expected size: 32 (first_pubkey) + 32 (second_pubkey) + 96 (grouped_ciphertext_lo) + 96 (grouped_ciphertext_hi) + 160 (proof) = 416 bytes
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

// VerifyEqualityProof verifies an equality proof between ciphertext and commitment
func (k Keeper) VerifyEqualityProof(goCtx context.Context, req *types.QueryVerifyEqualityProofRequest) (*types.QueryVerifyEqualityProofResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	// Deserialize proof data
	// Expected size: 32 (pubkey) + 64 (ciphertext) + 32 (commitment) + 192 (proof) = 320 bytes
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

// VerifyTransferProofs verifies all transfer proofs together (equality, range, validity)
func (k Keeper) VerifyTransferProofs(goCtx context.Context, req *types.QueryVerifyTransferProofsRequest) (*types.QueryVerifyTransferProofsResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	// Verify equality proof
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

	err := commitment.VerifyEqualityProof(&equalityProofData)
	if err != nil {
		return &types.QueryVerifyTransferProofsResponse{
			Valid: false,
			Error: "equality proof verification failed: " + err.Error(),
		}, nil
	}

	// Verify range proof
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

	err = rangeproof.VerifyTransferRange(&rangeProofData)
	if err != nil {
		return &types.QueryVerifyTransferProofsResponse{
			Valid: false,
			Error: "range proof verification failed: " + err.Error(),
		}, nil
	}

	// Verify validity proof
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

// VerifyWithdrawProofs verifies all withdraw proofs together (equality, range)
func (k Keeper) VerifyWithdrawProofs(goCtx context.Context, req *types.QueryVerifyWithdrawProofsRequest) (*types.QueryVerifyWithdrawProofsResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	// Verify equality proof
	if len(req.EqualityProofData) < 320 {
		return &types.QueryVerifyWithdrawProofsResponse{
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

	err := commitment.VerifyEqualityProof(&equalityProofData)
	if err != nil {
		return &types.QueryVerifyWithdrawProofsResponse{
			Valid: false,
			Error: "equality proof verification failed: " + err.Error(),
		}, nil
	}

	// Verify range proof
	if len(req.RangeProofData) < 8*32+8+672 {
		return &types.QueryVerifyWithdrawProofsResponse{
			Valid: false,
			Error: "invalid range proof data length",
		}, nil
	}

	var rangeProofData rangeproof.BatchedRangeProofU64Data
	offset = 0

	// Deserialize range proof commitments
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

	// Deserialize bit lengths
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

	// Deserialize proof
	if offset+672 > len(req.RangeProofData) {
		return &types.QueryVerifyWithdrawProofsResponse{
			Valid: false,
			Error: "invalid range proof data",
		}, nil
	}
	copy(rangeProofData.Proof[:], req.RangeProofData[offset:offset+672])

	err = rangeproof.VerifyWithdrawRange(&rangeProofData)
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
