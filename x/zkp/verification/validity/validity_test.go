package validity

import (
	"bytes"
	"encoding/hex"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"

	"github.com/Fairblock/fairyring/x/zkp/verification/common"
	"github.com/Fairblock/fairyring/x/zkp/verification/internal/transcriptgold"
)

func vScalar(tb testing.TB, n uint64) Scalar {
	tb.Helper()
	var s Scalar
	s.SetUint64(n)
	return s
}

func vScalarBytes(tb testing.TB, n uint64) [32]byte {
	tb.Helper()
	s := vScalar(tb, n)
	var out [32]byte
	s.BytesInto(&out)
	return out
}

func vScalarBytesFromScalar(tb testing.TB, s Scalar) [32]byte {
	tb.Helper()
	var out [32]byte
	s.BytesInto(&out)
	return out
}

func vPoint(tb testing.TB, n uint64) Point {
	tb.Helper()
	s := vScalar(tb, n)
	var p Point
	p.ScalarMult(&common.G, &s)
	return p
}

func vPointBytes(tb testing.TB, n uint64) [32]byte {
	tb.Helper()
	p := vPoint(tb, n)
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

func vGroupedCiphertextBytes(tb testing.TB, commit, handle0, handle1 uint64) [96]byte {
	tb.Helper()
	var out [96]byte
	c := vPointBytes(tb, commit)
	h0 := vPointBytes(tb, handle0)
	h1 := vPointBytes(tb, handle1)
	copy(out[0:32], c[:])
	copy(out[32:64], h0[:])
	copy(out[64:96], h1[:])
	return out
}

func vBaseProofBytes(tb testing.TB) [160]byte {
	tb.Helper()
	var out [160]byte
	y0 := vPointBytes(tb, 10)
	y1 := vPointBytes(tb, 11)
	y2 := vPointBytes(tb, 12)
	zr := vScalarBytes(tb, 13)
	zx := vScalarBytes(tb, 14)
	copy(out[0:32], y0[:])
	copy(out[32:64], y1[:])
	copy(out[64:96], y2[:])
	copy(out[96:128], zr[:])
	copy(out[128:160], zx[:])
	return out
}

func vBaseData(tb testing.TB) BatchedGroupedCiphertext2HandlesValidityProofData {
	tb.Helper()
	return BatchedGroupedCiphertext2HandlesValidityProofData{
		Context: BatchedGroupedCiphertext2HandlesValidityProofContext{
			FirstPubkey:         PodElGamalPubkey{Bytes: vPointBytes(tb, 1)},
			SecondPubkey:        PodElGamalPubkey{Bytes: vPointBytes(tb, 2)},
			GroupedCiphertextLo: PodGroupedElGamalCiphertext2Handles{Bytes: vGroupedCiphertextBytes(tb, 3, 4, 5)},
			GroupedCiphertextHi: PodGroupedElGamalCiphertext2Handles{Bytes: vGroupedCiphertextBytes(tb, 6, 7, 8)},
		},
		Proof: PodBatchedGroupedCiphertext2HandlesValidityProof{Bytes: vBaseProofBytes(tb)},
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

func TestValidityProofTranscriptParity(t *testing.T) {
	vec, err := transcriptgold.LoadTranscriptVectors()
	if err != nil {
		t.Fatalf("load golden vectors: %v", err)
	}
	wantT, err := transcriptgold.ParseHex32(vec.Validity.T)
	if err != nil {
		t.Fatalf("golden t: %v", err)
	}
	wantC, err := transcriptgold.ParseHex32(vec.Validity.C)
	if err != nil {
		t.Fatalf("golden c: %v", err)
	}
	wantW, err := transcriptgold.ParseHex32(vec.Validity.W)
	if err != nil {
		t.Fatalf("golden w: %v", err)
	}

	pd := vBaseData(t)
	inner, err := GroupedCiphertext2HandlesValidityProofFromBytes(pd.Proof.Bytes[:])
	if err != nil {
		t.Fatalf("decode proof: %v", err)
	}
	tr := pd.Context.NewTranscript()
	tCh, c, w, err := BatchedGroupedValidityFiatShamirChallenges(tr, inner, 2)
	if err != nil {
		t.Fatalf("fiat-shamir: %v", err)
	}
	if vScalarBytesFromScalar(t, tCh) != wantT {
		t.Fatalf("t does not match golden vector (regenerate with gencmd or fix Rust transcript)")
	}
	if vScalarBytesFromScalar(t, c) != wantC {
		t.Fatalf("c does not match golden vector (regenerate with gencmd or fix Rust transcript)")
	}
	if vScalarBytesFromScalar(t, w) != wantW {
		t.Fatalf("w does not match golden vector (regenerate with gencmd or fix Rust transcript)")
	}
}

func TestValidityProofTranscriptParityCase2(t *testing.T) {
	vec, err := transcriptgold.LoadTranscriptVectors()
	if err != nil {
		t.Fatalf("load golden vectors: %v", err)
	}
	wantT, err := transcriptgold.ParseHex32(vec.ValidityCase2.T)
	if err != nil {
		t.Fatalf("golden case2 t: %v", err)
	}
	wantC, err := transcriptgold.ParseHex32(vec.ValidityCase2.C)
	if err != nil {
		t.Fatalf("golden case2 c: %v", err)
	}
	wantW, err := transcriptgold.ParseHex32(vec.ValidityCase2.W)
	if err != nil {
		t.Fatalf("golden case2 w: %v", err)
	}

	// Matches prover-side deterministic constructor:
	// validity_fixture(22,23,(24,25,26),(27,28,29),30,31,32,33,34)
	pd := BatchedGroupedCiphertext2HandlesValidityProofData{
		Context: BatchedGroupedCiphertext2HandlesValidityProofContext{
			FirstPubkey:         PodElGamalPubkey{Bytes: vPointBytes(t, 22)},
			SecondPubkey:        PodElGamalPubkey{Bytes: vPointBytes(t, 23)},
			GroupedCiphertextLo: PodGroupedElGamalCiphertext2Handles{Bytes: vGroupedCiphertextBytes(t, 24, 25, 26)},
			GroupedCiphertextHi: PodGroupedElGamalCiphertext2Handles{Bytes: vGroupedCiphertextBytes(t, 27, 28, 29)},
		},
		Proof: PodBatchedGroupedCiphertext2HandlesValidityProof{Bytes: func() [160]byte {
			var out [160]byte
			y0 := vPointBytes(t, 30)
			y1 := vPointBytes(t, 31)
			y2 := vPointBytes(t, 32)
			zr := vScalarBytes(t, 33)
			zx := vScalarBytes(t, 34)
			copy(out[0:32], y0[:])
			copy(out[32:64], y1[:])
			copy(out[64:96], y2[:])
			copy(out[96:128], zr[:])
			copy(out[128:160], zx[:])
			return out
		}()},
	}

	inner, err := GroupedCiphertext2HandlesValidityProofFromBytes(pd.Proof.Bytes[:])
	if err != nil {
		t.Fatalf("decode case2 proof: %v", err)
	}
	tr := pd.Context.NewTranscript()
	tCh, c, w, err := BatchedGroupedValidityFiatShamirChallenges(tr, inner, 2)
	if err != nil {
		t.Fatalf("fiat-shamir case2: %v", err)
	}
	if vScalarBytesFromScalar(t, tCh) != wantT {
		t.Fatalf("case2 t does not match golden vector (regenerate with gencmd or fix Rust transcript)")
	}
	if vScalarBytesFromScalar(t, c) != wantC {
		t.Fatalf("case2 c does not match golden vector (regenerate with gencmd or fix Rust transcript)")
	}
	if vScalarBytesFromScalar(t, w) != wantW {
		t.Fatalf("case2 w does not match golden vector (regenerate with gencmd or fix Rust transcript)")
	}
}

func BenchmarkValidityProofVerification(b *testing.B) {
	base := vBaseData(b)
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		pd := base
		_ = VerifyValidityProof(&pd)
	}
}

func BenchmarkValidityProofVerificationRealProof(b *testing.B) {
	type vector struct {
		Family        string `json:"family"`
		ExpectedValid bool   `json:"expected_valid"`
		Payload       struct {
			ProofDataHex string `json:"proof_data_hex"`
		} `json:"payload"`
	}
	type root struct {
		VerificationVectors []vector `json:"verification_vectors"`
	}
	load := func(b *testing.B) root {
		b.Helper()
		_, file, _, ok := runtime.Caller(0)
		if !ok {
			b.Fatal("runtime.Caller failed")
		}
		p := filepath.Join(filepath.Dir(file), "../../../../test-vectors/zkp_verification_vectors.json")
		raw, err := os.ReadFile(p)
		if err != nil {
			b.Fatalf("read vectors: %v", err)
		}
		var r root
		if err := json.Unmarshal(raw, &r); err != nil {
			b.Fatalf("unmarshal vectors: %v", err)
		}
		return r
	}
	decodeHex := func(b *testing.B, s string) []byte {
		b.Helper()
		s = strings.TrimPrefix(strings.ToLower(strings.TrimSpace(s)), "0x")
		out, err := hex.DecodeString(s)
		if err != nil {
			b.Fatalf("decode hex: %v", err)
		}
		return out
	}
	decodeValidity := func(b *testing.B, raw []byte) BatchedGroupedCiphertext2HandlesValidityProofData {
		b.Helper()
		if len(raw) != 416 {
			b.Fatalf("validity proof length: got %d", len(raw))
		}
		var pd BatchedGroupedCiphertext2HandlesValidityProofData
		offset := 0
		copy(pd.Context.FirstPubkey.Bytes[:], raw[offset:offset+32])
		offset += 32
		copy(pd.Context.SecondPubkey.Bytes[:], raw[offset:offset+32])
		offset += 32
		copy(pd.Context.GroupedCiphertextLo.Bytes[:], raw[offset:offset+96])
		offset += 96
		copy(pd.Context.GroupedCiphertextHi.Bytes[:], raw[offset:offset+96])
		offset += 96
		copy(pd.Proof.Bytes[:], raw[offset:offset+160])
		return pd
	}

	var validityRaw []byte
	r := load(b)
	for i := range r.VerificationVectors {
		v := r.VerificationVectors[i]
		if v.ExpectedValid && v.Family == "validity" && v.Payload.ProofDataHex != "" {
			validityRaw = decodeHex(b, v.Payload.ProofDataHex)
			break
		}
	}
	if validityRaw == nil {
		b.Fatal("missing valid validity vector")
	}

	pd := decodeValidity(b, validityRaw)
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_ = VerifyValidityProof(&pd)
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

func vBuildProofObjects(t *testing.T) (*GroupedCiphertext2HandlesValidityProof, *PedersenCommitment, *ElGamalPubkey, *ElGamalPubkey, *DecryptHandle, *DecryptHandle, *BatchedGroupedCiphertext2HandlesValidityProofContext) {
	t.Helper()
	pd := vBaseData(t)
	grouped, err := GroupedElGamalCiphertext2FromPod(pd.Context.GroupedCiphertextLo)
	if err != nil {
		t.Fatalf("grouped ciphertext decode failed: %v", err)
	}
	var first ElGamalPubkey
	if err := first.FromPod(pd.Context.FirstPubkey); err != nil {
		t.Fatalf("first pubkey decode failed: %v", err)
	}
	var second ElGamalPubkey
	if err := second.FromPod(pd.Context.SecondPubkey); err != nil {
		t.Fatalf("second pubkey decode failed: %v", err)
	}
	inner, err := GroupedCiphertext2HandlesValidityProofFromBytes(pd.Proof.Bytes[:])
	if err != nil {
		t.Fatalf("proof decode failed: %v", err)
	}
	return inner, &grouped.Commitment, &first, &second, &grouped.Handles[0], &grouped.Handles[1], &pd.Context
}

func TestGroupedValidityProofVerifyRejectsIdentityInputs(t *testing.T) {
	cases := []struct {
		name string
		mut  func(*PedersenCommitment, *ElGamalPubkey, *ElGamalPubkey, *DecryptHandle, *DecryptHandle)
	}{
		{"identity first pubkey", func(_ *PedersenCommitment, first *ElGamalPubkey, _ *ElGamalPubkey, _ *DecryptHandle, _ *DecryptHandle) {
			first.P.SetZero()
		}},
		{"identity second pubkey", func(_ *PedersenCommitment, _ *ElGamalPubkey, second *ElGamalPubkey, _ *DecryptHandle, _ *DecryptHandle) {
			second.P.SetZero()
		}},
		{"identity commitment", func(c *PedersenCommitment, _ *ElGamalPubkey, _ *ElGamalPubkey, _ *DecryptHandle, _ *DecryptHandle) {
			c.P.SetZero()
		}},
		{"identity first handle", func(_ *PedersenCommitment, _ *ElGamalPubkey, _ *ElGamalPubkey, h0 *DecryptHandle, _ *DecryptHandle) {
			h0.P.SetZero()
		}},
		{"identity second handle", func(_ *PedersenCommitment, _ *ElGamalPubkey, _ *ElGamalPubkey, _ *DecryptHandle, h1 *DecryptHandle) {
			h1.P.SetZero()
		}},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			proof, c, first, second, h0, h1, ctx := vBuildProofObjects(t)
			tt.mut(c, first, second, h0, h1)
			err := proof.Verify(c, first, second, h0, h1, ctx.NewTranscript())
			if !errors.Is(err, ErrValidityInvalidProof) {
				t.Fatalf("expected ErrValidityInvalidProof, got %v", err)
			}
		})
	}
}

func TestGroupedValidityProofVerifyRejectsMalformedPointEncoding(t *testing.T) {
	proof, c, first, second, h0, h1, ctx := vBuildProofObjects(t)
	proof.Y0 = common.CompressedRistretto(vInvalidPointBytes())
	err := proof.Verify(c, first, second, h0, h1, ctx.NewTranscript())
	if !errors.Is(err, common.ErrDeserialization) {
		t.Fatalf("expected point deserialization error, got %v", err)
	}
}
