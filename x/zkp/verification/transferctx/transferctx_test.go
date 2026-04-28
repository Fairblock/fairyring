package transferctx

import (
	"errors"
	"strings"
	"testing"

	"github.com/Fairblock/fairyring/x/zkp/verification/commitment"
	"github.com/Fairblock/fairyring/x/zkp/verification/common"
	rangeproof "github.com/Fairblock/fairyring/x/zkp/verification/range"
	"github.com/Fairblock/fairyring/x/zkp/verification/validity"
)

type transferBindingFixture struct {
	eq          commitment.CiphertextCommitmentEqualityProofData
	rp          rangeproof.BatchedRangeProofU128Data
	vp          validity.BatchedGroupedCiphertext2HandlesValidityProofData
	currentC1   [32]byte
	currentC2   [32]byte
	senderPK    [32]byte
	recipientPK [32]byte
	transferC1  [32]byte
	transferC2  [32]byte
	remainingC1 [32]byte
	remainingC2 [32]byte
}

func tcScalar(t *testing.T, n uint64) common.Scalar {
	t.Helper()
	var s common.Scalar
	s.SetUint64(n)
	return s
}

func tcPoint(t *testing.T, n uint64) common.Point {
	t.Helper()
	s := tcScalar(t, n)
	var p common.Point
	p.ScalarMult(&common.G, &s)
	return p
}

func tcPointBytes(t *testing.T, n uint64) [32]byte {
	t.Helper()
	p := tcPoint(t, n)
	var out [32]byte
	p.BytesInto(&out)
	return out
}

func tcAddPointBytes(t *testing.T, a, b [32]byte) [32]byte {
	t.Helper()
	ap, err := common.PedersenCommitmentFromBytes(a[:])
	if err != nil {
		t.Fatalf("decode a: %v", err)
	}
	bp, err := common.PedersenCommitmentFromBytes(b[:])
	if err != nil {
		t.Fatalf("decode b: %v", err)
	}
	var out common.Point
	out.Add(ap.GetPoint(), bp.GetPoint())
	var encoded [32]byte
	out.BytesInto(&encoded)
	return encoded
}

func tcInvalidBytes() [32]byte {
	var out [32]byte
	for i := range out {
		out[i] = 0xff
	}
	return out
}

func tcFixture(t *testing.T) transferBindingFixture {
	t.Helper()
	senderPK := tcPointBytes(t, 1)
	recipientPK := tcPointBytes(t, 2)
	transferC1 := tcPointBytes(t, 3)
	transferC2 := tcPointBytes(t, 4)
	transferRecipientHandle := tcPointBytes(t, 5)
	remainingC1 := tcPointBytes(t, 6)
	remainingC2 := tcPointBytes(t, 7)
	currentC1 := tcAddPointBytes(t, transferC1, remainingC1)
	currentC2 := tcAddPointBytes(t, transferC2, remainingC2)
	eqCommitment := tcPointBytes(t, 8)

	var groupedLo [96]byte
	copy(groupedLo[0:32], transferC1[:])
	copy(groupedLo[32:64], transferC2[:])
	copy(groupedLo[64:96], transferRecipientHandle[:])

	var groupedHi [96]byte
	hiCommitment := tcPointBytes(t, 9)
	hiSenderHandle := tcPointBytes(t, 10)
	hiRecipientHandle := tcPointBytes(t, 11)
	copy(groupedHi[0:32], hiCommitment[:])
	copy(groupedHi[32:64], hiSenderHandle[:])
	copy(groupedHi[64:96], hiRecipientHandle[:])

	fx := transferBindingFixture{
		currentC1:   currentC1,
		currentC2:   currentC2,
		senderPK:    senderPK,
		recipientPK: recipientPK,
		transferC1:  transferC1,
		transferC2:  transferC2,
		remainingC1: remainingC1,
		remainingC2: remainingC2,
	}

	fx.eq.Context.Pubkey.Bytes = senderPK
	fx.eq.Context.Ciphertext.Commitment = remainingC1
	fx.eq.Context.Ciphertext.Handle = remainingC2
	fx.eq.Context.Commitment.Bytes = eqCommitment

	fx.rp.Context.Commitments[0].Bytes = eqCommitment
	fx.rp.Context.Commitments[1].Bytes = transferC1
	fx.rp.Context.BitLengths[0] = 64
	fx.rp.Context.BitLengths[1] = 64

	fx.vp.Context.FirstPubkey.Bytes = senderPK
	fx.vp.Context.SecondPubkey.Bytes = recipientPK
	fx.vp.Context.GroupedCiphertextLo.Bytes = groupedLo
	fx.vp.Context.GroupedCiphertextHi.Bytes = groupedHi

	return fx
}

func TestVerifyBindingsSuccess(t *testing.T) {
	fx := tcFixture(t)
	if err := VerifyBindings(
		&fx.eq,
		&fx.rp,
		&fx.vp,
		fx.currentC1[:],
		fx.currentC2[:],
		fx.senderPK[:],
		fx.recipientPK[:],
	); err != nil {
		t.Fatalf("expected bindings to verify, got %v", err)
	}
}

func TestVerifyBindingsRejectsInvalidInputLengths(t *testing.T) {
	fx := tcFixture(t)
	cases := []struct {
		name        string
		currentC1   []byte
		currentC2   []byte
		senderPK    []byte
		recipientPK []byte
	}{
		{"current C1", fx.currentC1[:31], fx.currentC2[:], fx.senderPK[:], fx.recipientPK[:]},
		{"current C2", fx.currentC1[:], fx.currentC2[:31], fx.senderPK[:], fx.recipientPK[:]},
		{"sender pubkey", fx.currentC1[:], fx.currentC2[:], fx.senderPK[:31], fx.recipientPK[:]},
		{"recipient pubkey", fx.currentC1[:], fx.currentC2[:], fx.senderPK[:], fx.recipientPK[:31]},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			err := VerifyBindings(&fx.eq, &fx.rp, &fx.vp, tt.currentC1, tt.currentC2, tt.senderPK, tt.recipientPK)
			if err == nil || err.Error() != "transfer binding: invalid input lengths" {
				t.Fatalf("expected invalid length error, got %v", err)
			}
		})
	}
}

func TestVerifyBindingsRejectsPubkeyMismatches(t *testing.T) {
	cases := []struct {
		name string
		mut  func(*transferBindingFixture)
		want string
	}{
		{"sender in validity", func(fx *transferBindingFixture) { fx.vp.Context.FirstPubkey.Bytes = tcPointBytes(t, 21) }, "sender pubkey mismatch"},
		{"recipient in validity", func(fx *transferBindingFixture) { fx.vp.Context.SecondPubkey.Bytes = tcPointBytes(t, 22) }, "recipient pubkey mismatch"},
		{"source in equality", func(fx *transferBindingFixture) { fx.eq.Context.Pubkey.Bytes = tcPointBytes(t, 23) }, "source pubkey mismatch"},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			fx := tcFixture(t)
			tt.mut(&fx)
			err := VerifyBindings(&fx.eq, &fx.rp, &fx.vp, fx.currentC1[:], fx.currentC2[:], fx.senderPK[:], fx.recipientPK[:])
			if err == nil || err.Error() != tt.want {
				t.Fatalf("expected %q, got %v", tt.want, err)
			}
		})
	}
}

func TestVerifyBindingsRejectsCommitmentMismatches(t *testing.T) {
	cases := []struct {
		name string
		mut  func(*transferBindingFixture)
		want string
	}{
		{"equality range mismatch", func(fx *transferBindingFixture) { fx.rp.Context.Commitments[0].Bytes = tcPointBytes(t, 24) }, "equality and range proof commitments do not match"},
		{"transfer amount range mismatch", func(fx *transferBindingFixture) { fx.rp.Context.Commitments[1].Bytes = tcPointBytes(t, 25) }, "transfer amount commitment not bound to range proof"},
		{"remaining commitment mismatch", func(fx *transferBindingFixture) { fx.eq.Context.Ciphertext.Commitment = tcPointBytes(t, 26) }, "remaining balance commitment mismatch"},
		{"remaining handle mismatch", func(fx *transferBindingFixture) { fx.eq.Context.Ciphertext.Handle = tcPointBytes(t, 27) }, "remaining balance handle mismatch"},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			fx := tcFixture(t)
			tt.mut(&fx)
			err := VerifyBindings(&fx.eq, &fx.rp, &fx.vp, fx.currentC1[:], fx.currentC2[:], fx.senderPK[:], fx.recipientPK[:])
			if err == nil || err.Error() != tt.want {
				t.Fatalf("expected %q, got %v", tt.want, err)
			}
		})
	}
}

func TestVerifyBindingsRejectsInvalidGroupedCiphertext(t *testing.T) {
	fx := tcFixture(t)
	bad := tcInvalidBytes()
	copy(fx.vp.Context.GroupedCiphertextLo.Bytes[0:32], bad[:])
	// Keep the raw binding equal so this test reaches GroupedElGamalCiphertext2FromBytes.
	// The malformed bytes should fail during grouped ciphertext deserialization,
	// not at the earlier byte-equality binding check.
	fx.rp.Context.Commitments[1].Bytes = bad

	err := VerifyBindings(&fx.eq, &fx.rp, &fx.vp, fx.currentC1[:], fx.currentC2[:], fx.senderPK[:], fx.recipientPK[:])
	if err == nil || err.Error() != "failed to deserialize ciphertexts" {
		t.Fatalf("expected grouped ciphertext deserialization error, got %v", err)
	}
}

func TestVerifyBindingsRejectsInvalidCurrentOrTransferCiphertextEncoding(t *testing.T) {
	cases := []struct {
		name string
		mut  func(*transferBindingFixture) ([]byte, []byte)
		want string
	}{
		{"current commitment", func(fx *transferBindingFixture) ([]byte, []byte) {
			bad := tcInvalidBytes()
			return bad[:], fx.currentC2[:]
		}, "transfer binding: invalid current balance commitment"},
		{"current handle", func(fx *transferBindingFixture) ([]byte, []byte) {
			bad := tcInvalidBytes()
			return fx.currentC1[:], bad[:]
		}, "transfer binding: invalid current balance handle"},
		{"transfer commitment", func(fx *transferBindingFixture) ([]byte, []byte) {
			bad := tcInvalidBytes()
			copy(fx.vp.Context.GroupedCiphertextLo.Bytes[0:32], bad[:])
			fx.rp.Context.Commitments[1].Bytes = bad
			return fx.currentC1[:], fx.currentC2[:]
		}, "failed to deserialize ciphertexts"},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			fx := tcFixture(t)
			currentC1, currentC2 := tt.mut(&fx)
			err := VerifyBindings(&fx.eq, &fx.rp, &fx.vp, currentC1, currentC2, fx.senderPK[:], fx.recipientPK[:])
			if err == nil || err.Error() != tt.want {
				t.Fatalf("expected %q, got %v", tt.want, err)
			}
		})
	}
}

func TestHomomorphicSubMatchesPointSubtraction(t *testing.T) {
	aC1 := tcPointBytes(t, 31)
	aC2 := tcPointBytes(t, 32)
	bC1 := tcPointBytes(t, 33)
	bC2 := tcPointBytes(t, 34)

	gotC1, gotC2, err := homomorphicSub(aC1[:], aC2[:], bC1[:], bC2[:])
	if err != nil {
		t.Fatalf("homomorphicSub: %v", err)
	}

	decodePoint := func(label string, b [32]byte) *common.Point {
		pc, err := common.PedersenCommitmentFromBytes(b[:])
		if err != nil {
			t.Fatalf("decode %s: %v", label, err)
		}
		return pc.GetPoint()
	}
	var wantC1, wantC2 common.Point
	wantC1.Sub(decodePoint("aC1", aC1), decodePoint("bC1", bC1))
	wantC2.Sub(decodePoint("aC2", aC2), decodePoint("bC2", bC2))
	var wantC1Bytes, wantC2Bytes [32]byte
	wantC1.BytesInto(&wantC1Bytes)
	wantC2.BytesInto(&wantC2Bytes)
	if gotC1 != wantC1Bytes || gotC2 != wantC2Bytes {
		t.Fatalf("homomorphicSub mismatch")
	}
}

func TestHomomorphicSubRejectsMalformedInputs(t *testing.T) {
	valid := tcPointBytes(t, 1)
	bad := tcInvalidBytes()
	cases := []struct {
		name string
		aC1  []byte
		aC2  []byte
		bC1  []byte
		bC2  []byte
		want string
	}{
		{"current commitment", bad[:], valid[:], valid[:], valid[:], "transfer binding: invalid current balance commitment"},
		{"transfer commitment", valid[:], valid[:], bad[:], valid[:], "transfer binding: invalid transfer commitment"},
		{"current handle", valid[:], bad[:], valid[:], valid[:], "transfer binding: invalid current balance handle"},
		{"transfer handle", valid[:], valid[:], valid[:], bad[:], "transfer binding: invalid transfer handle"},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			_, _, err := homomorphicSub(tt.aC1, tt.aC2, tt.bC1, tt.bC2)
			if err == nil || err.Error() != tt.want {
				t.Fatalf("expected %q, got %v", tt.want, err)
			}
		})
	}
}

func TestVerifyBindingsErrorsAreSpecific(t *testing.T) {
	fx := tcFixture(t)
	fx.eq.Context.Ciphertext.Commitment[0] ^= 0x01
	err := VerifyBindings(&fx.eq, &fx.rp, &fx.vp, fx.currentC1[:], fx.currentC2[:], fx.senderPK[:], fx.recipientPK[:])
	if err == nil {
		t.Fatal("expected error")
	}
	if errors.Is(err, common.ErrDeserialization) {
		t.Fatalf("binding errors should be contextualized strings, got sentinel: %v", err)
	}
	if !strings.Contains(err.Error(), "remaining balance commitment") {
		t.Fatalf("unexpected error: %v", err)
	}
}
