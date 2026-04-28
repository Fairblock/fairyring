package rangeproof

import (
	"bytes"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/Fairblock/fairyring/x/zkp/verification/common"
	"github.com/gtank/merlin"
)

func rpScalar(t *testing.T, v uint64) Scalar {
	t.Helper()
	var s Scalar
	s.SetUint64(v)
	return s
}

func rpScalarBytes(t *testing.T, v uint64) [32]byte {
	t.Helper()
	s := rpScalar(t, v)
	var out [32]byte
	s.BytesInto(&out)
	return out
}

func rpScalarBytesFromScalar(t *testing.T, s Scalar) [32]byte {
	t.Helper()
	var out [32]byte
	s.BytesInto(&out)
	return out
}

func rpPoint(t *testing.T, v uint64) Point {
	t.Helper()
	s := rpScalar(t, v)
	var p Point
	p.ScalarMult(G, &s)
	return p
}

func rpPointBytes(t *testing.T, v uint64) [32]byte {
	t.Helper()
	p := rpPoint(t, v)
	var out [32]byte
	p.BytesInto(&out)
	return out
}

func rpPodCommit(t *testing.T, v uint64) PodPedersenCommitment {
	t.Helper()
	return PodPedersenCommitment{Bytes: rpPointBytes(t, v)}
}

func rpValidProofBytes(t *testing.T, lgN int) []byte {
	t.Helper()
	if lgN <= 0 {
		lgN = 1
	}
	buf := make([]byte, 0, (7+2*lgN+2)*32)
	for i := uint64(1); i <= 4; i++ {
		b := rpPointBytes(t, i)
		buf = append(buf, b[:]...)
	}
	for i := uint64(1); i <= 3; i++ {
		b := rpScalarBytes(t, i)
		buf = append(buf, b[:]...)
	}
	for i := 0; i < lgN; i++ {
		l := rpPointBytes(t, uint64(10+i))
		r := rpPointBytes(t, uint64(20+i))
		buf = append(buf, l[:]...)
		buf = append(buf, r[:]...)
	}
	a := rpScalarBytes(t, 31)
	b := rpScalarBytes(t, 32)
	buf = append(buf, a[:]...)
	buf = append(buf, b[:]...)
	return buf
}

func TestRangeProofErrorStrings(t *testing.T) {
	tests := []struct {
		err  error
		want string
	}{
		{RangeErrDeserialization, "deserialization error"},
		{RangeErrAlgebraicRelation, "algebraic relation failed"},
		{RangeErrVectorLengthMismatch, "vector length mismatch"},
		{RangeErrMaximumGeneratorLengthExceeded, "maximum generator length exceeded"},
		{RangeErrInvalidBitSize, "invalid bit size"},
		{RangeErrMultiscalarMul, "multiscalar multiplication failed"},
		{RangeErrValidationError, "point validation failed"},
		{RangeProofVerificationError(999), "unknown range proof error"},
		{ProofErrDeserialization, "deserialization error"},
		{ProofErrAlgebraic, "algebraic relation failed"},
		{ProofError(999), "unknown proof error"},
	}

	for _, tt := range tests {
		if got := tt.err.Error(); got != tt.want {
			t.Fatalf("%T(%v).Error() = %q, want %q", tt.err, tt.err, got, tt.want)
		}
	}
}

func TestSumOfPowersFastMatchesSlow(t *testing.T) {
	xs := []uint64{0, 1, 2, 7, 19}
	for _, xVal := range xs {
		x := rpScalar(t, xVal)
		for n := 0; n <= 130; n++ {
			fast := sumOfPowers(&x, n)
			slow := sumOfPowersSlow(&x, n)
			if rpScalarBytesFromScalar(t, fast) != rpScalarBytesFromScalar(t, slow) {
				t.Fatalf("sumOfPowers mismatch for x=%d n=%d", xVal, n)
			}
		}
	}
}

func TestIsPowerOfTwo(t *testing.T) {
	for _, n := range []int{-1, 0, 3, 5, 6, 7, 9, 12} {
		if isPowerOfTwo(n) {
			t.Fatalf("%d must not be a power of two", n)
		}
	}
	for _, n := range []int{1, 2, 4, 8, 16, 64, 1024} {
		if !isPowerOfTwo(n) {
			t.Fatalf("%d must be a power of two", n)
		}
	}
}

func TestRangeProofGeneratorsDeterministicAndResizable(t *testing.T) {
	g1, err := NewRangeProofGens(16)
	if err != nil {
		t.Fatalf("NewRangeProofGens(16): %v", err)
	}
	g2, err := NewRangeProofGens(16)
	if err != nil {
		t.Fatalf("second NewRangeProofGens(16): %v", err)
	}
	if g1.GensCapacity != 16 || len(g1.GVec) != 16 || len(g1.HVec) != 16 {
		t.Fatalf("unexpected generator capacity/lengths: %+v", g1)
	}

	for i := 0; i < 16; i++ {
		if !g1.GVec[i].Equals(&g2.GVec[i]) || !g1.HVec[i].Equals(&g2.HVec[i]) {
			t.Fatalf("generator %d is not deterministic", i)
		}
	}

	firstG := g1.GVec[15]
	firstH := g1.HVec[15]
	if err := g1.increaseCapacity(8); err != nil {
		t.Fatalf("shrinking increaseCapacity returned error: %v", err)
	}
	if g1.GensCapacity != 16 || len(g1.GVec) != 16 || len(g1.HVec) != 16 {
		t.Fatalf("capacity changed on no-op resize")
	}
	if err := g1.increaseCapacity(32); err != nil {
		t.Fatalf("increaseCapacity(32): %v", err)
	}
	if g1.GensCapacity != 32 || len(g1.GVec) != 32 || len(g1.HVec) != 32 {
		t.Fatalf("unexpected grown capacity/lengths: %+v", g1)
	}
	if !g1.GVec[15].Equals(&firstG) || !g1.HVec[15].Equals(&firstH) {
		t.Fatalf("existing generators changed after resize")
	}
}

func TestRangeProofGensAccessors(t *testing.T) {
	gens, err := NewRangeProofGens(4)
	if err != nil {
		t.Fatalf("NewRangeProofGens: %v", err)
	}
	gs := gens.G(3)
	hs := gens.H(3)
	if len(gs) != 3 || len(hs) != 3 {
		t.Fatalf("unexpected accessor lengths")
	}
	if gs[0] != &gens.GVec[0] || hs[2] != &gens.HVec[2] {
		t.Fatal("accessors must return pointers to underlying generators")
	}
}

func TestCollectRangeCtxAcceptsDenseCommitmentsAndPadding(t *testing.T) {
	ctx := BatchedRangeProofContext{}
	ctx.Commitments[0] = rpPodCommit(t, 1)
	ctx.Commitments[1] = rpPodCommit(t, 2)
	ctx.BitLengths[0] = 32
	ctx.BitLengths[1] = 64

	comms, bits, perr := collectRangeCtx(&ctx, 64)
	if perr != 0 {
		t.Fatalf("collectRangeCtx returned error: %v", perr)
	}
	if len(comms) != 2 || len(bits) != 2 || bits[0] != 32 || bits[1] != 64 {
		t.Fatalf("unexpected commitments/bits: %d %v", len(comms), bits)
	}
}

func TestCollectRangeCtxRejectsHoles(t *testing.T) {
	ctx := BatchedRangeProofContext{}
	ctx.Commitments[0] = rpPodCommit(t, 1)
	ctx.BitLengths[0] = 32
	ctx.Commitments[2] = rpPodCommit(t, 2)
	ctx.BitLengths[2] = 32

	_, _, perr := collectRangeCtx(&ctx, 64)
	if perr != ProofErrAlgebraic {
		t.Fatalf("expected algebraic error for non-zero commitment after padding, got %v", perr)
	}
}

func TestCollectRangeCtxRejectsPaddingWithBitLength(t *testing.T) {
	ctx := BatchedRangeProofContext{}
	ctx.Commitments[0] = rpPodCommit(t, 1)
	ctx.BitLengths[0] = 32
	ctx.BitLengths[1] = 1

	_, _, perr := collectRangeCtx(&ctx, 64)
	if perr != ProofErrAlgebraic {
		t.Fatalf("expected algebraic error for padded bit length, got %v", perr)
	}
}

func TestCollectRangeCtxRejectsInvalidBitLengths(t *testing.T) {
	for _, bl := range []uint8{0, 65} {
		ctx := BatchedRangeProofContext{}
		ctx.Commitments[0] = rpPodCommit(t, 1)
		ctx.BitLengths[0] = bl

		_, _, perr := collectRangeCtx(&ctx, 64)
		if perr != ProofErrAlgebraic {
			t.Fatalf("expected algebraic error for bit length %d, got %v", bl, perr)
		}
	}
}

func TestCollectRangeCtxRejectsEmptyContext(t *testing.T) {
	_, _, perr := collectRangeCtx(&BatchedRangeProofContext{}, 64)
	if perr != ProofErrAlgebraic {
		t.Fatalf("expected algebraic error for empty context, got %v", perr)
	}
}

func TestCollectRangeCtxRejectsInvalidCommitmentEncoding(t *testing.T) {
	ctx := BatchedRangeProofContext{}
	for i := range ctx.Commitments[0].Bytes {
		ctx.Commitments[0].Bytes[i] = 0xff
	}
	ctx.BitLengths[0] = 32

	_, _, perr := collectRangeCtx(&ctx, 64)
	if perr != ProofErrDeserialization {
		t.Fatalf("expected deserialization error for invalid commitment, got %v", perr)
	}
}

func TestInnerProductProofFromBytes(t *testing.T) {
	buf := make([]byte, 0, 4*32)
	l := rpPointBytes(t, 3)
	r := rpPointBytes(t, 4)
	a := rpScalarBytes(t, 5)
	b := rpScalarBytes(t, 6)
	buf = append(buf, l[:]...)
	buf = append(buf, r[:]...)
	buf = append(buf, a[:]...)
	buf = append(buf, b[:]...)

	ipp, err := InnerProductProofFromBytes(buf)
	if err != nil {
		t.Fatalf("valid IPP bytes rejected: %v", err)
	}
	if len(ipp.LVec) != 1 || len(ipp.RVec) != 1 {
		t.Fatalf("unexpected IPP vector lengths")
	}
	if ipp.LVec[0] != CompressedRistretto(l) || ipp.RVec[0] != CompressedRistretto(r) {
		t.Fatal("IPP points not decoded in expected order")
	}
}

func TestInnerProductProofFromBytesRejectsMalformedInput(t *testing.T) {
	if _, err := InnerProductProofFromBytes([]byte{1, 2, 3}); !errors.Is(err, RangeErrDeserialization) {
		t.Fatalf("expected non-multiple length to fail, got %v", err)
	}
	if _, err := InnerProductProofFromBytes(make([]byte, 32)); !errors.Is(err, RangeErrDeserialization) {
		t.Fatalf("expected too-short IPP to fail, got %v", err)
	}
	if _, err := InnerProductProofFromBytes(make([]byte, 3*32)); !errors.Is(err, RangeErrDeserialization) {
		t.Fatalf("expected odd L/R vector layout to fail, got %v", err)
	}

	buf := make([]byte, 4*32)
	p3 := rpPointBytes(t, 3)
	p4 := rpPointBytes(t, 4)
	copy(buf[0:32], p3[:])
	copy(buf[32:64], p4[:])
	for i := 64; i < 96; i++ {
		buf[i] = 0xff
	}
	if _, err := InnerProductProofFromBytes(buf); !errors.Is(err, RangeErrDeserialization) {
		t.Fatalf("expected non-canonical scalar to fail, got %v", err)
	}
}

func TestRangeProofFromBytes(t *testing.T) {
	buf := rpValidProofBytes(t, 1)
	rp, err := RangeProofFromBytes(buf)
	if err != nil {
		t.Fatalf("validly-encoded proof rejected: %v", err)
	}
	if len(rp.IPPProof.LVec) != 1 || len(rp.IPPProof.RVec) != 1 {
		t.Fatalf("unexpected IPP vectors in range proof")
	}
}

func TestRangeProofFromBytesRejectsMalformedInput(t *testing.T) {
	if _, err := RangeProofFromBytes([]byte{1, 2, 3}); !errors.Is(err, RangeErrDeserialization) {
		t.Fatalf("expected non-multiple length to fail, got %v", err)
	}
	if _, err := RangeProofFromBytes(make([]byte, 6*32)); !errors.Is(err, RangeErrDeserialization) {
		t.Fatalf("expected too-short range proof to fail, got %v", err)
	}

	buf := rpValidProofBytes(t, 1)
	for i := 128; i < 160; i++ {
		buf[i] = 0xff
	}
	if _, err := RangeProofFromBytes(buf); !errors.Is(err, RangeErrDeserialization) {
		t.Fatalf("expected non-canonical tx scalar to fail, got %v", err)
	}
}

func TestRangeProofVerifyRejectsInvalidBitSizeAndVectorLength(t *testing.T) {
	buf := rpValidProofBytes(t, 1)
	rp, err := RangeProofFromBytes(buf)
	if err != nil {
		t.Fatalf("proof parse failed: %v", err)
	}
	pc := PedersenCommitment{PedersenCommitment: *mustCommonCommitment(t, rpPointBytes(t, 9))}

	if err := rp.Verify([]*PedersenCommitment{&pc}, []int{} /* mismatch */, merlin.NewTranscript("range")); !errors.Is(err, RangeErrVectorLengthMismatch) {
		t.Fatalf("expected vector length mismatch, got %v", err)
	}
	if err := rp.Verify([]*PedersenCommitment{&pc}, []int{3}, merlin.NewTranscript("range")); !errors.Is(err, RangeErrInvalidBitSize) {
		t.Fatalf("expected invalid non-power-of-two bit size, got %v", err)
	}
}

func mustCommonCommitment(t *testing.T, b [32]byte) *common.PedersenCommitment {
	t.Helper()
	pc, err := common.PedersenCommitmentFromBytes(b[:])
	if err != nil {
		t.Fatalf("commitment decode failed: %v", err)
	}
	return pc
}

func TestBatchInvertScalars(t *testing.T) {
	vals := []Scalar{rpScalar(t, 2), rpScalar(t, 3), rpScalar(t, 5)}
	allInv, err := batchInvertScalars(vals)
	if err != nil {
		t.Fatalf("batchInvertScalars: %v", err)
	}
	one := rpScalar(t, 1)
	for i, original := range []Scalar{rpScalar(t, 2), rpScalar(t, 3), rpScalar(t, 5)} {
		var product Scalar
		product.Mul(&original, &vals[i])
		if rpScalarBytesFromScalar(t, product) != rpScalarBytesFromScalar(t, one) {
			t.Fatalf("inverse %d is incorrect", i)
		}
	}
	two := rpScalar(t, 2)
	three := rpScalar(t, 3)
	five := rpScalar(t, 5)
	var originalProduct Scalar
	originalProduct.Mul(&two, &three)
	originalProduct.Mul(&originalProduct, &five)
	var wantAllInv Scalar
	wantAllInv.Inverse(&originalProduct)
	if rpScalarBytesFromScalar(t, allInv) != rpScalarBytesFromScalar(t, wantAllInv) {
		t.Fatalf("all inverse mismatch")
	}
}

func TestBatchInvertScalarsWithZero(t *testing.T) {
	var zero Scalar
	zero.SetZero()
	vals := []Scalar{rpScalar(t, 2), zero, rpScalar(t, 5)}
	allInv, err := batchInvertScalars(vals)
	if err != nil {
		t.Fatalf("batchInvertScalars with zero: %v", err)
	}
	if rpScalarBytesFromScalar(t, vals[1]) != rpScalarBytesFromScalar(t, zero) {
		t.Fatalf("zero input must stay zero")
	}
	var product Scalar
	two := rpScalar(t, 2)
	five := rpScalar(t, 5)
	product.Mul(&two, &five)
	var want Scalar
	want.Inverse(&product)
	if rpScalarBytesFromScalar(t, allInv) != rpScalarBytesFromScalar(t, want) {
		t.Fatalf("all inverse with zero mismatch")
	}
}

func TestMultiscalarMulParallelMatchesSerial(t *testing.T) {
	scalars := []Scalar{rpScalar(t, 2), rpScalar(t, 3), rpScalar(t, 5), rpScalar(t, 7), rpScalar(t, 11)}
	points := []*Point{}
	for i := range scalars {
		p := rpPoint(t, uint64(i+2))
		points = append(points, &p)
	}

	serial, ok := multiscalarMul(scalars, points)
	if !ok {
		t.Fatal("serial multiscalar failed")
	}
	for workers := 1; workers <= 8; workers++ {
		parallel, ok := multiscalarMulParallel(scalars, points, workers)
		if !ok {
			t.Fatalf("parallel multiscalar failed for workers=%d", workers)
		}
		if !parallel.Equals(&serial) {
			t.Fatalf("parallel mismatch for workers=%d", workers)
		}
	}
}

func TestMultiscalarMulRejectsBadInputs(t *testing.T) {
	s := []Scalar{rpScalar(t, 1)}
	p := rpPoint(t, 1)
	if _, ok := multiscalarMul(s, []*Point{}); ok {
		t.Fatal("expected serial length mismatch to fail")
	}
	if _, ok := multiscalarMul(s, []*Point{nil}); ok {
		t.Fatal("expected serial nil point to fail")
	}
	if _, ok := multiscalarMulParallel(s, []*Point{&p, &p}, 2); ok {
		t.Fatal("expected parallel length mismatch to fail")
	}
	if _, ok := multiscalarMulParallel(s, []*Point{nil}, 2); ok {
		t.Fatal("expected parallel nil point to fail")
	}
}

func TestHashAndGeneratorHelpersAreDeterministic(t *testing.T) {
	p1 := hashToPointSha3512([]byte("fairblock"))
	p2 := hashToPointSha3512([]byte("fairblock"))
	p3 := hashToPointSha3512([]byte("other"))
	if !p1.Equals(&p2) {
		t.Fatal("hashToPointSha3512 not deterministic")
	}
	if p1.Equals(&p3) {
		t.Fatal("different hash input produced same point")
	}

	gc1 := newGeneratorsChain([]byte("G"))
	gc2 := newGeneratorsChain([]byte("G"))
	got1 := gc1.nextPoint()
	got2 := gc2.nextPoint()
	if !got1.Equals(&got2) {
		t.Fatal("generators chain not deterministic")
	}
	gc1.fastForward(2)
	gc2.nextPoint()
	gc2.nextPoint()
	fastForwardPoint := gc1.nextPoint()
	manualPoint := gc2.nextPoint()
	if !fastForwardPoint.Equals(&manualPoint) {
		t.Fatal("fastForward did not match manual advancement")
	}
}

func TestPutU64LE(t *testing.T) {
	var out [8]byte
	putU64LE(out[:], 0x0102030405060708)
	want := []byte{0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01}
	if !bytes.Equal(out[:], want) {
		t.Fatalf("putU64LE got %x want %x", out, want)
	}
}

func TestLeadingZeros32(t *testing.T) {
	tests := map[uint32]int{
		0:          32,
		1:          31,
		2:          30,
		0x80000000: 0,
		0x40000000: 1,
	}
	for in, want := range tests {
		if got := leadingZeros32(in); got != want {
			t.Fatalf("leadingZeros32(%#x) = %d, want %d", in, got, want)
		}
	}
}

type sharedGeneratorVectorsRange struct {
	H      string            `json:"h"`
	GChain map[string]string `json:"g_chain"`
	HChain map[string]string `json:"h_chain"`
}

func decodeHex32Range(t *testing.T, s string) [32]byte {
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

func TestRangeGeneratorChainMatchesRustReferenceVectors(t *testing.T) {
	_, file, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("runtime.Caller failed")
	}
	vectorsPath := filepath.Join(filepath.Dir(file), "../../../../test-vectors/generator_vectors.json")
	raw, err := os.ReadFile(vectorsPath)
	if err != nil {
		t.Fatalf("read vectors: %v", err)
	}
	var vectors sharedGeneratorVectorsRange
	if err := json.Unmarshal(raw, &vectors); err != nil {
		t.Fatalf("unmarshal vectors: %v", err)
	}
	gcG := newGeneratorsChain([]byte("G"))
	for i := 0; i <= 128; i++ {
		p := gcG.nextPoint()
		if i == 0 || i == 1 || i == 2 || i == 3 || i == 4 || i == 5 || i == 6 || i == 7 || i == 128 {
			wantHex, exists := vectors.GChain[itoaRange(i)]
			if !exists {
				t.Fatalf("missing G checkpoint %d", i)
			}
			want := decodeHex32Range(t, wantHex)
			var got [32]byte
			p.BytesInto(&got)
			if got != want {
				t.Fatalf("G[%d] mismatch: got %x want %x", i, got, want)
			}
		}
	}

	gcH := newGeneratorsChain([]byte("H"))
	for i := 0; i <= 128; i++ {
		p := gcH.nextPoint()
		if i == 0 || i == 1 || i == 2 || i == 3 || i == 4 || i == 5 || i == 6 || i == 7 || i == 128 {
			wantHex, exists := vectors.HChain[itoaRange(i)]
			if !exists {
				t.Fatalf("missing H checkpoint %d", i)
			}
			want := decodeHex32Range(t, wantHex)
			var got [32]byte
			p.BytesInto(&got)
			if got != want {
				t.Fatalf("H[%d] mismatch: got %x want %x", i, got, want)
			}
		}
	}
}

func itoaRange(v int) string {
	if v == 0 {
		return "0"
	}
	var buf [20]byte
	i := len(buf)
	for v > 0 {
		i--
		buf[i] = byte('0' + (v % 10))
		v /= 10
	}
	return string(buf[i:])
}
