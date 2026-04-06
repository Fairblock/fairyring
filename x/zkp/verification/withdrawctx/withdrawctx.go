// Package withdrawctx performs ZK binding checks for withdrawals: nonce, pubkey,
// ciphertext, and equality/range commitment alignment.
package withdrawctx

import (
	"bytes"
	"encoding/binary"
	"errors"

	"github.com/Fairblock/fairyring/x/zkp/verification/commitment"
	rangeproof "github.com/Fairblock/fairyring/x/zkp/verification/range"
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
