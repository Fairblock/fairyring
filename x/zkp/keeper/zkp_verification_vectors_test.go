package keeper_test

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"

	"github.com/Fairblock/fairyring/x/zkp/keeper"
	"github.com/Fairblock/fairyring/x/zkp/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

const (
	zkpVectorLenEqualityProof         = 320
	zkpVectorLenValidityProof         = 416
	zkpVectorLenWithdrawEqualityProof = 328
	zkpVectorLenTransferRangeProof    = 8*32 + 8 + 736
	zkpVectorLenWithdrawRangeProof    = 8*32 + 8 + 8 + 672
)

type zkpVerificationVectorsRoot struct {
	Version             string                  `json:"version"`
	Repo                *zkpProofRepoMeta       `json:"repo,omitempty"`
	VerificationVectors []zkpVerificationVector `json:"verification_vectors"`
}

type zkpProofRepoMeta struct {
	Pkg     string `json:"pkg"`
	Version string `json:"version"`
}

type zkpVerificationVector struct {
	ID            string          `json:"id"`
	Family        string          `json:"family"`
	ExpectedValid bool            `json:"expected_valid"`
	Payload       json.RawMessage `json:"payload"`
	Binding       json.RawMessage `json:"binding"`
	Mutations     []zkpVectorMut  `json:"mutations"`
}

type zkpVectorMut struct {
	ID                    string          `json:"id"`
	Op                    string          `json:"op"`
	Target                string          `json:"target"`
	Params                json.RawMessage `json:"params"`
	ExpectedValid         bool            `json:"expected_valid"`
	ExpectedErrorContains string          `json:"expected_error_contains"`
}

type zkpMutParams struct {
	ValueHex string `json:"value_hex"`
	ValueU64 uint64 `json:"value_u64"`
	With     string `json:"with"`
}

type payloadEquality struct {
	ProofDataHex string `json:"proof_data_hex"`
}

type payloadValidity struct {
	ProofDataHex string `json:"proof_data_hex"`
}

type payloadRange struct {
	ProofDataHex string `json:"proof_data_hex"`
}

type payloadTransferComposite struct {
	EqualityProofDataHex string `json:"equality_proof_data_hex"`
	RangeProofDataHex    string `json:"range_proof_data_hex"`
	ValidityProofDataHex string `json:"validity_proof_data_hex"`
}

type payloadWithdrawComposite struct {
	EqualityProofDataHex string `json:"equality_proof_data_hex"`
	RangeProofDataHex    string `json:"range_proof_data_hex"`
}

type bindingTransfer struct {
	SenderPubkeyHex             string `json:"sender_pubkey_hex"`
	RecipientPubkeyHex          string `json:"recipient_pubkey_hex"`
	CurrentBalanceCommitmentHex string `json:"current_balance_commitment_hex"`
	CurrentBalanceHandleHex     string `json:"current_balance_handle_hex"`
}

type bindingWithdraw struct {
	UserPubkeyHex           string `json:"user_pubkey_hex"`
	CiphertextCommitmentHex string `json:"ciphertext_commitment_hex"`
	CiphertextHandleHex     string `json:"ciphertext_handle_hex"`
	ExpectedNonceU64        uint64 `json:"expected_nonce_u64"`
}

func zkpVerificationVectorsJSONPath(t *testing.T) string {
	t.Helper()
	_, file, _, ok := runtime.Caller(0)
	if !ok {
		t.Fatal("runtime.Caller failed")
	}
	return filepath.Join(filepath.Dir(file), "../../../test-vectors/zkp_verification_vectors.json")
}

func zkpLoadVerificationVectors(t *testing.T) *zkpVerificationVectorsRoot {
	t.Helper()
	raw, err := os.ReadFile(zkpVerificationVectorsJSONPath(t))
	require.NoError(t, err)
	var root zkpVerificationVectorsRoot
	require.NoError(t, json.Unmarshal(raw, &root))
	require.Equal(t, "1", root.Version)
	require.NotEmpty(t, root.VerificationVectors)
	return &root
}

func zkpAssertVectorProofByteLengths(t *testing.T, vc *zkpVerificationVector) {
	t.Helper()
	switch vc.Family {
	case "equality":
		var pl payloadEquality
		require.NoError(t, json.Unmarshal(vc.Payload, &pl))
		require.Len(t, zkpDecodeHex(t, pl.ProofDataHex), zkpVectorLenEqualityProof)
	case "validity":
		var pl payloadValidity
		require.NoError(t, json.Unmarshal(vc.Payload, &pl))
		require.Len(t, zkpDecodeHex(t, pl.ProofDataHex), zkpVectorLenValidityProof)
	case "transfer_range":
		var pl payloadRange
		require.NoError(t, json.Unmarshal(vc.Payload, &pl))
		require.Len(t, zkpDecodeHex(t, pl.ProofDataHex), zkpVectorLenTransferRangeProof)
	case "withdraw_range":
		var pl payloadRange
		require.NoError(t, json.Unmarshal(vc.Payload, &pl))
		require.Len(t, zkpDecodeHex(t, pl.ProofDataHex), zkpVectorLenWithdrawRangeProof)
	case "transfer_composite":
		var pl payloadTransferComposite
		require.NoError(t, json.Unmarshal(vc.Payload, &pl))
		require.Len(t, zkpDecodeHex(t, pl.EqualityProofDataHex), zkpVectorLenEqualityProof)
		require.Len(t, zkpDecodeHex(t, pl.RangeProofDataHex), zkpVectorLenTransferRangeProof)
		require.Len(t, zkpDecodeHex(t, pl.ValidityProofDataHex), zkpVectorLenValidityProof)
	case "withdraw_composite":
		var pl payloadWithdrawComposite
		require.NoError(t, json.Unmarshal(vc.Payload, &pl))
		require.Len(t, zkpDecodeHex(t, pl.EqualityProofDataHex), zkpVectorLenWithdrawEqualityProof)
		require.Len(t, zkpDecodeHex(t, pl.RangeProofDataHex), zkpVectorLenWithdrawRangeProof)
	default:
		t.Fatalf("unknown family %q", vc.Family)
	}
}

func zkpDecodeHex(t *testing.T, s string) []byte {
	t.Helper()
	s = strings.TrimPrefix(strings.ToLower(strings.TrimSpace(s)), "0x")
	b, err := hex.DecodeString(s)
	require.NoError(t, err)
	return b
}

func zkpMutationErrMatches(actual, needle string) bool {
	la := strings.ToLower(actual)
	ln := strings.ToLower(strings.TrimSpace(needle))
	if ln == "" {
		return strings.TrimSpace(actual) != ""
	}
	if strings.Contains(la, ln) {
		return true
	}
	switch ln {
	case "verification failed":
		return strings.Contains(la, "algebraic relation failed") ||
			strings.Contains(la, "deserialization error") ||
			strings.Contains(la, "invalid proof") ||
			strings.Contains(la, "verification failed") ||
			strings.Contains(la, "invalid equality proof data length") ||
			strings.Contains(la, "invalid range proof data length") ||
			strings.Contains(la, "invalid validity proof data length") ||
			strings.Contains(la, "equality proof verification failed:") ||
			strings.Contains(la, "range proof verification failed:") ||
			strings.Contains(la, "validity proof verification failed:")
	case "deserialization":
		return strings.Contains(la, "deserialization") ||
			strings.Contains(la, "algebraic relation failed") ||
			strings.Contains(la, "validity proof: invalid proof")
	default:
		return false
	}
}

func zkpSwapRangeProofCommitmentSlots01(t *testing.T, proof []byte) []byte {
	t.Helper()
	require.GreaterOrEqual(t, len(proof), 64, "range proof must span at least two 32-byte commitments")
	out := make([]byte, len(proof))
	copy(out, proof)
	copy(out[0:32], proof[32:64])
	copy(out[32:64], proof[0:32])
	return out
}

func zkpCorruptRangeProofScalarTail(t *testing.T, proof []byte) []byte {
	t.Helper()
	require.GreaterOrEqual(t, len(proof), 64, "range proof must include scalar tail")
	out := make([]byte, len(proof))
	copy(out, proof)
	start := len(out) - 32
	for i := start; i < len(out); i++ {
		out[i] ^= 0x5a
	}
	return out
}

func zkpApplyVectorMutation(t *testing.T, family string, payload, binding json.RawMessage, m zkpVectorMut) (json.RawMessage, json.RawMessage) {
	t.Helper()
	var p zkpMutParams
	if len(m.Params) > 0 {
		require.NoError(t, json.Unmarshal(m.Params, &p))
	}
	switch family {
	case "equality":
		var pl payloadEquality
		require.NoError(t, json.Unmarshal(payload, &pl))
		switch m.Op {
		case "bitflip", "truncate", "replace_field":
			pl.ProofDataHex = p.ValueHex
		default:
			t.Fatalf("unsupported op %q for equality", m.Op)
		}
		b, err := json.Marshal(pl)
		require.NoError(t, err)
		return b, binding
	case "validity":
		var pl payloadValidity
		require.NoError(t, json.Unmarshal(payload, &pl))
		switch m.Op {
		case "bitflip", "truncate", "replace_field":
			pl.ProofDataHex = p.ValueHex
		default:
			t.Fatalf("unsupported op %q for validity", m.Op)
		}
		b, err := json.Marshal(pl)
		require.NoError(t, err)
		return b, binding
	case "transfer_range", "withdraw_range":
		var pl payloadRange
		require.NoError(t, json.Unmarshal(payload, &pl))
		switch m.Op {
		case "bitflip", "truncate", "replace_field":
			pl.ProofDataHex = p.ValueHex
		case "swap_fields":
			raw := zkpDecodeHex(t, pl.ProofDataHex)
			sw := zkpSwapRangeProofCommitmentSlots01(t, raw)
			pl.ProofDataHex = hex.EncodeToString(sw)
		default:
			t.Fatalf("unsupported op %q for %s", m.Op, family)
		}
		b, err := json.Marshal(pl)
		require.NoError(t, err)
		return b, binding
	case "transfer_composite":
		var pl payloadTransferComposite
		var bd bindingTransfer
		require.NoError(t, json.Unmarshal(payload, &pl))
		if len(binding) > 0 {
			require.NoError(t, json.Unmarshal(binding, &bd))
		}
		switch m.Op {
		case "swap_fields":
			if p.With == "payload.validity_proof_data_hex" {
				pl.EqualityProofDataHex, pl.ValidityProofDataHex = pl.ValidityProofDataHex, pl.EqualityProofDataHex
			} else {
				t.Fatalf("unsupported swap_fields with %q", p.With)
			}
		case "bitflip":
			switch m.Target {
			case "binding.sender_pubkey_hex":
				bd.SenderPubkeyHex = p.ValueHex
			case "binding.recipient_pubkey_hex":
				bd.RecipientPubkeyHex = p.ValueHex
			default:
				t.Fatalf("unsupported bitflip target %q", m.Target)
			}
		case "replace_field":
			switch m.Target {
			case "binding.current_balance_commitment_hex":
				bd.CurrentBalanceCommitmentHex = p.ValueHex
			default:
				t.Fatalf("unsupported replace_field target %q", m.Target)
			}
		case "truncate":
			switch m.Target {
			case "payload.equality_proof_data_hex":
				pl.EqualityProofDataHex = p.ValueHex
			case "payload.range_proof_data_hex":
				pl.RangeProofDataHex = p.ValueHex
			case "payload.validity_proof_data_hex":
				pl.ValidityProofDataHex = p.ValueHex
			default:
				t.Fatalf("unsupported truncate target %q", m.Target)
			}
		default:
			t.Fatalf("unsupported op %q for transfer_composite", m.Op)
		}
		pb, err := json.Marshal(pl)
		require.NoError(t, err)
		bb, err := json.Marshal(bd)
		require.NoError(t, err)
		return pb, bb
	case "withdraw_composite":
		var pl payloadWithdrawComposite
		var bd bindingWithdraw
		require.NoError(t, json.Unmarshal(payload, &pl))
		if len(binding) > 0 {
			require.NoError(t, json.Unmarshal(binding, &bd))
		}
		switch m.Op {
		case "swap_fields":
			if p.With == "payload.range_proof_data_hex" {
				pl.EqualityProofDataHex, pl.RangeProofDataHex = pl.RangeProofDataHex, pl.EqualityProofDataHex
			} else {
				t.Fatalf("unsupported swap_fields with %q", p.With)
			}
		case "replace_field":
			switch m.Target {
			case "binding.expected_nonce_u64":
				bd.ExpectedNonceU64 = p.ValueU64
			case "binding.ciphertext_handle_hex":
				bd.CiphertextHandleHex = p.ValueHex
			default:
				t.Fatalf("unsupported replace_field target %q", m.Target)
			}
		case "bitflip":
			if m.Target == "binding.user_pubkey_hex" {
				bd.UserPubkeyHex = p.ValueHex
			} else {
				t.Fatalf("unsupported bitflip target %q", m.Target)
			}
		case "truncate":
			if m.Target == "payload.equality_proof_data_hex" {
				pl.EqualityProofDataHex = p.ValueHex
			} else {
				t.Fatalf("unsupported truncate target %q", m.Target)
			}
		default:
			t.Fatalf("unsupported op %q for withdraw_composite", m.Op)
		}
		pb, err := json.Marshal(pl)
		require.NoError(t, err)
		bb, err := json.Marshal(bd)
		require.NoError(t, err)
		return pb, bb
	default:
		t.Fatalf("unknown family %q", family)
	}
	return nil, nil
}

func zkpRunVerificationVectorCase(t *testing.T, k *keeper.Keeper, goCtx context.Context, vc *zkpVerificationVector, payload, binding json.RawMessage) (bool, string) {
	t.Helper()
	switch vc.Family {
	case "equality":
		var pl payloadEquality
		require.NoError(t, json.Unmarshal(payload, &pl))
		resp, err := k.VerifyEqualityProof(goCtx, &types.QueryVerifyEqualityProofRequest{
			ProofData: zkpDecodeHex(t, pl.ProofDataHex),
		})
		require.NoError(t, err)
		return resp.Valid, resp.Error
	case "validity":
		var pl payloadValidity
		require.NoError(t, json.Unmarshal(payload, &pl))
		resp, err := k.VerifyValidityProof(goCtx, &types.QueryVerifyValidityProofRequest{
			ProofData: zkpDecodeHex(t, pl.ProofDataHex),
		})
		require.NoError(t, err)
		return resp.Valid, resp.Error
	case "transfer_range":
		var pl payloadRange
		require.NoError(t, json.Unmarshal(payload, &pl))
		resp, err := k.VerifyTransferRangeProof(goCtx, &types.QueryVerifyTransferRangeProofRequest{
			ProofData: zkpDecodeHex(t, pl.ProofDataHex),
		})
		require.NoError(t, err)
		return resp.Valid, resp.Error
	case "withdraw_range":
		var pl payloadRange
		require.NoError(t, json.Unmarshal(payload, &pl))
		resp, err := k.VerifyWithdrawRangeProof(goCtx, &types.QueryVerifyWithdrawRangeProofRequest{
			ProofData: zkpDecodeHex(t, pl.ProofDataHex),
		})
		require.NoError(t, err)
		return resp.Valid, resp.Error
	case "transfer_composite":
		var pl payloadTransferComposite
		var bd bindingTransfer
		require.NoError(t, json.Unmarshal(payload, &pl))
		require.NotEmpty(t, binding, "transfer_composite requires binding")
		require.NoError(t, json.Unmarshal(binding, &bd))
		resp, err := k.VerifyTransferProofs(goCtx, &types.QueryVerifyTransferProofsRequest{
			EqualityProofData:        zkpDecodeHex(t, pl.EqualityProofDataHex),
			RangeProofData:           zkpDecodeHex(t, pl.RangeProofDataHex),
			ValidityProofData:        zkpDecodeHex(t, pl.ValidityProofDataHex),
			SenderPubkey:             zkpDecodeHex(t, bd.SenderPubkeyHex),
			RecipientPubkey:          zkpDecodeHex(t, bd.RecipientPubkeyHex),
			CurrentBalanceCommitment: zkpDecodeHex(t, bd.CurrentBalanceCommitmentHex),
			CurrentBalanceHandle:     zkpDecodeHex(t, bd.CurrentBalanceHandleHex),
		})
		require.NoError(t, err)
		return resp.Valid, resp.Error
	case "withdraw_composite":
		var pl payloadWithdrawComposite
		var bd bindingWithdraw
		require.NoError(t, json.Unmarshal(payload, &pl))
		require.NotEmpty(t, binding, "withdraw_composite requires binding")
		require.NoError(t, json.Unmarshal(binding, &bd))
		resp, err := k.VerifyWithdrawProofs(goCtx, &types.QueryVerifyWithdrawProofsRequest{
			EqualityProofData:    zkpDecodeHex(t, pl.EqualityProofDataHex),
			RangeProofData:       zkpDecodeHex(t, pl.RangeProofDataHex),
			UserPubkey:           zkpDecodeHex(t, bd.UserPubkeyHex),
			CiphertextCommitment: zkpDecodeHex(t, bd.CiphertextCommitmentHex),
			CiphertextHandle:     zkpDecodeHex(t, bd.CiphertextHandleHex),
			ExpectedNonce:        bd.ExpectedNonceU64,
		})
		require.NoError(t, err)
		return resp.Valid, resp.Error
	default:
		t.Fatalf("unknown family %q", vc.Family)
	}
	return false, ""
}

func zkpExecVectorBase(t *testing.T, k *keeper.Keeper, goCtx context.Context, vc *zkpVerificationVector) {
	t.Helper()
	zkpAssertVectorProofByteLengths(t, vc)
	valid, errMsg := zkpRunVerificationVectorCase(t, k, goCtx, vc, vc.Payload, vc.Binding)
	require.Equal(t, vc.ExpectedValid, valid, "error: %s", errMsg)
	if vc.ExpectedValid {
		require.Empty(t, errMsg)
	}
}

func zkpExecVectorMutations(t *testing.T, k *keeper.Keeper, goCtx context.Context, vc *zkpVerificationVector) {
	t.Helper()
	for j := range vc.Mutations {
		mut := &vc.Mutations[j]
		t.Run(mut.ID, func(t *testing.T) {
			pay, bind := zkpApplyVectorMutation(t, vc.Family, vc.Payload, vc.Binding, *mut)
			v, e := zkpRunVerificationVectorCase(t, k, goCtx, vc, pay, bind)
			require.Equal(t, mut.ExpectedValid, v, "error: %s", e)
			require.True(t, zkpMutationErrMatches(e, mut.ExpectedErrorContains), "got %q want contains %q", e, mut.ExpectedErrorContains)
		})
	}
}

func zkpVerificationTestEnv(t *testing.T) (*keeper.Keeper, context.Context) {
	t.Helper()
	k, sdkCtx := newZkpKeeperForGRPCTest(t)
	return k, sdk.WrapSDKContext(sdkCtx)
}

func TestZkpVerificationVectorsAgainstKeeper(t *testing.T) {
	root := zkpLoadVerificationVectors(t)
	k, goCtx := zkpVerificationTestEnv(t)

	for i := range root.VerificationVectors {
		vc := &root.VerificationVectors[i]
		t.Run(vc.ID, func(t *testing.T) {
			zkpExecVectorBase(t, k, goCtx, vc)
			zkpExecVectorMutations(t, k, goCtx, vc)
		})
	}
}

func TestRangeProofVerifyHappyPath(t *testing.T) {
	root := zkpLoadVerificationVectors(t)
	k, goCtx := zkpVerificationTestEnv(t)
	for i := range root.VerificationVectors {
		vc := &root.VerificationVectors[i]
		if !vc.ExpectedValid {
			continue
		}
		if vc.Family != "transfer_range" && vc.Family != "withdraw_range" {
			continue
		}
		t.Run(vc.ID, func(t *testing.T) {
			zkpExecVectorBase(t, k, goCtx, vc)
		})
	}
}

func TestRangeProofVerifyMalformedCommitments(t *testing.T) {
	root := zkpLoadVerificationVectors(t)
	k, goCtx := zkpVerificationTestEnv(t)
	for i := range root.VerificationVectors {
		vc := &root.VerificationVectors[i]
		if !vc.ExpectedValid || len(vc.Mutations) == 0 {
			continue
		}
		if vc.Family != "transfer_range" && vc.Family != "withdraw_range" {
			continue
		}
		t.Run(vc.ID, func(t *testing.T) {
			zkpExecVectorMutations(t, k, goCtx, vc)

			var pl payloadRange
			require.NoError(t, json.Unmarshal(vc.Payload, &pl))
			raw := zkpDecodeHex(t, pl.ProofDataHex)

			t.Run("swap_commitment_slots", func(t *testing.T) {
				swapped := zkpSwapRangeProofCommitmentSlots01(t, raw)
				mut := pl
				mut.ProofDataHex = hex.EncodeToString(swapped)
				payload, err := json.Marshal(mut)
				require.NoError(t, err)

				v, e := zkpRunVerificationVectorCase(t, k, goCtx, vc, payload, vc.Binding)
				require.False(t, v, "swapping commitments must invalidate range proof")
				require.True(t, zkpMutationErrMatches(e, "verification failed"), "got %q", e)
			})

			t.Run("wrong_scalars_tail", func(t *testing.T) {
				corrupt := zkpCorruptRangeProofScalarTail(t, raw)
				mut := pl
				mut.ProofDataHex = hex.EncodeToString(corrupt)
				payload, err := json.Marshal(mut)
				require.NoError(t, err)

				v, e := zkpRunVerificationVectorCase(t, k, goCtx, vc, payload, vc.Binding)
				require.False(t, v, "corrupting scalar tail must invalidate range proof")
				require.True(t, zkpMutationErrMatches(e, "verification failed"), "got %q", e)
			})
		})
	}
}

func TestEqualityProofVerifyHappyPath(t *testing.T) {
	root := zkpLoadVerificationVectors(t)
	k, goCtx := zkpVerificationTestEnv(t)
	for i := range root.VerificationVectors {
		vc := &root.VerificationVectors[i]
		if !vc.ExpectedValid || vc.Family != "equality" {
			continue
		}
		t.Run(vc.ID, func(t *testing.T) {
			zkpExecVectorBase(t, k, goCtx, vc)
		})
	}
}

func TestValidityProofVerifyHappyPath(t *testing.T) {
	root := zkpLoadVerificationVectors(t)
	k, goCtx := zkpVerificationTestEnv(t)
	for i := range root.VerificationVectors {
		vc := &root.VerificationVectors[i]
		if !vc.ExpectedValid || vc.Family != "validity" {
			continue
		}
		t.Run(vc.ID, func(t *testing.T) {
			zkpExecVectorBase(t, k, goCtx, vc)
		})
	}
}
