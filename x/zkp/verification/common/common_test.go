package common

import (
	"bytes"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/gtank/merlin"
)

type sharedGeneratorVectors struct {
	H      string            `json:"h"`
	GChain map[string]string `json:"g_chain"`
	HChain map[string]string `json:"h_chain"`
}

func testScalar(t *testing.T, v uint64) Scalar {
	t.Helper()
	var s Scalar
	s.SetUint64(v)
	return s
}

func testPoint(t *testing.T, v uint64) Point {
	t.Helper()
	s := testScalar(t, v)
	var p Point
	p.ScalarMult(&G, &s)
	return p
}

func testPointBytes(t *testing.T, v uint64) [32]byte {
	t.Helper()
	p := testPoint(t, v)
	var out [32]byte
	p.BytesInto(&out)
	return out
}

func testScalarBytes(t *testing.T, v uint64) [32]byte {
	t.Helper()
	s := testScalar(t, v)
	var out [32]byte
	s.BytesInto(&out)
	return out
}

func testScalarBytesFromScalar(t *testing.T, s Scalar) [32]byte {
	t.Helper()
	var out [32]byte
	s.BytesInto(&out)
	return out
}

func TestCompressedRistrettoRoundTrip(t *testing.T) {
	encoded := testPointBytes(t, 7)
	comp := CompressedRistretto(encoded)

	decoded, ok := comp.Decompress()
	if !ok {
		t.Fatal("expected valid compressed point to decompress")
	}

	var roundTrip [32]byte
	decoded.BytesInto(&roundTrip)
	if roundTrip != encoded {
		t.Fatalf("round-trip mismatch: got %x want %x", roundTrip, encoded)
	}
	if comp.Bytes() != encoded {
		t.Fatalf("Bytes returned different encoding")
	}
	if comp.IsIdentity() {
		t.Fatalf("non-identity point reported as identity")
	}
}

func TestCompressedRistrettoRejectsInvalidEncoding(t *testing.T) {
	invalid := CompressedRistretto{}
	for i := range invalid {
		invalid[i] = 0xff
	}

	if _, ok := invalid.Decompress(); ok {
		t.Fatal("expected all-0xff encoding to fail decompression")
	}
	if invalid.IsIdentity() {
		t.Fatal("invalid encoding must not be reported as identity")
	}
}

func TestIdentityRejectedByValidateAndAppendPoint(t *testing.T) {
	var zero Point
	zero.SetZero()
	var encoded [32]byte
	zero.BytesInto(&encoded)
	comp := CompressedRistretto(encoded)

	if !comp.IsIdentity() {
		t.Fatal("test setup expected encoded zero point to be identity")
	}

	err := ValidateAndAppendPoint(merlin.NewTranscript("identity-reject"), []byte("P"), &comp)
	if !errors.Is(err, ErrDeserialization) {
		t.Fatalf("expected ErrDeserialization for identity point, got %v", err)
	}
}

func TestValidateAndAppendPointTranscriptSensitivity(t *testing.T) {
	p := CompressedRistretto(testPointBytes(t, 11))

	t1 := merlin.NewTranscript("same")
	t2 := merlin.NewTranscript("same")
	if err := ValidateAndAppendPoint(t1, []byte("A"), &p); err != nil {
		t.Fatalf("append point to t1: %v", err)
	}
	if err := ValidateAndAppendPoint(t2, []byte("B"), &p); err != nil {
		t.Fatalf("append point to t2: %v", err)
	}

	c1 := ChallengeScalar(t1, []byte("challenge"))
	c2 := ChallengeScalar(t2, []byte("challenge"))
	if testScalarBytesFromScalar(t, c1) == testScalarBytesFromScalar(t, c2) {
		t.Fatal("different transcript labels unexpectedly produced same challenge")
	}
}

func TestRistrettoPointFromSlice(t *testing.T) {
	valid := testPointBytes(t, 3)
	got, err := RistrettoPointFromSlice(valid[:])
	if err != nil {
		t.Fatalf("valid point rejected: %v", err)
	}
	if got != CompressedRistretto(valid) {
		t.Fatalf("unexpected compressed point: got %x want %x", got, valid)
	}

	if _, err := RistrettoPointFromSlice(valid[:31]); !errors.Is(err, ErrDeserialization) {
		t.Fatalf("expected short point to fail deserialization, got %v", err)
	}

	invalid := bytes.Repeat([]byte{0xff}, 32)
	if _, err := RistrettoPointFromSlice(invalid); !errors.Is(err, ErrDeserialization) {
		t.Fatalf("expected invalid point to fail deserialization, got %v", err)
	}
}

func TestCanonicalScalarFromSlice(t *testing.T) {
	valid := testScalarBytes(t, 42)
	s, err := CanonicalScalarFromSlice(valid[:])
	if err != nil {
		t.Fatalf("valid scalar rejected: %v", err)
	}
	if testScalarBytesFromScalar(t, s) != valid {
		t.Fatalf("scalar round-trip mismatch")
	}

	if _, err := CanonicalScalarFromSlice(valid[:31]); !errors.Is(err, ErrDeserialization) {
		t.Fatalf("expected short scalar to fail deserialization, got %v", err)
	}

	invalid := bytes.Repeat([]byte{0xff}, 32)
	if _, err := CanonicalScalarFromSlice(invalid); !errors.Is(err, ErrDeserialization) {
		t.Fatalf("expected non-canonical scalar to fail deserialization, got %v", err)
	}
}

func TestPedersenCommitmentAndDecryptHandleFromBytes(t *testing.T) {
	encoded := testPointBytes(t, 17)

	pc, err := PedersenCommitmentFromBytes(encoded[:])
	if err != nil {
		t.Fatalf("commitment decode failed: %v", err)
	}
	if pc.ToBytes() != encoded {
		t.Fatalf("commitment round-trip mismatch")
	}

	dh, err := DecryptHandleFromBytes(encoded[:])
	if err != nil {
		t.Fatalf("handle decode failed: %v", err)
	}
	if dh.ToBytes() != encoded {
		t.Fatalf("handle round-trip mismatch")
	}

	if _, err := PedersenCommitmentFromBytes(encoded[:31]); !errors.Is(err, ErrDeserialization) {
		t.Fatalf("expected short commitment to fail, got %v", err)
	}
	if _, err := DecryptHandleFromBytes(encoded[:31]); !errors.Is(err, ErrDeserialization) {
		t.Fatalf("expected short handle to fail, got %v", err)
	}

	invalid := bytes.Repeat([]byte{0xff}, 32)
	if _, err := PedersenCommitmentFromBytes(invalid); !errors.Is(err, ErrDeserialization) {
		t.Fatalf("expected invalid commitment to fail, got %v", err)
	}
	if _, err := DecryptHandleFromBytes(invalid); !errors.Is(err, ErrDeserialization) {
		t.Fatalf("expected invalid handle to fail, got %v", err)
	}
}

func TestPedersenAndDecryptHandleOperations(t *testing.T) {
	p1 := testPoint(t, 5)
	p2 := testPoint(t, 9)
	pc1 := NewPedersenCommitment(&p1)
	pc2 := NewPedersenCommitment(&p2)

	gotAdd := pc1.Add(&pc2)
	var wantPoint Point
	wantPoint.Add(&p1, &p2)
	want := NewPedersenCommitment(&wantPoint)
	if gotAdd.ToBytes() != want.ToBytes() {
		t.Fatalf("commitment Add mismatch")
	}

	s := testScalar(t, 13)
	gotMul := pc1.ScalarMul(&s)
	var wantMulPoint Point
	wantMulPoint.ScalarMult(&p1, &s)
	wantMul := NewPedersenCommitment(&wantMulPoint)
	if gotMul.ToBytes() != wantMul.ToBytes() {
		t.Fatalf("commitment ScalarMul mismatch")
	}

	dh1 := DecryptHandle{P: p1}
	dh2 := DecryptHandle{P: p2}
	gotDHAdd := dh1.Add(&dh2)
	wantDH := DecryptHandle{P: wantPoint}
	if gotDHAdd.ToBytes() != wantDH.ToBytes() {
		t.Fatalf("decrypt handle Add mismatch")
	}
	gotDHMul := dh1.ScalarMul(&s)
	wantDHMul := DecryptHandle{P: wantMulPoint}
	if gotDHMul.ToBytes() != wantDHMul.ToBytes() {
		t.Fatalf("decrypt handle ScalarMul mismatch")
	}
}

func TestVartimeMultiScalarMul(t *testing.T) {
	s1 := testScalar(t, 2)
	s2 := testScalar(t, 3)
	p1 := testPoint(t, 5)
	p2 := testPoint(t, 7)

	got, err := VartimeMultiScalarMul([]*Scalar{&s1, &s2}, []*Point{&p1, &p2})
	if err != nil {
		t.Fatalf("multiscalar failed: %v", err)
	}

	var part1, part2, want Point
	part1.ScalarMult(&p1, &s1)
	part2.ScalarMult(&p2, &s2)
	want.Add(&part1, &part2)
	if !got.Equals(&want) {
		t.Fatalf("multiscalar result mismatch")
	}
}

func TestVartimeMultiScalarMulRejectsBadInputs(t *testing.T) {
	s := testScalar(t, 1)
	p := testPoint(t, 1)

	if _, err := VartimeMultiScalarMul([]*Scalar{&s}, []*Point{}); !errors.Is(err, ErrVectorLengthMismatch) {
		t.Fatalf("expected vector length error, got %v", err)
	}
	if _, err := VartimeMultiScalarMul([]*Scalar{nil}, []*Point{&p}); !errors.Is(err, ErrInvalidInput) {
		t.Fatalf("expected invalid scalar error, got %v", err)
	}
	if _, err := VartimeMultiScalarMul([]*Scalar{&s}, []*Point{nil}); !errors.Is(err, ErrInvalidInput) {
		t.Fatalf("expected invalid point error, got %v", err)
	}
}

func TestChallengeScalarDeterminism(t *testing.T) {
	build := func(extra []byte) [32]byte {
		tr := merlin.NewTranscript("challenge-test")
		tr.AppendMessage([]byte("extra"), extra)
		s := ChallengeScalar(tr, []byte("c"))
		return testScalarBytesFromScalar(t, s)
	}

	if build([]byte("same")) != build([]byte("same")) {
		t.Fatal("same transcript did not produce deterministic challenge")
	}
	if build([]byte("same")) == build([]byte("different")) {
		t.Fatal("different transcript unexpectedly produced same challenge")
	}
}

func TestValidateAndAppendPointDecodedMatchesOriginalPoint(t *testing.T) {
	encoded := CompressedRistretto(testPointBytes(t, 19))
	tr := merlin.NewTranscript("decode")
	decoded, err := ValidateAndAppendPointDecoded(tr, []byte("P"), &encoded)
	if err != nil {
		t.Fatalf("expected valid point to decode, got %v", err)
	}
	original, ok := encoded.Decompress()
	if !ok {
		t.Fatal("expected valid point encoding to decompress")
	}
	if !decoded.Equals(original) {
		t.Fatal("decoded point mismatch")
	}
}

func TestAppendHelpersAffectTranscriptChallenges(t *testing.T) {
	build := func(sVal uint64, pVal uint64) [32]byte {
		tr := merlin.NewTranscript("append-helpers")
		s := testScalar(t, sVal)
		p := CompressedRistretto(testPointBytes(t, pVal))
		AppendScalar(tr, []byte("s"), &s)
		AppendPoint(tr, []byte("p"), &p)
		return testScalarBytesFromScalar(t, ChallengeScalar(tr, []byte("c")))
	}

	if build(3, 5) != build(3, 5) {
		t.Fatal("append helper transcript is not deterministic")
	}
	if build(3, 5) == build(4, 5) {
		t.Fatal("scalar append mutation did not change challenge")
	}
	if build(3, 5) == build(3, 6) {
		t.Fatal("point append mutation did not change challenge")
	}
}

func TestVartimeMultiScalarMulLinearComposition(t *testing.T) {
	s1 := testScalar(t, 2)
	s2 := testScalar(t, 3)
	s3 := testScalar(t, 5)
	p1 := testPoint(t, 7)
	p2 := testPoint(t, 11)
	p3 := testPoint(t, 13)

	left, err := VartimeMultiScalarMul([]*Scalar{&s1, &s2, &s3}, []*Point{&p1, &p2, &p3})
	if err != nil {
		t.Fatalf("left multiscalar failed: %v", err)
	}
	rightA, err := VartimeMultiScalarMul([]*Scalar{&s1, &s2}, []*Point{&p1, &p2})
	if err != nil {
		t.Fatalf("rightA multiscalar failed: %v", err)
	}
	rightB, err := VartimeMultiScalarMul([]*Scalar{&s3}, []*Point{&p3})
	if err != nil {
		t.Fatalf("rightB multiscalar failed: %v", err)
	}
	var right Point
	right.Add(&rightA, &rightB)
	if !left.Equals(&right) {
		t.Fatal("multiscalar linear composition mismatch")
	}
}

func mustDecodeHex32Common(t *testing.T, s string) [32]byte {
	t.Helper()
	b, err := os.ReadFile(s)
	if err != nil {
		t.Fatalf("read file: %v", err)
	}
	var out sharedGeneratorVectors
	if err := json.Unmarshal(b, &out); err != nil {
		t.Fatalf("unmarshal vectors: %v", err)
	}
	return decodeHex32Common(t, out.H)
}

func decodeHex32Common(t *testing.T, s string) [32]byte {
	t.Helper()
	if len(s) != 64 {
		t.Fatalf("hex length = %d, want 64", len(s))
	}
	var out [32]byte
	for i := 0; i < 32; i++ {
		var v byte
		for j := 0; j < 2; j++ {
			c := s[i*2+j]
			v <<= 4
			switch {
			case c >= '0' && c <= '9':
				v |= c - '0'
			case c >= 'a' && c <= 'f':
				v |= c - 'a' + 10
			default:
				t.Fatalf("invalid hex char %q", c)
			}
		}
		out[i] = v
	}
	return out
}

func TestGeneratorHMatchesRustReferenceVector(t *testing.T) {
	_, file, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("runtime.Caller failed")
	}
	vectorsPath := filepath.Join(filepath.Dir(file), "../../../../test-vectors/generator_vectors.json")
	want := mustDecodeHex32Common(t, vectorsPath)
	var got [32]byte
	H.BytesInto(&got)
	if got != want {
		t.Fatalf("H mismatch: got %x want %x", got, want)
	}
}
