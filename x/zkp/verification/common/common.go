package common

import (
	"github.com/bwesterb/go-ristretto"
	"github.com/gtank/merlin"
)

type Scalar = ristretto.Scalar
type Point = ristretto.Point

const U = 32

var G Point

var (
	CompressedH = [32]byte{
		0x8c, 0x92, 0x40, 0xb4, 0x56, 0xa9, 0xe6, 0xdc,
		0x65, 0xc3, 0x77, 0xa1, 0x04, 0x8d, 0x74, 0x5f,
		0x94, 0xa0, 0x8c, 0xdb, 0x7f, 0x44, 0xcb, 0xcd,
		0x7b, 0x46, 0xf3, 0x40, 0x48, 0x87, 0x11, 0x34,
	}

	H Point
)

func init() {
	G.SetBase()
	if !H.SetBytes(&CompressedH) {
		panic("Failed to initialize H: invalid compressed point")
	}
}

type CompressedRistretto [32]byte

func (c CompressedRistretto) Bytes() [32]byte {
	return c
}

func (c CompressedRistretto) Decompress() (*Point, bool) {
	var p Point
	var buf [32]byte
	copy(buf[:], c[:])
	if !p.SetBytes(&buf) {
		return nil, false
	}
	return &p, true
}

func (c CompressedRistretto) IsIdentity() bool {
	p, ok := c.Decompress()
	if !ok {
		return false
	}
	var zero Point
	zero.SetZero()
	return p.Equals(&zero)
}

type ElGamalPubkey struct {
	P Point
}

func (pk *ElGamalPubkey) GetPoint() *Point {
	return &pk.P
}

type PedersenCommitment struct {
	P Point
}

func NewPedersenCommitment(point *Point) PedersenCommitment {
	return PedersenCommitment{P: *point}
}

func (pc *PedersenCommitment) GetPoint() *Point {
	return &pc.P
}

func (pc *PedersenCommitment) ToBytes() [32]byte {
	var out [32]byte
	pc.P.BytesInto(&out)
	return out
}

func (pc *PedersenCommitment) ScalarMul(s *Scalar) PedersenCommitment {
	var out Point
	out.ScalarMult(&pc.P, s)
	return PedersenCommitment{P: out}
}

func (pc *PedersenCommitment) Add(other *PedersenCommitment) PedersenCommitment {
	var out Point
	out.Add(&pc.P, &other.P)
	return PedersenCommitment{P: out}
}

type DecryptHandle struct {
	P Point
}

func (dh *DecryptHandle) GetPoint() *Point {
	return &dh.P
}

func (dh *DecryptHandle) ToBytes() [32]byte {
	var out [32]byte
	dh.P.BytesInto(&out)
	return out
}

func (dh *DecryptHandle) ScalarMul(s *Scalar) DecryptHandle {
	var out Point
	out.ScalarMult(&dh.P, s)
	return DecryptHandle{P: out}
}

func (dh *DecryptHandle) Add(other *DecryptHandle) DecryptHandle {
	var out Point
	out.Add(&dh.P, &other.P)
	return DecryptHandle{P: out}
}

func AppendScalar(t *merlin.Transcript, label []byte, s *Scalar) {
	var buf [32]byte
	s.BytesInto(&buf)
	t.AppendMessage(label, buf[:])
}

func ChallengeScalar(t *merlin.Transcript, label []byte) Scalar {
	out := t.ExtractBytes(label, 64)
	var buf [64]byte
	copy(buf[:], out)
	var s Scalar
	s.SetReduced(&buf)
	return s
}

func AppendPoint(t *merlin.Transcript, label []byte, c *CompressedRistretto) {
	t.AppendMessage(label, c[:])
}

func ValidateAndAppendPoint(
	t *merlin.Transcript,
	label []byte,
	p *CompressedRistretto,
) error {
	if p.IsIdentity() {
		return ErrDeserialization
	}
	t.AppendMessage(label, p[:])
	return nil
}

func VartimeMultiScalarMul(scalars []*Scalar, points []*Point) Point {
	var acc Point
	acc.SetZero()
	n := len(scalars)
	if len(points) != n {
		return acc
	}
	for i := 0; i < n; i++ {
		var tmp Point
		tmp.ScalarMult(points[i], scalars[i])
		acc.Add(&acc, &tmp)
	}
	return acc
}

func RistrettoPointFromSlice(slice []byte) (CompressedRistretto, error) {
	if len(slice) != 32 {
		return CompressedRistretto{}, ErrDeserialization
	}
	var comp [32]byte
	copy(comp[:], slice)
	var pt Point
	if !pt.SetBytes(&comp) {
		return CompressedRistretto{}, ErrDeserialization
	}
	var out CompressedRistretto
	copy(out[:], slice)
	return out, nil
}

func CanonicalScalarFromSlice(slice []byte) (Scalar, error) {
	if len(slice) != 32 {
		return Scalar{}, ErrDeserialization
	}
	var buf32 [32]byte
	copy(buf32[:], slice)
	var s Scalar
	s.SetBytes(&buf32)
	return s, nil
}

func PedersenCommitmentFromBytes(b []byte) (*PedersenCommitment, error) {
	if len(b) != 32 {
		return nil, ErrDeserialization
	}
	var comp [32]byte
	copy(comp[:], b)
	var p Point
	if !p.SetBytes(&comp) {
		return nil, ErrDeserialization
	}
	return &PedersenCommitment{P: p}, nil
}

func DecryptHandleFromBytes(b []byte) (*DecryptHandle, error) {
	if len(b) != 32 {
		return nil, ErrDeserialization
	}
	var comp [32]byte
	copy(comp[:], b)
	var p Point
	if !p.SetBytes(&comp) {
		return nil, ErrDeserialization
	}
	return &DecryptHandle{P: p}, nil
}

