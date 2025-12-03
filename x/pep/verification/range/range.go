package rangeproof

import (
	"errors"
	"runtime"
	"sync"

	"github.com/Fairblock/fairyring/x/pep/verification/common"
	"github.com/gtank/merlin"
	"golang.org/x/crypto/sha3"
)

type Scalar = common.Scalar
type Point = common.Point
type CompressedRistretto = common.CompressedRistretto

type PedersenCommitment struct {
	common.PedersenCommitment
}

const U = common.U

var G = &common.G
var H = &common.H

const maxProofBits = 8 * 128

var (
	cachedRangeProofGensOnce sync.Once
	cachedRangeProofGens     *RangeProofGens
	cachedRangeProofGensErr  error
)


func getCachedRangeProofGens() (*RangeProofGens, error) {
	cachedRangeProofGensOnce.Do(func() {
		cachedRangeProofGens, cachedRangeProofGensErr = NewRangeProofGens(maxProofBits)
	})
	return cachedRangeProofGens, cachedRangeProofGensErr
}

type PodPedersenCommitment struct {
	Bytes [U]byte
}

type BatchedRangeProofContext struct {
	Commitments [8]PodPedersenCommitment
	BitLengths  [8]uint8
}

type PodRangeProofU64 [672]byte
type PodRangeProofU128 [736]byte

type BatchedRangeProofU64Data struct {
	Context BatchedRangeProofContext
	Proof   PodRangeProofU64
}

type BatchedRangeProofU128Data struct {
	Context BatchedRangeProofContext
	Proof   PodRangeProofU128
}

type RangeProof struct {
	A          CompressedRistretto
	S          CompressedRistretto
	T1         CompressedRistretto
	T2         CompressedRistretto
	Tx         Scalar
	TxBlinding Scalar
	EBlinding  Scalar
	IPPProof   InnerProductProof
}

type InnerProductProof struct {
	LVec []CompressedRistretto
	RVec []CompressedRistretto
	A    Scalar
	B    Scalar
}

type RangeProofGens struct {
	GensCapacity int
	GVec         []Point
	HVec         []Point
}

type RangeProofVerificationError int

const (
	RangeErrDeserialization RangeProofVerificationError = iota
	RangeErrAlgebraicRelation
	RangeErrVectorLengthMismatch
	RangeErrMaximumGeneratorLengthExceeded
	RangeErrInvalidBitSize
	RangeErrMultiscalarMul
	RangeErrValidationError
)

func (e RangeProofVerificationError) Error() string {
	switch e {
	case RangeErrDeserialization:
		return "deserialization error"
	case RangeErrAlgebraicRelation:
		return "algebraic relation failed"
	case RangeErrVectorLengthMismatch:
		return "vector length mismatch"
	case RangeErrMaximumGeneratorLengthExceeded:
		return "maximum generator length exceeded"
	case RangeErrInvalidBitSize:
		return "invalid bit size"
	case RangeErrMultiscalarMul:
		return "multiscalar multiplication failed"
	case RangeErrValidationError:
		return "point validation failed"
	default:
		return "unknown range proof error"
	}
}

type ProofError int

const (
	ProofErrDeserialization ProofError = iota
	ProofErrAlgebraic
)

func (e ProofError) Error() string {
	switch e {
	case ProofErrDeserialization:
		return "deserialization error"
	case ProofErrAlgebraic:
		return "algebraic relation failed"
	default:
		return "unknown proof error"
	}
}

func (pc *PedersenCommitment) Point() *Point {
	return pc.GetPoint()
}

func PedersenCommitmentFromPod(p PodPedersenCommitment) (PedersenCommitment, error) {
	pc, err := common.PedersenCommitmentFromBytes(p.Bytes[:])
	if err != nil {
		return PedersenCommitment{}, errors.New("bad commit")
	}
	return PedersenCommitment{PedersenCommitment: *pc}, nil
}

func scalarFromUint64(x uint64) Scalar {
	var s Scalar
	s.SetUint64(x)
	return s
}

func isPowerOfTwo(n int) bool {
	return n > 0 && (n&(n-1) == 0)
}

func sumOfPowers(x *Scalar, n int) Scalar {
	if !isPowerOfTwo(n) {
		return sumOfPowersSlow(x, n)
	}
	if n == 0 || n == 1 {
		return scalarFromUint64(uint64(n))
	}

	var result Scalar
	var factor Scalar
	var one Scalar
	one.SetOne()
	result.Add(&one, x)
	factor.Set(x)

	m := n
	for m > 2 {
		var tmp Scalar
		tmp.Mul(&factor, &factor)
		factor = tmp
		var prod Scalar
		prod.Mul(&factor, &result)
		result.Add(&result, &prod)
		m /= 2
	}
	return result
}

func sumOfPowersSlow(x *Scalar, n int) Scalar {
	var result Scalar
	var pow Scalar
	var one Scalar
	one.SetOne()
	pow.SetOne()

	for i := 0; i < n; i++ {
		result.Add(&result, &pow)
		var tmp Scalar
		tmp.Mul(&pow, x)
		pow = tmp
	}
	return result
}

func NewRangeProofGens(capacity int) (*RangeProofGens, error) {
	g := &RangeProofGens{
		GensCapacity: 0,
		GVec:         make([]Point, 0),
		HVec:         make([]Point, 0),
	}
	if err := g.increaseCapacity(capacity); err != nil {
		return nil, err
	}
	return g, nil
}

func (r *RangeProofGens) increaseCapacity(newCapacity int) error {
	if r.GensCapacity >= newCapacity {
		return nil
	}
	const maxGeneratorLength = int(^uint32(0))
	if newCapacity > maxGeneratorLength {
		return RangeErrMaximumGeneratorLengthExceeded
	}

	gcG := newGeneratorsChain([]byte("G"))
	gcG.fastForward(r.GensCapacity)
	for i := r.GensCapacity; i < newCapacity; i++ {
		p := gcG.nextPoint()
		r.GVec = append(r.GVec, p)
	}

	gcH := newGeneratorsChain([]byte("H"))
	gcH.fastForward(r.GensCapacity)
	for i := r.GensCapacity; i < newCapacity; i++ {
		p := gcH.nextPoint()
		r.HVec = append(r.HVec, p)
	}

	r.GensCapacity = newCapacity
	return nil
}

func (r *RangeProofGens) G(n int) []*Point {
	out := make([]*Point, n)
	for i := 0; i < n; i++ {
		out[i] = &r.GVec[i]
	}
	return out
}

func (r *RangeProofGens) H(n int) []*Point {
	out := make([]*Point, n)
	for i := 0; i < n; i++ {
		out[i] = &r.HVec[i]
	}
	return out
}

type generatorsChain struct {
	shake sha3.ShakeHash
}

func newGeneratorsChain(label []byte) *generatorsChain {
	shake := sha3.NewShake256()
	shake.Write([]byte("GeneratorsChain"))
	shake.Write(label)
	return &generatorsChain{shake: shake}
}

func (g *generatorsChain) fastForward(n int) {
	var buf [64]byte
	for i := 0; i < n; i++ {
		_, _ = g.shake.Read(buf[:])
	}
}

func (g *generatorsChain) nextPoint() Point {
	var uniform [64]byte
	_, _ = g.shake.Read(uniform[:])
	return fromUniformBytesRistretto(uniform)
}

func (ipp *InnerProductProof) verificationScalars(
	n int,
	t *merlin.Transcript,
) ([]Scalar, []Scalar, []Scalar, error) {

	lgN := len(ipp.LVec)
	if lgN == 0 || lgN >= 32 {
		return nil, nil, nil, RangeErrInvalidBitSize
	}
	if n != (1 << lgN) {
		return nil, nil, nil, RangeErrInvalidBitSize
	}

	rangeProofInnerProductDomainSeparator(t, uint64(n))

	challenges := make([]Scalar, 0, lgN)
	for i := 0; i < lgN; i++ {
		if err := validateAndAppendPointRP(t, []byte("L"), &ipp.LVec[i]); err != nil {
			return nil, nil, nil, err
		}
		if err := validateAndAppendPointRP(t, []byte("R"), &ipp.RVec[i]); err != nil {
			return nil, nil, nil, err
		}
		u := challengeScalarRP(t, []byte("u"))
		challenges = append(challenges, u)
	}

	chInv := make([]Scalar, len(challenges))
	copy(chInv, challenges)

	allInv, err := batchInvertScalars(chInv)
	if err != nil {
		return nil, nil, nil, err
	}

	for i := 0; i < lgN; i++ {
		var tmp Scalar
		tmp.Mul(&challenges[i], &challenges[i])
		challenges[i] = tmp

		tmp.Mul(&chInv[i], &chInv[i])
		chInv[i] = tmp
	}
	chSq := challenges
	chInvSq := chInv

	s := make([]Scalar, 0, n)
	s = append(s, allInv)
	for i := 1; i < n; i++ {
		lgI := 31 - leadingZeros32(uint32(i))
		k := 1 << lgI
		idx := lgN - 1 - lgI
		uLgISq := chSq[idx]

		var prev, prod Scalar
		prev = s[i-k]
		prod.Mul(&prev, &uLgISq)
		s = append(s, prod)
	}

	return chSq, chInvSq, s, nil
}

func InnerProductProofFromBytes(buf []byte) (InnerProductProof, error) {
	if len(buf)%32 != 0 {
		return InnerProductProof{}, RangeErrDeserialization
	}
	numElements := len(buf) / 32
	if numElements < 2 {
		return InnerProductProof{}, RangeErrDeserialization
	}
	if (numElements-2)%2 != 0 {
		return InnerProductProof{}, RangeErrDeserialization
	}
	lgN := (numElements - 2) / 2
	if lgN >= 32 {
		return InnerProductProof{}, RangeErrDeserialization
	}

	LVec := make([]CompressedRistretto, 0, lgN)
	RVec := make([]CompressedRistretto, 0, lgN)

	for i := 0; i < lgN; i++ {
		pos := 2 * i * 32
		var L, R CompressedRistretto
		copy(L[:], buf[pos:pos+32])
		copy(R[:], buf[pos+32:pos+64])
		LVec = append(LVec, L)
		RVec = append(RVec, R)
	}

	pos := 2 * lgN * 32
	var aBytes, bBytes [32]byte
	copy(aBytes[:], buf[pos:pos+32])
	copy(bBytes[:], buf[pos+32:pos+64])

	var a, b Scalar
	a.SetBytes(&aBytes)
	b.SetBytes(&bBytes)

	return InnerProductProof{
		LVec: LVec,
		RVec: RVec,
		A:    a,
		B:    b,
	}, nil
}

func RangeProofFromPodU64(p PodRangeProofU64) (RangeProof, error) {
	return RangeProofFromBytes(p[:])
}

func RangeProofFromPodU128(p PodRangeProofU128) (RangeProof, error) {
	return RangeProofFromBytes(p[:])
}

func RangeProofFromBytes(buf []byte) (RangeProof, error) {
	if len(buf)%32 != 0 {
		return RangeProof{}, RangeErrDeserialization
	}
	if len(buf) < 7*32 {
		return RangeProof{}, RangeErrDeserialization
	}

	var A, S, T1, T2 CompressedRistretto
	copy(A[:], buf[0:32])
	copy(S[:], buf[32:64])
	copy(T1[:], buf[64:96])
	copy(T2[:], buf[96:128])

	var txBytes, txBlindBytes, eBlindBytes [32]byte
	copy(txBytes[:], buf[128:160])
	copy(txBlindBytes[:], buf[160:192])
	copy(eBlindBytes[:], buf[192:224])

	var tx, txBlind, eBlind Scalar
	tx.SetBytes(&txBytes)
	txBlind.SetBytes(&txBlindBytes)
	eBlind.SetBytes(&eBlindBytes)

	ipp, err := InnerProductProofFromBytes(buf[7*32:])
	if err != nil {
		return RangeProof{}, err
	}

	return RangeProof{
		A:          A,
		S:          S,
		T1:         T1,
		T2:         T2,
		Tx:         tx,
		TxBlinding: txBlind,
		EBlinding:  eBlind,
		IPPProof:   ipp,
	}, nil
}

func (rp *RangeProof) Verify(
	comms []*PedersenCommitment,
	bitLengths []int,
	t *merlin.Transcript,
) error {
	if len(comms) != len(bitLengths) {
		return RangeErrVectorLengthMismatch
	}

	m := len(bitLengths)
	nm := 0
	for _, bl := range bitLengths {
		nm += bl
	}

	if nm <= 0 || !isPowerOfTwo(nm) {
		return RangeErrInvalidBitSize
	}

	var bpGens *RangeProofGens
	var err error
	if nm <= maxProofBits {
		bpGens, err = getCachedRangeProofGens()
		if err != nil {
			return RangeErrMaximumGeneratorLengthExceeded
		}
		if err := bpGens.increaseCapacity(nm); err != nil {
			return RangeErrMaximumGeneratorLengthExceeded
		}
	} else {
		bpGens, err = NewRangeProofGens(nm)
		if err != nil {
			return RangeErrMaximumGeneratorLengthExceeded
		}
	}

	rangeProofDomainSeparator(t, uint64(nm))

	if err := validateAndAppendPointRP(t, []byte("A"), &rp.A); err != nil {
		return err
	}
	if err := validateAndAppendPointRP(t, []byte("S"), &rp.S); err != nil {
		return err
	}

	y := challengeScalarRP(t, []byte("y"))
	z := challengeScalarRP(t, []byte("z"))

	var zz Scalar
	zz.Mul(&z, &z)
	var minusZ Scalar
	minusZ.Neg(&z)

	if err := validateAndAppendPointRP(t, []byte("T_1"), &rp.T1); err != nil {
		return err
	}
	if err := validateAndAppendPointRP(t, []byte("T_2"), &rp.T2); err != nil {
		return err
	}

	x := challengeScalarRP(t, []byte("x"))

	appendScalarRP(t, []byte("t_x"), &rp.Tx)
	appendScalarRP(t, []byte("t_x_blinding"), &rp.TxBlinding)
	appendScalarRP(t, []byte("e_blinding"), &rp.EBlinding)

	w := challengeScalarRP(t, []byte("w"))
	_ = challengeScalarRP(t, []byte("c"))

	xSq, xInvSq, sVec, err := rp.IPPProof.verificationScalars(nm, t)
	if err != nil {
		return err
	}

	sInv := make([]Scalar, len(sVec))
	for i := range sVec {
		sInv[len(sVec)-1-i] = sVec[i]
	}

	a := rp.IPPProof.A
	b := rp.IPPProof.B

	appendScalarRP(t, []byte("ipp_a"), &a)
	appendScalarRP(t, []byte("ipp_b"), &b)

	d := challengeScalarRP(t, []byte("d"))

	concatZAnd2 := make([]Scalar, 0, nm)
	var expZ Scalar
	expZ.SetOne()
	two := scalarFromUint64(2)

	for _, nI := range bitLengths {
		var exp2 Scalar
		exp2.SetOne()

		for j := 0; j < nI; j++ {
			var term Scalar
			term.Mul(&exp2, &expZ)
			concatZAnd2 = append(concatZAnd2, term)

			var tmp Scalar
			tmp.Mul(&exp2, &two)
			exp2 = tmp
		}
		var tmpZ Scalar
		tmpZ.Mul(&expZ, &z)
		expZ = tmpZ
	}

	gs := make([]Scalar, len(sVec))
	for i := range sVec {
		var aSi Scalar
		aSi.Mul(&a, &sVec[i])

		var negASi Scalar
		negASi.Neg(&aSi)

		gs[i].Add(&minusZ, &negASi)
	}

	hs := make([]Scalar, len(sInv))

	var yInv Scalar
	yInv.Inverse(&y)

	var expYInv Scalar
	expYInv.SetOne()

	for i := 0; i < len(sInv); i++ {
		var zzZ2 Scalar
		zzZ2.Mul(&zz, &concatZAnd2[i])

		var bSi Scalar
		bSi.Mul(&b, &sInv[i])

		var inner Scalar
		inner.Sub(&zzZ2, &bSi)

		var tmp Scalar
		tmp.Mul(&expYInv, &inner)

		hs[i].Add(&z, &tmp)

		var tmpExp Scalar
		tmpExp.Mul(&expYInv, &yInv)
		expYInv = tmpExp
	}

	var ab Scalar
	ab.Mul(&a, &b)

	var txMinusAB Scalar
	txMinusAB.Sub(&rp.Tx, &ab)

	var wTxMinusAB Scalar
	wTxMinusAB.Mul(&w, &txMinusAB)

	delta := rangeProofDelta(bitLengths, &y, &z)

	var deltaMinusTx Scalar
	deltaMinusTx.Sub(&delta, &rp.Tx)

	var dDeltaMinusTx Scalar
	dDeltaMinusTx.Mul(&d, &deltaMinusTx)

	var basepointScalar Scalar
	basepointScalar.Add(&wTxMinusAB, &dDeltaMinusTx)

	valueScalars := make([]Scalar, 0, m)
	expZ.SetOne()
	var dzz Scalar
	dzz.Mul(&d, &zz)
	for i := 0; i < m; i++ {
		var term Scalar
		term.Mul(&dzz, &expZ)
		valueScalars = append(valueScalars, term)

		var tmpZ Scalar
		tmpZ.Mul(&expZ, &z)
		expZ = tmpZ
	}

	scalars := make([]Scalar, 0,
		1+1+1+1+1+1+len(xSq)+len(xInvSq)+len(gs)+len(hs)+len(valueScalars))

	var one Scalar
	one.SetOne()

	scalars = append(scalars, one)
	scalars = append(scalars, x)
	var dx Scalar
	dx.Mul(&d, &x)
	scalars = append(scalars, dx)
	var dxx Scalar
	dxx.Mul(&dx, &x)
	scalars = append(scalars, dxx)
	var dTxBlind Scalar
	dTxBlind.Mul(&d, &rp.TxBlinding)
	var negEBlind Scalar
	negEBlind.Neg(&rp.EBlinding)
	var negDTxBlind Scalar
	negDTxBlind.Neg(&dTxBlind)
	var scalar5 Scalar
	scalar5.Add(&negEBlind, &negDTxBlind)
	scalars = append(scalars, scalar5)
	scalars = append(scalars, basepointScalar)
	scalars = append(scalars, xSq...)
	scalars = append(scalars, xInvSq...)
	scalars = append(scalars, gs...)
	scalars = append(scalars, hs...)
	scalars = append(scalars, valueScalars...)

	points := make([]*Point, 0,
		len(scalars))

	A, ok := rp.A.Decompress()
	if !ok {
		return RangeErrMultiscalarMul
	}
	S, ok := rp.S.Decompress()
	if !ok {
		return RangeErrMultiscalarMul
	}
	T1, ok := rp.T1.Decompress()
	if !ok {
		return RangeErrMultiscalarMul
	}
	T2, ok := rp.T2.Decompress()
	if !ok {
		return RangeErrMultiscalarMul
	}

	points = append(points, A)
	points = append(points, S)
	points = append(points, T1)
	points = append(points, T2)
	points = append(points, H)
	points = append(points, G)

	for i := range rp.IPPProof.LVec {
		Li, ok := rp.IPPProof.LVec[i].Decompress()
		if !ok {
			return RangeErrMultiscalarMul
		}
		points = append(points, Li)
	}
	for i := range rp.IPPProof.RVec {
		Ri, ok := rp.IPPProof.RVec[i].Decompress()
		if !ok {
			return RangeErrMultiscalarMul
		}
		points = append(points, Ri)
	}

	Gs := bpGens.G(nm)
	Hs := bpGens.H(nm)
	points = append(points, Gs...)
	points = append(points, Hs...)

	for _, V := range comms {
		points = append(points, V.Point())
	}

	if len(points) != len(scalars) {
		return RangeErrMultiscalarMul
	}

	workers := runtime.NumCPU() / 2
	if workers < 1 {
		workers = 1
	}
	if workers > 4 {
		workers = 4
	}
	res, ok := multiscalarMulParallel(scalars, points, workers)
	if !ok {
		return RangeErrMultiscalarMul
	}

	var id Point
	id.SetZero()
	if res.Equals(&id) {
		return nil
	}
	return RangeErrAlgebraicRelation
}

func rangeProofDelta(bitLengths []int, y, z *Scalar) Scalar {
	nm := 0
	for _, bl := range bitLengths {
		nm += bl
	}
	sumY := sumOfPowers(y, nm)

	var z2 Scalar
	z2.Mul(z, z)
	var zMinusZ2 Scalar
	zMinusZ2.Sub(z, &z2)
	var agg Scalar
	agg.Mul(&zMinusZ2, &sumY)

	var expZ Scalar
	expZ.Mul(&z2, z)

	twoScalar := scalarFromUint64(2)
	for _, nI := range bitLengths {
		sum2 := sumOfPowers(&twoScalar, nI)
		var term Scalar
		term.Mul(&expZ, &sum2)
		var negTerm Scalar
		negTerm.Neg(&term)
		agg.Add(&agg, &negTerm)

		var tmp Scalar
		tmp.Mul(&expZ, z)
		expZ = tmp
	}

	return agg
}

func VerifyWithdrawRange(pd *BatchedRangeProofU64Data) error {
	commitments := make([]PedersenCommitment, 0, len(pd.Context.Commitments))
	for _, c := range pd.Context.Commitments {
		pc, err := PedersenCommitmentFromPod(c)
		if err != nil {
			return ProofErrDeserialization
		}
		commitments = append(commitments, pc)
	}

	bitLengths := make([]int, len(pd.Context.BitLengths))
	for i, b := range pd.Context.BitLengths {
		bitLengths[i] = int(b)
	}

	n := len(commitments)
	if n == 0 || n > 8 || n != len(bitLengths) {
		return ProofErrAlgebraic
	}

	t := newTranscriptRange(&pd.Context)

	rp, err := RangeProofFromPodU64(pd.Proof)
	if err != nil {
		return ProofErrDeserialization
	}

	commRefs := make([]*PedersenCommitment, n)
	for i := range commitments {
		commRefs[i] = &commitments[i]
	}

	if err := rp.Verify(commRefs, bitLengths, t); err != nil {
		return ProofErrAlgebraic
	}
	return nil
}

func VerifyTransferRange(pd *BatchedRangeProofU128Data) error {
	commitments := make([]PedersenCommitment, 0, len(pd.Context.Commitments))
	for _, c := range pd.Context.Commitments {
		pc, err := PedersenCommitmentFromPod(c)
		if err != nil {
			return ProofErrDeserialization
		}
		commitments = append(commitments, pc)
	}

	bitLengths := make([]int, len(pd.Context.BitLengths))
	for i, b := range pd.Context.BitLengths {
		bitLengths[i] = int(b)
	}

	n := len(commitments)
	if n == 0 || n > 8 || n != len(bitLengths) {
		return ProofErrAlgebraic
	}

	t := newTranscriptRange(&pd.Context)

	rp, err := RangeProofFromPodU128(pd.Proof)
	if err != nil {
		return ProofErrDeserialization
	}

	commRefs := make([]*PedersenCommitment, n)
	for i := range commitments {
		commRefs[i] = &commitments[i]
	}

	if err := rp.Verify(commRefs, bitLengths, t); err != nil {
		return ProofErrAlgebraic
	}
	return nil
}

func newTranscriptRange(ctx *BatchedRangeProofContext) *merlin.Transcript {
	t := merlin.NewTranscript("batched-range-proof-instruction")

	var commitsBytes [8 * 32]byte
	for i := 0; i < len(ctx.Commitments); i++ {
		copy(commitsBytes[32*i:32*(i+1)], ctx.Commitments[i].Bytes[:])
	}
	t.AppendMessage([]byte("commitments"), commitsBytes[:])

	var bitBytes [8]byte
	for i := 0; i < len(ctx.BitLengths); i++ {
		bitBytes[i] = ctx.BitLengths[i]
	}
	t.AppendMessage([]byte("bit-lengths"), bitBytes[:])

	return t
}

func validateAndAppendPointRP(
	t *merlin.Transcript,
	label []byte,
	c *CompressedRistretto,
) error {
	err := common.ValidateAndAppendPoint(t, label, c)
	if err != nil {
		return RangeErrValidationError
	}
	return nil
}

func rangeProofInnerProductDomainSeparator(t *merlin.Transcript, n uint64) {
	t.AppendMessage([]byte("dom-sep"), []byte("inner-product"))
	var buf [8]byte
	putU64LE(buf[:], n)
	t.AppendMessage([]byte("n"), buf[:])
}

func rangeProofDomainSeparator(t *merlin.Transcript, n uint64) {
	t.AppendMessage([]byte("dom-sep"), []byte("range-proof"))
	var buf [8]byte
	putU64LE(buf[:], n)
	t.AppendMessage([]byte("n"), buf[:])
}

func appendScalarRP(t *merlin.Transcript, label []byte, s *Scalar) {
	common.AppendScalar(t, label, s)
}

func challengeScalarRP(t *merlin.Transcript, label []byte) Scalar {
	out := t.ExtractBytes(label, 64)
	var buf [64]byte
	copy(buf[:], out)

	var s Scalar
	s.SetReduced(&buf)
	return s
}

func batchInvertScalars(s []Scalar) (Scalar, error) {
	n := len(s)
	var one Scalar
	one.SetOne()
	var zero Scalar
	zero.SetZero()
	if n == 0 {
		return one, nil
	}

	hasZero := false
	for i := range s {
		if s[i].IsNonZeroI() == 0 {
			hasZero = true
			break
		}
	}

	if hasZero {
		var allInv Scalar
		allInv.SetOne()
		for i := range s {
			if s[i].IsNonZeroI() == 0 {
				s[i] = zero
			} else {
				var inv Scalar
				inv.Inverse(&s[i])
				s[i] = inv
				var tmp Scalar
				tmp.Mul(&allInv, &inv)
				allInv = tmp
			}
		}
		return allInv, nil
	}

	prefix := make([]Scalar, n)
	prefix[0] = s[0]
	for i := 1; i < n; i++ {
		var tmp Scalar
		tmp.Mul(&prefix[i-1], &s[i])
		prefix[i] = tmp
	}

	var invTotal Scalar
	invTotal.Inverse(&prefix[n-1])

	allInv := invTotal

	for i := n - 1; i >= 0; i-- {
		var curInv Scalar
		if i == 0 {
			curInv = invTotal
		} else {
			var tmp Scalar
			tmp.Mul(&prefix[i-1], &invTotal)
			curInv = tmp
			var tmp2 Scalar
			tmp2.Mul(&invTotal, &s[i])
			invTotal = tmp2
		}
		s[i] = curInv
	}

	return allInv, nil
}

func multiscalarMul(
	scalars []Scalar,
	points []*Point,
) (Point, bool) {
	var acc Point
	acc.SetZero()

	if len(scalars) != len(points) {
		return acc, false
	}

	var tmp Point
	for i := range scalars {
		if points[i] == nil {
			return acc, false
		}
		tmp.ScalarMult(points[i], &scalars[i])
		acc.Add(&acc, &tmp)
	}

	return acc, true
}

func multiscalarMulParallel(
	scalars []Scalar,
	points []*Point,
	workers int,
) (Point, bool) {
	n := len(scalars)
	if n != len(points) {
		var zero Point
		zero.SetZero()
		return zero, false
	}

	if n == 0 || workers <= 1 {
		return multiscalarMul(scalars, points)
	}

	if workers > n {
		workers = n
	}

	type partial struct {
		p  Point
		ok bool
	}

	ch := make(chan partial, workers)
	chunk := (n + workers - 1) / workers

	actualWorkers := 0
	for w := 0; w < workers; w++ {
		start := w * chunk
		if start >= n {
			break
		}
		actualWorkers++
		end := start + chunk
		if end > n {
			end = n
		}

		go func(s []Scalar, pts []*Point) {
			p, ok := multiscalarMul(s, pts)
			ch <- partial{p: p, ok: ok}
		}(scalars[start:end], points[start:end])
	}

	var acc Point
	acc.SetZero()
	for i := 0; i < actualWorkers; i++ {
		part := <-ch
		if !part.ok {
			var zero Point
			zero.SetZero()
			return zero, false
		}
		acc.Add(&acc, &part.p)
	}

	return acc, true
}

func hashToPointSha3512(input []byte) Point {
	h := sha3.New512()
	h.Write(input)
	sum := h.Sum(nil)
	var uniform [64]byte
	copy(uniform[:], sum)
	return fromUniformBytesRistretto(uniform)
}

func fromUniformBytesRistretto(uniform [64]byte) Point {
	var r0, r1 [32]byte
	copy(r0[:], uniform[0:32])
	copy(r1[:], uniform[32:64])

	var p0, p1, out Point
	p0.SetElligator(&r0)
	p1.SetElligator(&r1)
	out.Add(&p0, &p1)
	return out
}


func leadingZeros32(x uint32) int {
	if x == 0 {
		return 32
	}
	n := 0
	for (x & 0x80000000) == 0 {
		n++
		x <<= 1
	}
	return n
}

func newNegScalar(s *Scalar) Scalar {
	var out Scalar
	out.Neg(s)
	return out
}

func putU64LE(dst []byte, v uint64) {
	_ = dst[7]
	dst[0] = byte(v)
	dst[1] = byte(v >> 8)
	dst[2] = byte(v >> 16)
	dst[3] = byte(v >> 24)
	dst[4] = byte(v >> 32)
	dst[5] = byte(v >> 40)
	dst[6] = byte(v >> 48)
	dst[7] = byte(v >> 56)
}

