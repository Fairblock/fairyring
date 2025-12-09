package validity

import (
	"encoding/binary"
	"errors"

	"github.com/Fairblock/fairyring/x/zkp/verification/common"
	"github.com/gtank/merlin"
)

type Scalar = common.Scalar
type Point = common.Point
type CompressedRistretto = common.CompressedRistretto

type ElGamalPubkey struct {
	common.ElGamalPubkey
}

type PedersenCommitment struct {
	common.PedersenCommitment
}

type DecryptHandle struct {
	common.DecryptHandle
}

type PodBatchedGroupedCiphertext2HandlesValidityProof struct {
	Bytes [160]byte
}

type PodElGamalPubkey struct {
	Bytes [32]byte
}

type PodGroupedElGamalCiphertext2Handles struct {
	Bytes [96]byte
}

type BatchedGroupedCiphertext2HandlesValidityProofContext struct {
	FirstPubkey         PodElGamalPubkey
	SecondPubkey        PodElGamalPubkey
	GroupedCiphertextLo PodGroupedElGamalCiphertext2Handles
	GroupedCiphertextHi PodGroupedElGamalCiphertext2Handles
}

type BatchedGroupedCiphertext2HandlesValidityProofData struct {
	Context BatchedGroupedCiphertext2HandlesValidityProofContext
	Proof   PodBatchedGroupedCiphertext2HandlesValidityProof
}

type GroupedCiphertext2HandlesValidityProof struct {
	Y0 CompressedRistretto
	Y1 CompressedRistretto
	Y2 CompressedRistretto
	Zr Scalar
	Zx Scalar
}

type BatchedGroupedCiphertext2HandlesValidityProof struct {
	Inner GroupedCiphertext2HandlesValidityProof
}

type GroupedElGamalCiphertext2 struct {
	Commitment PedersenCommitment
	Handles    [2]DecryptHandle
}

var (
	ErrValidityInvalidProof    = errors.New("validity proof: invalid proof")
	ErrValidityDeserialization = errors.New("validity proof: deserialization error")

	ErrElGamalCiphertextDeserialization = errors.New("elgamal: ciphertext deserialization")
	ErrElGamalPubkeyDeserialization     = errors.New("elgamal: pubkey deserialization")
)

func (pk *ElGamalPubkey) FromPod(v PodElGamalPubkey) error {
	var p Point
	var buf [32]byte
	copy(buf[:], v.Bytes[:])
	if !p.SetBytes(&buf) {
		return ErrElGamalPubkeyDeserialization
	}
	pk.P = p
	return nil
}

func PedersenCommitmentFromBytes(b []byte) (*PedersenCommitment, error) {
	pc, err := common.PedersenCommitmentFromBytes(b)
	if err != nil {
		return nil, err
	}
	return &PedersenCommitment{PedersenCommitment: *pc}, nil
}

func DecryptHandleFromBytes(b []byte) (*DecryptHandle, error) {
	dh, err := common.DecryptHandleFromBytes(b)
	if err != nil {
		return nil, err
	}
	return &DecryptHandle{DecryptHandle: *dh}, nil
}

func (c *GroupedElGamalCiphertext2) expectedByteLength() int {
	return 3 * 32
}

func (c *GroupedElGamalCiphertext2) ToBytes() []byte {
	buf := make([]byte, 0, c.expectedByteLength())
	commit := c.Commitment.ToBytes()
	buf = append(buf, commit[:]...)
	for i := range c.Handles {
		hb := c.Handles[i].ToBytes()
		buf = append(buf, hb[:]...)
	}
	return buf
}

func GroupedElGamalCiphertext2FromBytes(b []byte) (*GroupedElGamalCiphertext2, error) {
	if len(b) != 3*32 {
		return nil, ErrElGamalCiphertextDeserialization
	}

	commit, err := PedersenCommitmentFromBytes(b[0:32])
	if err != nil {
		return nil, err
	}
	h0, err := DecryptHandleFromBytes(b[32:64])
	if err != nil {
		return nil, err
	}
	h1, err := DecryptHandleFromBytes(b[64:96])
	if err != nil {
		return nil, err
	}

	return &GroupedElGamalCiphertext2{
		Commitment: *commit,
		Handles: [2]DecryptHandle{
			*h0,
			*h1,
		},
	}, nil
}

func GroupedElGamalCiphertext2FromPod(pod PodGroupedElGamalCiphertext2Handles) (*GroupedElGamalCiphertext2, error) {
	return GroupedElGamalCiphertext2FromBytes(pod.Bytes[:])
}

func (p GroupedCiphertext2HandlesValidityProof) Verify(
	commitment *PedersenCommitment,
	firstPubkey *ElGamalPubkey,
	secondPubkey *ElGamalPubkey,
	firstHandle *DecryptHandle,
	secondHandle *DecryptHandle,
	transcript *merlin.Transcript,
) error {
	groupedCiphertextValidityProofDomainSeparator(transcript, 2)

	if err := common.ValidateAndAppendPoint(transcript, []byte("Y_0"), &p.Y0); err != nil {
		return err
	}
	if err := common.ValidateAndAppendPoint(transcript, []byte("Y_1"), &p.Y1); err != nil {
		return err
	}

	common.AppendPoint(transcript, []byte("Y_2"), &p.Y2)

	c := common.ChallengeScalar(transcript, []byte("c"))

	common.AppendScalar(transcript, []byte("z_r"), &p.Zr)
	common.AppendScalar(transcript, []byte("z_x"), &p.Zx)
	w := common.ChallengeScalar(transcript, []byte("w"))

	var ww Scalar
	ww.Mul(&w, &w)

	var wNeg Scalar
	wNeg.Neg(&w)

	var wwNeg Scalar
	wwNeg.Neg(&ww)

	Y0, ok := p.Y0.Decompress()
	if !ok {
		return ErrValidityDeserialization
	}
	Y1, ok := p.Y1.Decompress()
	if !ok {
		return ErrValidityDeserialization
	}
	Y2, ok := p.Y2.Decompress()
	if !ok {
		return ErrValidityDeserialization
	}

	PFirst := firstPubkey.GetPoint()
	PSecond := secondPubkey.GetPoint()
	C := commitment.GetPoint()
	DFirst := firstHandle.GetPoint()
	DSecond := secondHandle.GetPoint()

	var one Scalar
	one.SetOne()

	var cNeg Scalar
	cNeg.Neg(&c)

	var oneNeg Scalar
	oneNeg.Neg(&one)

	var wZr Scalar
	wZr.Mul(&w, &p.Zr)

	var wNegC Scalar
	wNegC.Mul(&wNeg, &c)

	var wwZr Scalar
	wwZr.Mul(&ww, &p.Zr)

	var wwNegC Scalar
	wwNegC.Mul(&wwNeg, &c)

	scalars := []*Scalar{
		&p.Zr,   // z_r
		&p.Zx,   // z_x
		&cNeg,   // -c
		&oneNeg, // -1
		&wZr,    // w * z_r
		&wNegC,  // -w * c
		&wNeg,   // -w
		&wwZr,   // w^2 * z_r
		&wwNegC, // -w^2 * c
		&wwNeg,  // -w^2
	}

	points := []*Point{
		&common.H, // H
		&common.G, // G
		C,         // C
		Y0,        // Y_0
		PFirst,    // P_first
		DFirst,    // D_first
		Y1,        // Y_1
		PSecond,   // P_second
		DSecond,   // D_second
		Y2,        // Y_2
	}

	check := common.VartimeMultiScalarMul(scalars, points)

	var id Point
	id.SetZero()
	if check.Equals(&id) {
		return nil
	}
	return ErrValidityInvalidProof
}

func GroupedCiphertext2HandlesValidityProofFromBytes(
	b []byte,
) (*GroupedCiphertext2HandlesValidityProof, error) {
	if len(b) != 5*32 {
		return nil, ErrValidityDeserialization
	}

	Y0, err := common.RistrettoPointFromSlice(b[0:32])
	if err != nil {
		return nil, err
	}
	Y1, err := common.RistrettoPointFromSlice(b[32:64])
	if err != nil {
		return nil, err
	}
	Y2, err := common.RistrettoPointFromSlice(b[64:96])
	if err != nil {
		return nil, err
	}
	zr, err := common.CanonicalScalarFromSlice(b[96:128])
	if err != nil {
		return nil, err
	}
	zx, err := common.CanonicalScalarFromSlice(b[128:160])
	if err != nil {
		return nil, err
	}

	return &GroupedCiphertext2HandlesValidityProof{
		Y0: Y0,
		Y1: Y1,
		Y2: Y2,
		Zr: zr,
		Zx: zx,
	}, nil
}

func BatchedGroupedCiphertext2HandlesValidityProofFromBytes(
	b []byte,
) (*BatchedGroupedCiphertext2HandlesValidityProof, error) {
	inner, err := GroupedCiphertext2HandlesValidityProofFromBytes(b)
	if err != nil {
		return nil, err
	}
	return &BatchedGroupedCiphertext2HandlesValidityProof{Inner: *inner}, nil
}

func (p BatchedGroupedCiphertext2HandlesValidityProof) Verify(
	firstPubkey *ElGamalPubkey,
	secondPubkey *ElGamalPubkey,
	commitmentLo *PedersenCommitment,
	commitmentHi *PedersenCommitment,
	firstHandleLo *DecryptHandle,
	firstHandleHi *DecryptHandle,
	secondHandleLo *DecryptHandle,
	secondHandleHi *DecryptHandle,
	transcript *merlin.Transcript,
) error {
	batchedGroupedCiphertextValidityProofDomainSeparator(transcript, 2)

	t := common.ChallengeScalar(transcript, []byte("t"))

	commitmentHiScaled := commitmentHi.ScalarMul(&t)
	batchedCommitment := PedersenCommitment{PedersenCommitment: commitmentLo.Add(&commitmentHiScaled)}

	firstHiScaled := firstHandleHi.ScalarMul(&t)
	firstBatchedHandle := DecryptHandle{DecryptHandle: firstHandleLo.Add(&firstHiScaled)}

	secondHiScaled := secondHandleHi.ScalarMul(&t)
	secondBatchedHandle := DecryptHandle{DecryptHandle: secondHandleLo.Add(&secondHiScaled)}

	return p.Inner.Verify(
		&batchedCommitment,
		firstPubkey,
		secondPubkey,
		&firstBatchedHandle,
		&secondBatchedHandle,
		transcript,
	)
}

func (pod PodBatchedGroupedCiphertext2HandlesValidityProof) ToProof() (*BatchedGroupedCiphertext2HandlesValidityProof, error) {
	return BatchedGroupedCiphertext2HandlesValidityProofFromBytes(pod.Bytes[:])
}

func (ctx *BatchedGroupedCiphertext2HandlesValidityProofContext) NewTranscript() *merlin.Transcript {
	t := merlin.NewTranscript("batched-grouped-ciphertext-validity-2-handles-instruction")

	t.AppendMessage([]byte("first-pubkey"), ctx.FirstPubkey.Bytes[:])
	t.AppendMessage([]byte("second-pubkey"), ctx.SecondPubkey.Bytes[:])
	t.AppendMessage([]byte("grouped-ciphertext-lo"), ctx.GroupedCiphertextLo.Bytes[:])
	t.AppendMessage([]byte("grouped-ciphertext-hi"), ctx.GroupedCiphertextHi.Bytes[:])

	return t
}

func VerifyValidityProof(
	p *BatchedGroupedCiphertext2HandlesValidityProofData,
) error {
	transcript := p.Context.NewTranscript()

	var firstPubkey ElGamalPubkey
	if err := firstPubkey.FromPod(p.Context.FirstPubkey); err != nil {
		return ErrValidityInvalidProof
	}

	var secondPubkey ElGamalPubkey
	if err := secondPubkey.FromPod(p.Context.SecondPubkey); err != nil {
		return ErrValidityInvalidProof
	}

	groupedLo, err := GroupedElGamalCiphertext2FromPod(p.Context.GroupedCiphertextLo)
	if err != nil {
		return ErrValidityInvalidProof
	}
	groupedHi, err := GroupedElGamalCiphertext2FromPod(p.Context.GroupedCiphertextHi)
	if err != nil {
		return ErrValidityInvalidProof
	}

	firstHandleLo := &groupedLo.Handles[0]
	secondHandleLo := &groupedLo.Handles[1]
	firstHandleHi := &groupedHi.Handles[0]
	secondHandleHi := &groupedHi.Handles[1]

	proof, err := p.Proof.ToProof()
	if err != nil {
		return ErrValidityInvalidProof
	}

	return proof.Verify(
		&firstPubkey,
		&secondPubkey,
		&groupedLo.Commitment,
		&groupedHi.Commitment,
		firstHandleLo,
		firstHandleHi,
		secondHandleLo,
		secondHandleHi,
		transcript,
	)
}

func groupedCiphertextValidityProofDomainSeparator(t *merlin.Transcript, handles uint64) {
	t.AppendMessage([]byte("dom-sep"), []byte("validity-proof"))
	var buf [8]byte
	binary.LittleEndian.PutUint64(buf[:], handles)
	t.AppendMessage([]byte("handles"), buf[:])
}

func batchedGroupedCiphertextValidityProofDomainSeparator(t *merlin.Transcript, handles uint64) {
	t.AppendMessage([]byte("dom-sep"), []byte("batched-validity-proof"))
	var buf [8]byte
	binary.LittleEndian.PutUint64(buf[:], handles)
	t.AppendMessage([]byte("handles"), buf[:])
}

