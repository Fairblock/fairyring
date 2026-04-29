package commitment

import (
	"bytes"
	"errors"
	"testing"

	"github.com/Fairblock/fairyring/x/zkp/verification/common"
)

func cScalar(t *testing.T, v uint64) Scalar {
	t.Helper()
	var s Scalar
	s.SetUint64(v)
	return s
}

func cScalarBytes(t *testing.T, v uint64) [32]byte {
	t.Helper()
	s := cScalar(t, v)
	var out [32]byte
	s.BytesInto(&out)
	return out
}

func cScalarBytesFromScalar(t *testing.T, s Scalar) [32]byte {
	t.Helper()
	var out [32]byte
	s.BytesInto(&out)
	return out
}

func cPoint(t *testing.T, v uint64) Point {
	t.Helper()
	s := cScalar(t, v)
	var p Point
	p.ScalarMult(&common.G, &s)
	return p
}

func cPointBytes(t *testing.T, v uint64) [32]byte {
	t.Helper()
	p := cPoint(t, v)
	var out [32]byte
	p.BytesInto(&out)
	return out
}

func cInvalidPointBytes() [32]byte {
	var out [32]byte
	for i := range out {
		out[i] = 0xff
	}
	return out
}

func cBaseEqualityData(t *testing.T) CiphertextCommitmentEqualityProofData {
	t.Helper()
	return CiphertextCommitmentEqualityProofData{
		Context: CiphertextCommitmentEqualityProofContext{
			Pubkey:     PodElGamalPubkey{Bytes: cPointBytes(t, 2)},
			Ciphertext: PodElGamalCiphertext{Commitment: cPointBytes(t, 3), Handle: cPointBytes(t, 4)},
			Commitment: PodPedersenCommitment{Bytes: cPointBytes(t, 5)},
		},
		Proof: PodCiphertextCommitmentEqualityProof{
			Y0: cPointBytes(t, 6),
			Y1: cPointBytes(t, 7),
			Y2: cPointBytes(t, 8),
			Zs: cScalarBytes(t, 9),
			Zx: cScalarBytes(t, 10),
			Zr: cScalarBytes(t, 11),
		},
	}
}

func cBaseWithdrawData(t *testing.T) WithdrawCiphertextCommitmentEqualityProofData {
	t.Helper()
	base := cBaseEqualityData(t)
	return WithdrawCiphertextCommitmentEqualityProofData{
		Context: WithdrawCiphertextCommitmentEqualityProofContext{
			Pubkey:     base.Context.Pubkey,
			Ciphertext: base.Context.Ciphertext,
			Commitment: base.Context.Commitment,
			Nonce:      PodU64{1, 2, 3, 4, 5, 6, 7, 8},
		},
		Proof: base.Proof,
	}
}

func TestPodCiphertextCommitmentEqualityProofAsBytesLayout(t *testing.T) {
	proof := PodCiphertextCommitmentEqualityProof{
		Y0: cScalarBytes(t, 1),
		Y1: cScalarBytes(t, 2),
		Y2: cScalarBytes(t, 3),
		Zs: cScalarBytes(t, 4),
		Zx: cScalarBytes(t, 5),
		Zr: cScalarBytes(t, 6),
	}
	got := proof.AsBytes()
	fields := [][32]byte{proof.Y0, proof.Y1, proof.Y2, proof.Zs, proof.Zx, proof.Zr}
	for i, want := range fields {
		start := i * U
		if !bytes.Equal(got[start:start+U], want[:]) {
			t.Fatalf("field %d not copied at expected offset", i)
		}
	}
}

func TestElGamalPubkeyFromPod(t *testing.T) {
	var pk ElGamalPubkey
	valid := PodElGamalPubkey{Bytes: cPointBytes(t, 7)}
	if err := pk.FromPod(valid); err != nil {
		t.Fatalf("valid pubkey rejected: %v", err)
	}
	var got [32]byte
	pk.P.BytesInto(&got)
	if got != valid.Bytes {
		t.Fatalf("pubkey round-trip mismatch")
	}

	invalid := PodElGamalPubkey{Bytes: cInvalidPointBytes()}
	if err := pk.FromPod(invalid); err == nil {
		t.Fatal("expected invalid pubkey encoding to fail")
	}
}

func TestElGamalCiphertextFromPod(t *testing.T) {
	valid := PodElGamalCiphertext{Commitment: cPointBytes(t, 3), Handle: cPointBytes(t, 4)}
	var ct ElGamalCiphertext
	if err := ct.FromPod(valid); err != nil {
		t.Fatalf("valid ciphertext rejected: %v", err)
	}
	if ct.Commitment.ToBytes() != valid.Commitment || ct.Handle.ToBytes() != valid.Handle {
		t.Fatalf("ciphertext round-trip mismatch")
	}

	badCommit := valid
	badCommit.Commitment = cInvalidPointBytes()
	if err := ct.FromPod(badCommit); err == nil || err.Error() != "bad C" {
		t.Fatalf("expected bad C error, got %v", err)
	}

	badHandle := valid
	badHandle.Handle = cInvalidPointBytes()
	if err := ct.FromPod(badHandle); err == nil || err.Error() != "bad D" {
		t.Fatalf("expected bad D error, got %v", err)
	}
}

func TestPedersenCommitmentFromPod(t *testing.T) {
	pod := PodPedersenCommitment{Bytes: cPointBytes(t, 11)}
	pc, err := PedersenCommitmentFromPod(pod)
	if err != nil {
		t.Fatalf("valid commitment rejected: %v", err)
	}
	if pc.ToBytes() != pod.Bytes {
		t.Fatalf("commitment round-trip mismatch")
	}

	bad := PodPedersenCommitment{Bytes: cInvalidPointBytes()}
	if _, err := PedersenCommitmentFromPod(bad); err == nil || err.Error() != "bad commit" {
		t.Fatalf("expected bad commit error, got %v", err)
	}
}

func TestEqualityProofFromBytes(t *testing.T) {
	base := cBaseEqualityData(t)
	raw := base.Proof.AsBytes()
	proof, err := EqualityProofFromBytes(&raw)
	if err != nil {
		t.Fatalf("validly encoded proof rejected: %v", err)
	}
	if proof.Y0 != common.CompressedRistretto(base.Proof.Y0) ||
		proof.Y1 != common.CompressedRistretto(base.Proof.Y1) ||
		proof.Y2 != common.CompressedRistretto(base.Proof.Y2) {
		t.Fatalf("proof points decoded in wrong order")
	}
	if cScalarBytesFromScalar(t, proof.Zs) != base.Proof.Zs ||
		cScalarBytesFromScalar(t, proof.Zx) != base.Proof.Zx ||
		cScalarBytesFromScalar(t, proof.Zr) != base.Proof.Zr {
		t.Fatalf("proof scalars decoded in wrong order")
	}
}

func TestEqualityProofFromBytesRejectsNonCanonicalScalars(t *testing.T) {
	base := cBaseEqualityData(t)
	raw := base.Proof.AsBytes()
	for _, off := range []int{3 * U, 4 * U, 5 * U} {
		mutated := raw
		for i := off; i < off+U; i++ {
			mutated[i] = 0xff
		}
		if _, err := EqualityProofFromBytes(&mutated); !errors.Is(err, common.ErrDeserialization) {
			t.Fatalf("expected scalar at offset %d to fail canonical check, got %v", off, err)
		}
	}
}

func TestVerifyEqualityProofRejectsMalformedContext(t *testing.T) {
	cases := []struct {
		name string
		mut  func(*CiphertextCommitmentEqualityProofData)
	}{
		{"bad pubkey", func(pd *CiphertextCommitmentEqualityProofData) { pd.Context.Pubkey.Bytes = cInvalidPointBytes() }},
		{"bad ciphertext commitment", func(pd *CiphertextCommitmentEqualityProofData) {
			pd.Context.Ciphertext.Commitment = cInvalidPointBytes()
		}},
		{"bad ciphertext handle", func(pd *CiphertextCommitmentEqualityProofData) { pd.Context.Ciphertext.Handle = cInvalidPointBytes() }},
		{"bad pedersen commitment", func(pd *CiphertextCommitmentEqualityProofData) { pd.Context.Commitment.Bytes = cInvalidPointBytes() }},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			pd := cBaseEqualityData(t)
			tt.mut(&pd)
			if err := VerifyEqualityProof(&pd); !errors.Is(err, ErrProofDeserialization) {
				t.Fatalf("expected deserialization error, got %v", err)
			}
		})
	}
}

func TestVerifyEqualityProofRejectsMalformedProofScalars(t *testing.T) {
	cases := []struct {
		name string
		mut  func(*CiphertextCommitmentEqualityProofData)
	}{
		{"bad Zs", func(pd *CiphertextCommitmentEqualityProofData) { pd.Proof.Zs = cInvalidPointBytes() }},
		{"bad Zx", func(pd *CiphertextCommitmentEqualityProofData) { pd.Proof.Zx = cInvalidPointBytes() }},
		{"bad Zr", func(pd *CiphertextCommitmentEqualityProofData) { pd.Proof.Zr = cInvalidPointBytes() }},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			pd := cBaseEqualityData(t)
			tt.mut(&pd)
			if err := VerifyEqualityProof(&pd); !errors.Is(err, ErrProofDeserialization) {
				t.Fatalf("expected proof deserialization error, got %v", err)
			}
		})
	}
}

func TestVerifyEqualityProofRejectsMalformedProofPoints(t *testing.T) {
	cases := []struct {
		name string
		mut  func(*CiphertextCommitmentEqualityProofData)
	}{
		{"bad Y0", func(pd *CiphertextCommitmentEqualityProofData) { pd.Proof.Y0 = cInvalidPointBytes() }},
		{"bad Y1", func(pd *CiphertextCommitmentEqualityProofData) { pd.Proof.Y1 = cInvalidPointBytes() }},
		{"bad Y2", func(pd *CiphertextCommitmentEqualityProofData) { pd.Proof.Y2 = cInvalidPointBytes() }},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			pd := cBaseEqualityData(t)
			tt.mut(&pd)
			if err := VerifyEqualityProof(&pd); !errors.Is(err, ErrProofAlgebraic) {
				t.Fatalf("expected proof algebraic error for malformed point, got %v", err)
			}
		})
	}
}

func TestVerifyEqualityProofRejectsAlgebraicallyInvalidButWellFormedProof(t *testing.T) {
	pd := cBaseEqualityData(t)
	if err := VerifyEqualityProof(&pd); !errors.Is(err, ErrProofAlgebraic) {
		t.Fatalf("expected algebraic failure for random well-formed proof, got %v", err)
	}
}

func TestWithdrawTranscriptBindsNonce(t *testing.T) {
	pd := cBaseWithdrawData(t)
	normalCtx := CiphertextCommitmentEqualityProofContext{
		Pubkey:     pd.Context.Pubkey,
		Ciphertext: pd.Context.Ciphertext,
		Commitment: pd.Context.Commitment,
	}

	normal := newSplTranscript(&normalCtx)
	withdraw := newWithdrawSplTranscript(&pd.Context)
	cNormal := common.ChallengeScalar(normal, []byte("c"))
	cWithdraw := common.ChallengeScalar(withdraw, []byte("c"))
	if cScalarBytesFromScalar(t, cNormal) == cScalarBytesFromScalar(t, cWithdraw) {
		t.Fatal("withdraw transcript must differ from non-withdraw transcript because it includes nonce/domain")
	}

	pd2 := pd
	pd2.Context.Nonce[0] ^= 0xff
	withdraw2 := newWithdrawSplTranscript(&pd2.Context)
	cWithdraw2 := common.ChallengeScalar(withdraw2, []byte("c"))
	if cScalarBytesFromScalar(t, cWithdraw) == cScalarBytesFromScalar(t, cWithdraw2) {
		t.Fatal("nonce change must change withdraw transcript challenge")
	}
}

func TestVerifyWithdrawEqualityProofRejectsMalformedContextAndProof(t *testing.T) {
	cases := []struct {
		name string
		mut  func(*WithdrawCiphertextCommitmentEqualityProofData)
	}{
		{"bad pubkey", func(pd *WithdrawCiphertextCommitmentEqualityProofData) {
			pd.Context.Pubkey.Bytes = cInvalidPointBytes()
		}},
		{"bad ciphertext commitment", func(pd *WithdrawCiphertextCommitmentEqualityProofData) {
			pd.Context.Ciphertext.Commitment = cInvalidPointBytes()
		}},
		{"bad ciphertext handle", func(pd *WithdrawCiphertextCommitmentEqualityProofData) {
			pd.Context.Ciphertext.Handle = cInvalidPointBytes()
		}},
		{"bad pedersen commitment", func(pd *WithdrawCiphertextCommitmentEqualityProofData) {
			pd.Context.Commitment.Bytes = cInvalidPointBytes()
		}},
		{"bad Zs", func(pd *WithdrawCiphertextCommitmentEqualityProofData) { pd.Proof.Zs = cInvalidPointBytes() }},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			pd := cBaseWithdrawData(t)
			tt.mut(&pd)
			if err := VerifyWithdrawEqualityProof(&pd); !errors.Is(err, ErrProofDeserialization) {
				t.Fatalf("expected deserialization error, got %v", err)
			}
		})
	}
}

func TestVerifyWithdrawEqualityProofRejectsMalformedPointProof(t *testing.T) {
	pd := cBaseWithdrawData(t)
	pd.Proof.Y0 = cInvalidPointBytes()
	if err := VerifyWithdrawEqualityProof(&pd); !errors.Is(err, ErrProofAlgebraic) {
		t.Fatalf("expected proof algebraic error for malformed point, got %v", err)
	}
}

func TestVerifyWithdrawEqualityProofRejectsAlgebraicallyInvalidButWellFormedProof(t *testing.T) {
	pd := cBaseWithdrawData(t)
	if err := VerifyWithdrawEqualityProof(&pd); !errors.Is(err, ErrProofAlgebraic) {
		t.Fatalf("expected algebraic failure for random well-formed withdraw proof, got %v", err)
	}
}

func cBuildProofObjects(t *testing.T) (*EqualityProof, *ElGamalPubkey, *ElGamalCiphertext, *PedersenCommitment, *CiphertextCommitmentEqualityProofContext) {
	t.Helper()
	pd := cBaseEqualityData(t)
	var pk ElGamalPubkey
	if err := pk.FromPod(pd.Context.Pubkey); err != nil {
		t.Fatalf("pubkey decode failed: %v", err)
	}
	var ct ElGamalCiphertext
	if err := ct.FromPod(pd.Context.Ciphertext); err != nil {
		t.Fatalf("ciphertext decode failed: %v", err)
	}
	cm, err := PedersenCommitmentFromPod(pd.Context.Commitment)
	if err != nil {
		t.Fatalf("commitment decode failed: %v", err)
	}
	raw := pd.Proof.AsBytes()
	proof, err := EqualityProofFromBytes(&raw)
	if err != nil {
		t.Fatalf("proof decode failed: %v", err)
	}
	return proof, &pk, &ct, cm, &pd.Context
}

func TestEqualityProofVerifyRejectsIdentityInputs(t *testing.T) {
	cases := []struct {
		name string
		mut  func(*ElGamalPubkey, *ElGamalCiphertext, *PedersenCommitment)
	}{
		{"identity pubkey", func(pk *ElGamalPubkey, _ *ElGamalCiphertext, _ *PedersenCommitment) { pk.P.SetZero() }},
		{"identity ciphertext commitment", func(_ *ElGamalPubkey, ct *ElGamalCiphertext, _ *PedersenCommitment) {
			ct.Commitment.P.SetZero()
		}},
		{"identity ciphertext handle", func(_ *ElGamalPubkey, ct *ElGamalCiphertext, _ *PedersenCommitment) {
			ct.Handle.P.SetZero()
		}},
		{"identity pedersen commitment", func(_ *ElGamalPubkey, _ *ElGamalCiphertext, cm *PedersenCommitment) {
			cm.P.SetZero()
		}},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			proof, pk, ct, cm, ctx := cBuildProofObjects(t)
			tt.mut(pk, ct, cm)
			err := proof.Verify(pk, ct, cm, newSplTranscript(ctx))
			if !errors.Is(err, ErrProofAlgebraic) {
				t.Fatalf("expected ErrProofAlgebraic, got %v", err)
			}
		})
	}
}

func TestEqualityProofVerifyRejectsMalformedPointEncoding(t *testing.T) {
	proof, pk, ct, cm, ctx := cBuildProofObjects(t)
	proof.Y0 = common.CompressedRistretto(cInvalidPointBytes())
	err := proof.Verify(pk, ct, cm, newSplTranscript(ctx))
	if !errors.Is(err, common.ErrDeserialization) {
		t.Fatalf("expected point deserialization error, got %v", err)
	}
}
