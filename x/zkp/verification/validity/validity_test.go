package validity

import (
	"bytes"
	"errors"
	"testing"

	"github.com/Fairblock/fairyring/x/zkp/verification/common"
)

func vScalar(t *testing.T, n uint64) Scalar {
	t.Helper()
	var s Scalar
	s.SetUint64(n)
	return s
}

func vScalarBytes(t *testing.T, n uint64) [32]byte {
	t.Helper()
	s := vScalar(t, n)
	var out [32]byte
	s.BytesInto(&out)
	return out
}

func vScalarBytesFromScalar(t *testing.T, s Scalar) [32]byte {
	t.Helper()
	var out [32]byte
	s.BytesInto(&out)
	return out
}

func vPoint(t *testing.T, n uint64) Point {
	t.Helper()
	s := vScalar(t, n)
	var p Point
	p.ScalarMult(&common.G, &s)
	return p
}

func vPointBytes(t *testing.T, n uint64) [32]byte {
	t.Helper()
	p := vPoint(t, n)
	var out [32]byte
	p.BytesInto(&out)
	return out
}

func vInvalidPointBytes() [32]byte {
	var out [32]byte
	for i := range out {
		out[i] = 0xff
	}
	return out
}

func vGroupedCiphertextBytes(t *testing.T, commit, handle0, handle1 uint64) [96]byte {
	t.Helper()
	var out [96]byte
	c := vPointBytes(t, commit)
	h0 := vPointBytes(t, handle0)
	h1 := vPointBytes(t, handle1)
	copy(out[0:32], c[:])
	copy(out[32:64], h0[:])
	copy(out[64:96], h1[:])
	return out
}

func vBaseProofBytes(t *testing.T) [160]byte {
	t.Helper()
	var out [160]byte
	y0 := vPointBytes(t, 10)
	y1 := vPointBytes(t, 11)
	y2 := vPointBytes(t, 12)
	zr := vScalarBytes(t, 13)
	zx := vScalarBytes(t, 14)
	copy(out[0:32], y0[:])
	copy(out[32:64], y1[:])
	copy(out[64:96], y2[:])
	copy(out[96:128], zr[:])
	copy(out[128:160], zx[:])
	return out
}

func vBaseData(t *testing.T) BatchedGroupedCiphertext2HandlesValidityProofData {
	t.Helper()
	return BatchedGroupedCiphertext2HandlesValidityProofData{
		Context: BatchedGroupedCiphertext2HandlesValidityProofContext{
			FirstPubkey:         PodElGamalPubkey{Bytes: vPointBytes(t, 1)},
			SecondPubkey:        PodElGamalPubkey{Bytes: vPointBytes(t, 2)},
			GroupedCiphertextLo: PodGroupedElGamalCiphertext2Handles{Bytes: vGroupedCiphertextBytes(t, 3, 4, 5)},
			GroupedCiphertextHi: PodGroupedElGamalCiphertext2Handles{Bytes: vGroupedCiphertextBytes(t, 6, 7, 8)},
		},
		Proof: PodBatchedGroupedCiphertext2HandlesValidityProof{Bytes: vBaseProofBytes(t)},
	}
}

func TestElGamalPubkeyFromPod(t *testing.T) {
	pod := PodElGamalPubkey{Bytes: vPointBytes(t, 7)}
	var pk ElGamalPubkey
	if err := pk.FromPod(pod); err != nil {
		t.Fatalf("valid pubkey rejected: %v", err)
	}
	var got [32]byte
	pk.P.BytesInto(&got)
	if got != pod.Bytes {
		t.Fatalf("pubkey round-trip mismatch")
	}

	bad := PodElGamalPubkey{Bytes: vInvalidPointBytes()}
	if err := pk.FromPod(bad); !errors.Is(err, ErrElGamalPubkeyDeserialization) {
		t.Fatalf("expected pubkey deserialization error, got %v", err)
	}
}

func TestGroupedElGamalCiphertext2RoundTrip(t *testing.T) {
	encoded := vGroupedCiphertextBytes(t, 3, 4, 5)
	ct, err := GroupedElGamalCiphertext2FromBytes(encoded[:])
	if err != nil {
		t.Fatalf("valid grouped ciphertext rejected: %v", err)
	}
	if ct.expectedByteLength() != 96 {
		t.Fatalf("unexpected byte length: %d", ct.expectedByteLength())
	}
	if got := ct.ToBytes(); !bytes.Equal(got, encoded[:]) {
		t.Fatalf("grouped ciphertext round-trip mismatch")
	}

	fromPod, err := GroupedElGamalCiphertext2FromPod(PodGroupedElGamalCiphertext2Handles{Bytes: encoded})
	if err != nil {
		t.Fatalf("valid pod grouped ciphertext rejected: %v", err)
	}
	if !bytes.Equal(fromPod.ToBytes(), encoded[:]) {
		t.Fatalf("pod grouped ciphertext round-trip mismatch")
	}
}

func TestGroupedElGamalCiphertext2RejectsMalformedInput(t *testing.T) {
	if _, err := GroupedElGamalCiphertext2FromBytes(make([]byte, 95)); !errors.Is(err, ErrElGamalCiphertextDeserialization) {
		t.Fatalf("expected grouped ciphertext length error, got %v", err)
	}

	cases := []struct {
		name string
		from int
		to   int
	}{
		{"bad commitment", 0, 32},
		{"bad handle 0", 32, 64},
		{"bad handle 1", 64, 96},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			encoded := vGroupedCiphertextBytes(t, 3, 4, 5)
			for i := tt.from; i < tt.to; i++ {
				encoded[i] = 0xff
			}
			if _, err := GroupedElGamalCiphertext2FromBytes(encoded[:]); err == nil {
				t.Fatal("expected invalid point encoding to fail")
			}
		})
	}
}

func TestGroupedCiphertext2HandlesValidityProofFromBytes(t *testing.T) {
	raw := vBaseProofBytes(t)
	proof, err := GroupedCiphertext2HandlesValidityProofFromBytes(raw[:])
	if err != nil {
		t.Fatalf("validly encoded proof rejected: %v", err)
	}
	if proof.Y0 != common.CompressedRistretto(vPointBytes(t, 10)) ||
		proof.Y1 != common.CompressedRistretto(vPointBytes(t, 11)) ||
		proof.Y2 != common.CompressedRistretto(vPointBytes(t, 12)) {
		t.Fatalf("proof points decoded in wrong order")
	}
	if vScalarBytesFromScalar(t, proof.Zr) != vScalarBytes(t, 13) ||
		vScalarBytesFromScalar(t, proof.Zx) != vScalarBytes(t, 14) {
		t.Fatalf("proof scalars decoded in wrong order")
	}
}

func TestGroupedCiphertext2HandlesValidityProofFromBytesRejectsMalformedInput(t *testing.T) {
	if _, err := GroupedCiphertext2HandlesValidityProofFromBytes(make([]byte, 159)); !errors.Is(err, ErrValidityDeserialization) {
		t.Fatalf("expected proof length error, got %v", err)
	}

	cases := []struct {
		name string
		from int
		to   int
	}{
		{"bad Y0", 0, 32},
		{"bad Y1", 32, 64},
		{"bad Y2", 64, 96},
		{"bad Zr", 96, 128},
		{"bad Zx", 128, 160},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			raw := vBaseProofBytes(t)
			for i := tt.from; i < tt.to; i++ {
				raw[i] = 0xff
			}
			if _, err := GroupedCiphertext2HandlesValidityProofFromBytes(raw[:]); err == nil {
				t.Fatal("expected malformed proof field to fail")
			}
		})
	}
}

func TestBatchedGroupedCiphertext2HandlesValidityProofFromBytes(t *testing.T) {
	raw := vBaseProofBytes(t)
	proof, err := BatchedGroupedCiphertext2HandlesValidityProofFromBytes(raw[:])
	if err != nil {
		t.Fatalf("validly encoded batched proof rejected: %v", err)
	}
	if proof.Inner.Y0 != common.CompressedRistretto(vPointBytes(t, 10)) {
		t.Fatalf("inner proof not populated")
	}

	pod := PodBatchedGroupedCiphertext2HandlesValidityProof{Bytes: raw}
	fromPod, err := pod.ToProof()
	if err != nil {
		t.Fatalf("pod.ToProof rejected valid encoding: %v", err)
	}
	if fromPod.Inner.Y1 != proof.Inner.Y1 {
		t.Fatalf("pod proof mismatch")
	}
}

func TestValidityTranscriptDeterministicAndContextSensitive(t *testing.T) {
	pd := vBaseData(t)
	challenge := func(ctx BatchedGroupedCiphertext2HandlesValidityProofContext) [32]byte {
		tr := ctx.NewTranscript()
		s := common.ChallengeScalar(tr, []byte("t"))
		return vScalarBytesFromScalar(t, s)
	}

	if challenge(pd.Context) != challenge(pd.Context) {
		t.Fatal("same validity context did not produce deterministic challenge")
	}
	mutated := pd.Context
	mutated.SecondPubkey.Bytes[0] ^= 0x01
	if challenge(pd.Context) == challenge(mutated) {
		t.Fatal("mutating context did not change transcript challenge")
	}
}

func TestVerifyValidityProofRejectsMalformedContext(t *testing.T) {
	cases := []struct {
		name string
		mut  func(*BatchedGroupedCiphertext2HandlesValidityProofData)
	}{
		{"bad first pubkey", func(pd *BatchedGroupedCiphertext2HandlesValidityProofData) {
			pd.Context.FirstPubkey.Bytes = vInvalidPointBytes()
		}},
		{"bad second pubkey", func(pd *BatchedGroupedCiphertext2HandlesValidityProofData) {
			pd.Context.SecondPubkey.Bytes = vInvalidPointBytes()
		}},
		{"bad grouped lo", func(pd *BatchedGroupedCiphertext2HandlesValidityProofData) {
			for i := 0; i < 32; i++ {
				pd.Context.GroupedCiphertextLo.Bytes[i] = 0xff
			}
		}},
		{"bad grouped hi", func(pd *BatchedGroupedCiphertext2HandlesValidityProofData) {
			for i := 0; i < 32; i++ {
				pd.Context.GroupedCiphertextHi.Bytes[i] = 0xff
			}
		}},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			pd := vBaseData(t)
			tt.mut(&pd)
			if err := VerifyValidityProof(&pd); !errors.Is(err, ErrValidityInvalidProof) {
				t.Fatalf("expected invalid proof error, got %v", err)
			}
		})
	}
}

func TestVerifyValidityProofRejectsMalformedProof(t *testing.T) {
	for _, off := range []int{0, 32, 64, 96, 128} {
		pd := vBaseData(t)
		for i := off; i < off+32; i++ {
			pd.Proof.Bytes[i] = 0xff
		}
		if err := VerifyValidityProof(&pd); !errors.Is(err, ErrValidityInvalidProof) {
			t.Fatalf("expected invalid proof error for field offset %d, got %v", off, err)
		}
	}
}

func TestVerifyValidityProofRejectsAlgebraicallyInvalidButWellFormedProof(t *testing.T) {
	pd := vBaseData(t)
	if err := VerifyValidityProof(&pd); !errors.Is(err, ErrValidityInvalidProof) {
		t.Fatalf("expected random well-formed validity proof to fail, got %v", err)
	}
}
