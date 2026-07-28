package withdrawctx

import (
	"encoding/binary"
	"testing"

	"github.com/Fairblock/fairyring/x/zkp/verification/commitment"
	"github.com/Fairblock/fairyring/x/zkp/verification/common"
	rangeproof "github.com/Fairblock/fairyring/x/zkp/verification/range"
)

type withdrawBindingFixture struct {
	eq        commitment.WithdrawCiphertextCommitmentEqualityProofData
	rp        rangeproof.WithdrawBatchedRangeProofU64Data
	userPK    [32]byte
	cipherC1  [32]byte
	cipherC2  [32]byte
	proofComm [32]byte
	nonce     uint64
}

func wcScalar(t *testing.T, n uint64) common.Scalar {
	t.Helper()
	var s common.Scalar
	s.SetUint64(n)
	return s
}

func wcPointBytes(t *testing.T, n uint64) [32]byte {
	t.Helper()
	s := wcScalar(t, n)
	var p common.Point
	p.ScalarMult(&common.G, &s)
	var out [32]byte
	p.BytesInto(&out)
	return out
}

func wcFixture(t *testing.T) withdrawBindingFixture {
	t.Helper()
	fx := withdrawBindingFixture{
		userPK:    wcPointBytes(t, 1),
		cipherC1:  wcPointBytes(t, 2),
		cipherC2:  wcPointBytes(t, 3),
		proofComm: wcPointBytes(t, 4),
		nonce:     0x0102030405060708,
	}
	fx.eq.Context.Pubkey.Bytes = fx.userPK
	fx.eq.Context.Ciphertext.Commitment = fx.cipherC1
	fx.eq.Context.Ciphertext.Handle = fx.cipherC2
	fx.eq.Context.Commitment.Bytes = fx.proofComm
	binary.LittleEndian.PutUint64(fx.eq.Context.Nonce[:], fx.nonce)
	fx.rp.Context.Commitments[0].Bytes = fx.proofComm
	fx.rp.Context.BitLengths[0] = 64
	binary.LittleEndian.PutUint64(fx.rp.Context.Nonce[:], fx.nonce)
	return fx
}

func TestVerifyBindingsSuccess(t *testing.T) {
	fx := wcFixture(t)
	if err := VerifyBindings(&fx.eq, &fx.rp, fx.userPK[:], fx.cipherC1[:], fx.cipherC2[:], fx.nonce); err != nil {
		t.Fatalf("expected withdraw bindings to verify, got %v", err)
	}
}

func TestVerifyBindingsRejectsInvalidInputLengths(t *testing.T) {
	fx := wcFixture(t)
	cases := []struct {
		name     string
		userPK   []byte
		cipherC1 []byte
		cipherC2 []byte
	}{
		{"user pubkey", fx.userPK[:31], fx.cipherC1[:], fx.cipherC2[:]},
		{"cipher commitment", fx.userPK[:], fx.cipherC1[:31], fx.cipherC2[:]},
		{"cipher handle", fx.userPK[:], fx.cipherC1[:], fx.cipherC2[:31]},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			err := VerifyBindings(&fx.eq, &fx.rp, tt.userPK, tt.cipherC1, tt.cipherC2, fx.nonce)
			if err == nil || err.Error() != "withdraw binding: invalid input lengths" {
				t.Fatalf("expected invalid length error, got %v", err)
			}
		})
	}
}

func TestVerifyBindingsRejectsNonceMismatches(t *testing.T) {
	cases := []struct {
		name string
		mut  func(*withdrawBindingFixture)
		want string
	}{
		{"equality nonce", func(fx *withdrawBindingFixture) { binary.LittleEndian.PutUint64(fx.eq.Context.Nonce[:], fx.nonce+1) }, "withdraw equality proof nonce mismatch"},
		{"range nonce", func(fx *withdrawBindingFixture) { binary.LittleEndian.PutUint64(fx.rp.Context.Nonce[:], fx.nonce+1) }, "withdraw range proof nonce mismatch"},
		{"expected nonce", func(fx *withdrawBindingFixture) { fx.nonce++ }, "withdraw equality proof nonce mismatch"},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			fx := wcFixture(t)
			tt.mut(&fx)
			err := VerifyBindings(&fx.eq, &fx.rp, fx.userPK[:], fx.cipherC1[:], fx.cipherC2[:], fx.nonce)
			if err == nil || err.Error() != tt.want {
				t.Fatalf("expected %q, got %v", tt.want, err)
			}
		})
	}
}

func TestVerifyBindingsRejectsFieldMismatches(t *testing.T) {
	cases := []struct {
		name string
		mut  func(*withdrawBindingFixture)
		want string
	}{
		{"pubkey", func(fx *withdrawBindingFixture) { fx.eq.Context.Pubkey.Bytes = wcPointBytes(t, 11) }, "pubkey mismatch"},
		{"commitment", func(fx *withdrawBindingFixture) { fx.eq.Context.Ciphertext.Commitment = wcPointBytes(t, 12) }, "commitment mismatch"},
		{"handle", func(fx *withdrawBindingFixture) { fx.eq.Context.Ciphertext.Handle = wcPointBytes(t, 13) }, "handle mismatch"},
		{"range commitment", func(fx *withdrawBindingFixture) { fx.rp.Context.Commitments[0].Bytes = wcPointBytes(t, 14) }, "equality and range proof commitments do not match"},
	}
	for _, tt := range cases {
		t.Run(tt.name, func(t *testing.T) {
			fx := wcFixture(t)
			tt.mut(&fx)
			err := VerifyBindings(&fx.eq, &fx.rp, fx.userPK[:], fx.cipherC1[:], fx.cipherC2[:], fx.nonce)
			if err == nil || err.Error() != tt.want {
				t.Fatalf("expected %q, got %v", tt.want, err)
			}
		})
	}
}

func TestVerifyBindingsDoesNotInspectProofBytes(t *testing.T) {
	fx := wcFixture(t)
	for i := range fx.eq.Proof.Y0 {
		fx.eq.Proof.Y0[i] = 0xff
	}
	for i := range fx.rp.Proof {
		fx.rp.Proof[i] = 0xff
	}
	if err := VerifyBindings(&fx.eq, &fx.rp, fx.userPK[:], fx.cipherC1[:], fx.cipherC2[:], fx.nonce); err != nil {
		t.Fatalf("binding layer should only check binding context, got %v", err)
	}
}
