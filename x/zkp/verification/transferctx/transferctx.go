// Package transferctx performs ZK binding checks for confidential transfers:
// pubkey consistency, range/equality commitment alignment, and remaining balance.
package transferctx

import (
	"bytes"
	"errors"

	"github.com/Fairblock/fairyring/x/zkp/verification/commitment"
	"github.com/Fairblock/fairyring/x/zkp/verification/common"
	rangeproof "github.com/Fairblock/fairyring/x/zkp/verification/range"
	"github.com/Fairblock/fairyring/x/zkp/verification/validity"
	"github.com/gtank/merlin"
)

// VerifyBindings checks consistency between proofs and expected pubkeys / encrypted balance
func VerifyBindings(
	eq *commitment.CiphertextCommitmentEqualityProofData,
	rp *rangeproof.BatchedRangeProofU128Data,
	vp *validity.BatchedGroupedCiphertext2HandlesValidityProofData,
	currentC1, currentC2, senderPK, recipientPK []byte,
) error {
	if len(senderPK) != 32 || len(recipientPK) != 32 || len(currentC1) != 32 || len(currentC2) != 32 {
		return errors.New("transfer binding: invalid input lengths")
	}
	if !bytes.Equal(vp.Context.FirstPubkey.Bytes[:], senderPK) {
		return errors.New("sender pubkey mismatch")
	}
	if !bytes.Equal(vp.Context.SecondPubkey.Bytes[:], recipientPK) {
		return errors.New("recipient pubkey mismatch")
	}
	if !bytes.Equal(eq.Context.Pubkey.Bytes[:], senderPK) {
		return errors.New("source pubkey mismatch")
	}
	if !bytes.Equal(eq.Context.Commitment.Bytes[:], rp.Context.Commitments[0].Bytes[:]) {
		return errors.New("equality and range proof commitments do not match")
	}

	if !bytes.Equal(vp.Context.GroupedCiphertextLo.Bytes[0:32], rp.Context.Commitments[1].Bytes[:]) {
		return errors.New("transfer amount commitment not bound to range proof")
	}

	gc, err := validity.GroupedElGamalCiphertext2FromBytes(vp.Context.GroupedCiphertextLo.Bytes[:])
	if err != nil {
		return errors.New("failed to deserialize ciphertexts")
	}

	senderCommit := gc.Commitment.ToBytes()
	senderHandle := gc.Handles[0].ToBytes()
	remC1, remC2, err := homomorphicSub(
		currentC1, currentC2,
		senderCommit[:],
		senderHandle[:],
	)
	if err != nil {
		return err
	}
	if !bytes.Equal(remC1[:], eq.Context.Ciphertext.Commitment[:]) {
		return errors.New("remaining balance commitment mismatch")
	}
	if !bytes.Equal(remC2[:], eq.Context.Ciphertext.Handle[:]) {
		return errors.New("remaining balance handle mismatch")
	}
	return nil
}

func NewTransferInstructionTranscript(
	eq *commitment.CiphertextCommitmentEqualityProofData,
	rp *rangeproof.BatchedRangeProofU128Data,
	vp *validity.BatchedGroupedCiphertext2HandlesValidityProofData,
	currentC1, currentC2, senderPK, recipientPK []byte,
) *merlin.Transcript {
	t := merlin.NewTranscript("transfer-proof-instruction")

	t.AppendMessage([]byte("sender-pubkey"), senderPK)
	t.AppendMessage([]byte("recipient-pubkey"), recipientPK)

	var currentCt [64]byte
	copy(currentCt[0:32], currentC1)
	copy(currentCt[32:64], currentC2)
	t.AppendMessage([]byte("current-ciphertext"), currentCt[:])

	t.AppendMessage([]byte("equality-pubkey"), eq.Context.Pubkey.Bytes[:])
	var eqCt [64]byte
	copy(eqCt[0:32], eq.Context.Ciphertext.Commitment[:])
	copy(eqCt[32:64], eq.Context.Ciphertext.Handle[:])
	t.AppendMessage([]byte("equality-ciphertext"), eqCt[:])
	t.AppendMessage([]byte("equality-commitment"), eq.Context.Commitment.Bytes[:])

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

	t.AppendMessage([]byte("validity-first-pubkey"), vp.Context.FirstPubkey.Bytes[:])
	t.AppendMessage([]byte("validity-second-pubkey"), vp.Context.SecondPubkey.Bytes[:])
	t.AppendMessage([]byte("grouped-ciphertext-lo"), vp.Context.GroupedCiphertextLo.Bytes[:])
	t.AppendMessage([]byte("grouped-ciphertext-hi"), vp.Context.GroupedCiphertextHi.Bytes[:])

	return t
}

func VerifyTransferProofs(
	eq *commitment.CiphertextCommitmentEqualityProofData,
	rp *rangeproof.BatchedRangeProofU128Data,
	vp *validity.BatchedGroupedCiphertext2HandlesValidityProofData,
	currentC1, currentC2, senderPK, recipientPK []byte,
) error {
	if err := VerifyBindings(eq, rp, vp, currentC1, currentC2, senderPK, recipientPK); err != nil {
		return err
	}

	transcript := NewTransferInstructionTranscript(eq, rp, vp, currentC1, currentC2, senderPK, recipientPK)

	if err := commitment.VerifyEqualityProofWithTranscript(eq, transcript); err != nil {
		return err
	}
	if err := rangeproof.VerifyTransferRangeWithTranscript(rp, transcript); err != nil {
		return err
	}
	if err := validity.VerifyValidityProofWithTranscript(vp, transcript); err != nil {
		return err
	}
	return nil
}

func homomorphicSub(aC1, aC2, bC1, bC2 []byte) ([32]byte, [32]byte, error) {
	var zero [32]byte
	ac, err := common.PedersenCommitmentFromBytes(aC1)
	if err != nil {
		return zero, zero, errors.New("transfer binding: invalid current balance commitment")
	}
	bc, err := common.PedersenCommitmentFromBytes(bC1)
	if err != nil {
		return zero, zero, errors.New("transfer binding: invalid transfer commitment")
	}
	ah, err := common.DecryptHandleFromBytes(aC2)
	if err != nil {
		return zero, zero, errors.New("transfer binding: invalid current balance handle")
	}
	bh, err := common.DecryptHandleFromBytes(bC2)
	if err != nil {
		return zero, zero, errors.New("transfer binding: invalid transfer handle")
	}
	var rc, rh common.Point
	rc.Sub(ac.GetPoint(), bc.GetPoint())
	rh.Sub(ah.GetPoint(), bh.GetPoint())
	var outC, outH [32]byte
	rc.BytesInto(&outC)
	rh.BytesInto(&outH)
	return outC, outH, nil
}
