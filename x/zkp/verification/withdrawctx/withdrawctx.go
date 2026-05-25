// Package withdrawctx performs ZK binding checks for withdrawals: nonce, pubkey,
// ciphertext, and equality/range commitment alignment.
package withdrawctx

import (
	"bytes"
	"encoding/binary"
	"errors"

	"github.com/Fairblock/fairyring/x/zkp/verification/commitment"
	rangeproof "github.com/Fairblock/fairyring/x/zkp/verification/range"
	"github.com/gtank/merlin"
)

func VerifyBindings(
	eq *commitment.WithdrawCiphertextCommitmentEqualityProofData,
	rp *rangeproof.WithdrawBatchedRangeProofU64Data,
	userPK []byte,
	ciphertextC1, ciphertextC2 []byte,
	expectedNonce uint64,
) error {
	if len(userPK) != 32 || len(ciphertextC1) != 32 || len(ciphertextC2) != 32 {
		return errors.New("withdraw binding: invalid input lengths")
	}
	proofNonce := binary.LittleEndian.Uint64(eq.Context.Nonce[:])
	if proofNonce != expectedNonce {
		return errors.New("withdraw equality proof nonce mismatch")
	}
	rangeNonce := binary.LittleEndian.Uint64(rp.Context.Nonce[:])
	if rangeNonce != expectedNonce {
		return errors.New("withdraw range proof nonce mismatch")
	}
	if !bytes.Equal(eq.Context.Pubkey.Bytes[:], userPK) {
		return errors.New("pubkey mismatch")
	}
	if !bytes.Equal(eq.Context.Ciphertext.Commitment[:], ciphertextC1) {
		return errors.New("commitment mismatch")
	}
	if !bytes.Equal(eq.Context.Ciphertext.Handle[:], ciphertextC2) {
		return errors.New("handle mismatch")
	}
	if !bytes.Equal(eq.Context.Commitment.Bytes[:], rp.Context.Commitments[0].Bytes[:]) {
		return errors.New("equality and range proof commitments do not match")
	}
	return nil
}

func NewWithdrawInstructionTranscript(
	eq *commitment.WithdrawCiphertextCommitmentEqualityProofData,
	rp *rangeproof.WithdrawBatchedRangeProofU64Data,
	userPK []byte,
	expectedNonce uint64,
) *merlin.Transcript {
	t := merlin.NewTranscript("withdraw-proof-instruction")

	t.AppendMessage([]byte("user-pubkey"), userPK)

	var nonceBytes [8]byte
	binary.LittleEndian.PutUint64(nonceBytes[:], expectedNonce)
	t.AppendMessage([]byte("nonce"), nonceBytes[:])

	t.AppendMessage([]byte("equality-pubkey"), eq.Context.Pubkey.Bytes[:])
	var eqCt [64]byte
	copy(eqCt[0:32], eq.Context.Ciphertext.Commitment[:])
	copy(eqCt[32:64], eq.Context.Ciphertext.Handle[:])
	t.AppendMessage([]byte("equality-ciphertext"), eqCt[:])
	t.AppendMessage([]byte("equality-commitment"), eq.Context.Commitment.Bytes[:])
	t.AppendMessage([]byte("equality-nonce"), eq.Context.Nonce[:])

	var rangeCommits [8 * 32]byte
	for i := 0; i < 8; i++ {
		copy(rangeCommits[32*i:32*(i+1)], rp.Context.Commitments[i].Bytes[:])
	}
	t.AppendMessage([]byte("range-commitments"), rangeCommits[:])

	var rangeBits [8]byte
	for i := 0; i < 8; i++ {
		rangeBits[i] = rp.Context.BitLengths[i]
	}
	t.AppendMessage([]byte("range-bit-lengths"), rangeBits[:])

	t.AppendMessage([]byte("range-nonce"), rp.Context.Nonce[:])

	return t
}

func VerifyWithdrawProofs(
	eq *commitment.WithdrawCiphertextCommitmentEqualityProofData,
	rp *rangeproof.WithdrawBatchedRangeProofU64Data,
	userPK, ciphertextC1, ciphertextC2 []byte,
	expectedNonce uint64,
) error {
	if err := VerifyBindings(eq, rp, userPK, ciphertextC1, ciphertextC2, expectedNonce); err != nil {
		return err
	}

	transcript := NewWithdrawInstructionTranscript(eq, rp, userPK, expectedNonce)

	if err := commitment.VerifyWithdrawEqualityProofWithTranscript(eq, transcript); err != nil {
		return err
	}
	if err := rangeproof.VerifyWithdrawRangeWithNonceWithTranscript(rp, transcript); err != nil {
		return err
	}
	return nil
}
