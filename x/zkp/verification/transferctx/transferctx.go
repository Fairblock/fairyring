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
