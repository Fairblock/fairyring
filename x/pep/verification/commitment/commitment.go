package commitment

import (
	"errors"

	"github.com/Fairblock/fairyring/x/pep/verification/common"
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

const U = common.U

type PodPedersenCommitment struct {
	Bytes [U]byte
}

type PodCiphertextCommitmentEqualityProof struct {
	Y0 [U]byte
	Y1 [U]byte
	Y2 [U]byte
	Zs [U]byte
	Zx [U]byte
	Zr [U]byte
}

type CiphertextCommitmentEqualityProofContext struct {
	Pubkey     PodElGamalPubkey
	Ciphertext PodElGamalCiphertext
	Commitment PodPedersenCommitment
}

type CiphertextCommitmentEqualityProofData struct {
	Context CiphertextCommitmentEqualityProofContext
	Proof   PodCiphertextCommitmentEqualityProof
}

type PodElGamalPubkey struct {
	Bytes [U]byte
}

type PodElGamalCiphertext struct {
	Commitment [U]byte
	Handle     [U]byte
}

type ElGamalCiphertext struct {
	Commitment PedersenCommitment
	Handle     DecryptHandle
}

type EqualityProof struct {
	Y0 CompressedRistretto
	Y1 CompressedRistretto
	Y2 CompressedRistretto
	Zs Scalar
	Zx Scalar
	Zr Scalar
}

var (
	ErrProofDeserialization = errors.New("deserialization error")
	ErrProofAlgebraic       = errors.New("algebraic relation failed")
)

func PedersenCommitmentFromPod(v PodPedersenCommitment) (*PedersenCommitment, error) {
	pc, err := common.PedersenCommitmentFromBytes(v.Bytes[:])
	if err != nil {
		return nil, errors.New("bad commit")
	}
	return &PedersenCommitment{PedersenCommitment: *pc}, nil
}

func (p *PodCiphertextCommitmentEqualityProof) AsBytes() [U * 6]byte {
	var out [U * 6]byte
	copy(out[0*U:1*U], p.Y0[:])
	copy(out[1*U:2*U], p.Y1[:])
	copy(out[2*U:3*U], p.Y2[:])
	copy(out[3*U:4*U], p.Zs[:])
	copy(out[4*U:5*U], p.Zx[:])
	copy(out[5*U:6*U], p.Zr[:])
	return out
}

func (pk *ElGamalPubkey) FromPod(v PodElGamalPubkey) error {
	var comp [32]byte
	copy(comp[:], v.Bytes[:])

	var p Point
	if !p.SetBytes(&comp) {
		return errors.New("bad pubkey")
	}
	pk.P = p
	return nil
}

func (ct *ElGamalCiphertext) FromPod(v PodElGamalCiphertext) error {
	commit, err := common.PedersenCommitmentFromBytes(v.Commitment[:])
	if err != nil {
		return errors.New("bad C")
	}
	handle, err := common.DecryptHandleFromBytes(v.Handle[:])
	if err != nil {
		return errors.New("bad D")
	}
	ct.Commitment = PedersenCommitment{PedersenCommitment: *commit}
	ct.Handle = DecryptHandle{DecryptHandle: *handle}
	return nil
}

func EqualityProofFromBytes(buf *[U * 6]byte) (*EqualityProof, error) {
	b := buf[:]

	var y0, y1, y2 CompressedRistretto
	copy(y0[:], b[0*U:1*U])
	copy(y1[:], b[1*U:2*U])
	copy(y2[:], b[2*U:3*U])

	zs, err := common.CanonicalScalarFromSlice(b[3*U : 4*U])
	if err != nil {
		return nil, err
	}
	zx, err := common.CanonicalScalarFromSlice(b[4*U : 5*U])
	if err != nil {
		return nil, err
	}
	zr, err := common.CanonicalScalarFromSlice(b[5*U : 6*U])
	if err != nil {
		return nil, err
	}

	return &EqualityProof{
		Y0: y0,
		Y1: y1,
		Y2: y2,
		Zs: zs,
		Zx: zx,
		Zr: zr,
	}, nil
}

func (ep EqualityProof) Verify(
	pubkey *ElGamalPubkey,
	ciphertext *ElGamalCiphertext,
	commitment *PedersenCommitment,
	transcript *merlin.Transcript,
) error {
	ciphertextCommitmentEqualityProofDomainSeparator(transcript)

	if err := common.ValidateAndAppendPoint(transcript, []byte("Y_0"), &ep.Y0); err != nil {
		return err
	}
	if err := common.ValidateAndAppendPoint(transcript, []byte("Y_1"), &ep.Y1); err != nil {
		return err
	}
	if err := common.ValidateAndAppendPoint(transcript, []byte("Y_2"), &ep.Y2); err != nil {
		return err
	}

	c := common.ChallengeScalar(transcript, []byte("c"))
	common.AppendScalar(transcript, []byte("z_s"), &ep.Zs)
	common.AppendScalar(transcript, []byte("z_x"), &ep.Zx)
	common.AppendScalar(transcript, []byte("z_r"), &ep.Zr)
	w := common.ChallengeScalar(transcript, []byte("w"))

	var ww Scalar
	ww.Mul(&w, &w)

	y0, ok := ep.Y0.Decompress()
	if !ok {
		return ErrProofDeserialization
	}
	y1, ok := ep.Y1.Decompress()
	if !ok {
		return ErrProofDeserialization
	}
	y2, ok := ep.Y2.Decompress()
	if !ok {
		return ErrProofDeserialization
	}

	h := &common.H

	// Scalars s (same order as Rust)
	var one Scalar
	one.SetOne()

	var cNeg Scalar
	cNeg.Neg(&c)

	var oneNeg Scalar
	oneNeg.Neg(&one)

	var wZx Scalar
	wZx.Mul(&w, &ep.Zx)

	var wZs Scalar
	wZs.Mul(&w, &ep.Zs)

	var wc Scalar
	wc.Mul(&w, &c)
	var wNegC Scalar
	wNegC.Neg(&wc)

	var wNeg Scalar
	wNeg.Neg(&w)

	var wwZx Scalar
	wwZx.Mul(&ww, &ep.Zx)

	var wwZr Scalar
	wwZr.Mul(&ww, &ep.Zr)

	var wwC Scalar
	wwC.Mul(&ww, &c)
	var wwNegC Scalar
	wwNegC.Neg(&wwC)

	var wwNeg Scalar
	wwNeg.Neg(&ww)

	scalars := []*Scalar{
		&ep.Zs,  // z_s
		&cNeg,   // -c
		&oneNeg, // -1
		&wZx,    // w * z_x
		&wZs,    // w * z_s
		&wNegC,  // -w * c
		&wNeg,   // -w
		&wwZx,   // w^2 * z_x
		&wwZr,   // w^2 * z_r
		&wwNegC, // -w^2 * c
		&wwNeg,  // -w^2
	}

	points := []*Point{
		&pubkey.P,                // P
		h,                        // h
		y0,                       // Y_0
		&common.G,                // G
		&ciphertext.Handle.P,     // D
		&ciphertext.Commitment.P, // C
		y1,                       // Y_1
		&common.G,                // G
		h,                        // h
		&commitment.P,            // commitment
		y2,                       // Y_2
	}

	check := common.VartimeMultiScalarMul(scalars, points)

	var id Point
	id.SetZero()
	if check.Equals(&id) {
		return nil
	}
	return ErrProofAlgebraic
}

func VerifyEqualityProof(
	pd *CiphertextCommitmentEqualityProofData,
) error {
	var pk ElGamalPubkey
	if err := pk.FromPod(pd.Context.Pubkey); err != nil {
		return ErrProofDeserialization
	}

	var ct ElGamalCiphertext
	if err := ct.FromPod(pd.Context.Ciphertext); err != nil {
		return ErrProofDeserialization
	}

	cm, err := PedersenCommitmentFromPod(pd.Context.Commitment)
	if err != nil {
		return ErrProofDeserialization
	}

	raw := pd.Proof.AsBytes()
	proof, err := EqualityProofFromBytes(&raw)
	if err != nil {
		return ErrProofDeserialization
	}

	t := newSplTranscript(&pd.Context)

	if err := proof.Verify(&pk, &ct, cm, t); err != nil {
		return ErrProofAlgebraic
	}
	return nil
}

func ciphertextCommitmentEqualityProofDomainSeparator(t *merlin.Transcript) {
	t.AppendMessage([]byte("dom-sep"), []byte("ciphertext-commitment-equality-proof"))
}

func newSplTranscript(ctx *CiphertextCommitmentEqualityProofContext) *merlin.Transcript {
	t := merlin.NewTranscript("ciphertext-commitment-equality-instruction")

	// pubkey
	t.AppendMessage([]byte("pubkey"), ctx.Pubkey.Bytes[:])

	// ciphertext = commitment || handle
	var ctBytes [2 * U]byte
	copy(ctBytes[0*U:1*U], ctx.Ciphertext.Commitment[:])
	copy(ctBytes[1*U:2*U], ctx.Ciphertext.Handle[:])
	t.AppendMessage([]byte("ciphertext"), ctBytes[:])

	// commitment
	t.AppendMessage([]byte("commitment"), ctx.Commitment.Bytes[:])

	return t
}

