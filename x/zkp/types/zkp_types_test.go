package types

import (
	"bytes"
	"strings"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

func init() {
	// Tests run outside the app wiring, so set a deterministic bech32 prefix if
	// no other package has configured it first. Cosmos SDK config panics on
	// duplicate prefix assignment; the recover keeps the suite composable.
	defer func() { _ = recover() }()
	sdk.GetConfig().SetBech32PrefixForAccount("fairy", "fairypub")
}

func zkpAddr(seed byte) string {
	return sdk.AccAddress(bytes.Repeat([]byte{seed}, 20)).String()
}

func TestKeyPrefix(t *testing.T) {
	got := KeyPrefix("abc")
	if string(got) != "abc" {
		t.Fatalf("KeyPrefix returned %q", got)
	}
	got[0] = 'z'
	if string(KeyPrefix("abc")) != "abc" {
		t.Fatal("KeyPrefix should return a fresh byte slice")
	}
}

func TestGasConstantsAreNonZeroAndOrdered(t *testing.T) {
	if GasVerifyEqualityProof == 0 || GasVerifyValidityProof == 0 || GasVerifyWithdrawRangeProof == 0 ||
		GasVerifyTransferRangeProof == 0 || GasVerifyTransferProofs == 0 || GasVerifyWithdrawProofs == 0 {
		t.Fatal("all ZKP gas constants must be non-zero")
	}
	if GasVerifyTransferProofs <= GasVerifyTransferRangeProof {
		t.Fatal("combined transfer proof gas should exceed standalone transfer range proof gas")
	}
	if GasVerifyWithdrawProofs <= GasVerifyWithdrawRangeProof {
		t.Fatal("combined withdraw proof gas should exceed standalone withdraw range proof gas")
	}
}

func TestDefaultGenesisValidate(t *testing.T) {
	gs := DefaultGenesis()
	if gs == nil {
		t.Fatal("DefaultGenesis returned nil")
	}
	if gs.Params.Authority == "" {
		t.Fatal("DefaultGenesis authority must be populated")
	}
	if err := gs.Validate(); err != nil {
		t.Fatalf("default genesis should validate: %v", err)
	}
}

func TestGenesisValidateTrustedContracts(t *testing.T) {
	validA := zkpAddr(1)
	validB := zkpAddr(2)

	gs := GenesisState{
		Params:           NewParams(zkpAddr(9)),
		TrustedContracts: []string{validA, validB},
	}
	if err := gs.Validate(); err != nil {
		t.Fatalf("valid genesis rejected: %v", err)
	}

	duplicate := gs
	duplicate.TrustedContracts = []string{validA, validA}
	if err := duplicate.Validate(); err == nil || !strings.Contains(err.Error(), "duplicate trusted contract address") {
		t.Fatalf("expected duplicate trusted contract error, got %v", err)
	}

	invalidContract := gs
	invalidContract.TrustedContracts = []string{validA, "not-a-bech32-address"}
	if err := invalidContract.Validate(); err == nil || !strings.Contains(err.Error(), "invalid trusted contract address at index 1") {
		t.Fatalf("expected invalid trusted contract error, got %v", err)
	}
}

func TestGenesisValidateAllowsEmptyAuthorityButStillValidatesContracts(t *testing.T) {
	gs := GenesisState{
		Params:           NewParams(""),
		TrustedContracts: []string{zkpAddr(3)},
	}
	if err := gs.Validate(); err != nil {
		t.Fatalf("empty authority should be allowed at genesis validation layer: %v", err)
	}

	gs.TrustedContracts = []string{"bad"}
	if err := gs.Validate(); err == nil || !strings.Contains(err.Error(), "invalid trusted contract address") {
		t.Fatalf("trusted contracts must still be validated with empty authority, got %v", err)
	}
}

func TestParamsValidate(t *testing.T) {
	if err := NewParams(zkpAddr(4)).Validate(); err != nil {
		t.Fatalf("valid params rejected: %v", err)
	}
	if err := NewParams("bad-authority").Validate(); err == nil || !strings.Contains(err.Error(), "invalid authority address") {
		t.Fatalf("expected invalid authority error, got %v", err)
	}
}

func TestValidateAuthorityRejectsNonString(t *testing.T) {
	if err := validateAuthority(123); err == nil || !strings.Contains(err.Error(), "invalid parameter type") {
		t.Fatalf("expected invalid parameter type error, got %v", err)
	}
}

func TestNewMsgAddTrustedContractValidateBasic(t *testing.T) {
	msg := NewMsgAddTrustedContract(zkpAddr(1), zkpAddr(2))
	if msg.Authority != zkpAddr(1) || msg.ContractAddress != zkpAddr(2) {
		t.Fatalf("constructor did not populate fields")
	}
	if err := msg.ValidateBasic(); err != nil {
		t.Fatalf("valid add trusted contract msg rejected: %v", err)
	}

	if err := NewMsgAddTrustedContract("bad", zkpAddr(2)).ValidateBasic(); err == nil || !strings.Contains(err.Error(), "invalid authority address") {
		t.Fatalf("expected invalid authority error, got %v", err)
	}
	if err := NewMsgAddTrustedContract(zkpAddr(1), "bad").ValidateBasic(); err == nil || !strings.Contains(err.Error(), "invalid contract address") {
		t.Fatalf("expected invalid contract error, got %v", err)
	}
}

func TestNewMsgRemoveTrustedContractValidateBasic(t *testing.T) {
	msg := NewMsgRemoveTrustedContract(zkpAddr(1), zkpAddr(2))
	if msg.Authority != zkpAddr(1) || msg.ContractAddress != zkpAddr(2) {
		t.Fatalf("constructor did not populate fields")
	}
	if err := msg.ValidateBasic(); err != nil {
		t.Fatalf("valid remove trusted contract msg rejected: %v", err)
	}

	if err := NewMsgRemoveTrustedContract("bad", zkpAddr(2)).ValidateBasic(); err == nil || !strings.Contains(err.Error(), "invalid authority address") {
		t.Fatalf("expected invalid authority error, got %v", err)
	}
	if err := NewMsgRemoveTrustedContract(zkpAddr(1), "bad").ValidateBasic(); err == nil || !strings.Contains(err.Error(), "invalid contract address") {
		t.Fatalf("expected invalid contract error, got %v", err)
	}
}
