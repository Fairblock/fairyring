package bindings

// FairyQuery represents the custom query enum for Fairyring chain-specific queries
// These queries bypass gRPC and call the PEP keeper directly
type FairyQuery struct {
	VerifyTransferProofs *VerifyTransferProofsQuery `json:"verify_transfer_proofs,omitempty"`
	VerifyWithdrawProofs *VerifyWithdrawProofsQuery `json:"verify_withdraw_proofs,omitempty"`
}

// VerifyTransferProofsQuery contains the proof data for transfer verification
type VerifyTransferProofsQuery struct {
	Equality []byte `json:"equality"`
	Range    []byte `json:"range"`
	Validity []byte `json:"validity"`
}

// VerifyWithdrawProofsQuery contains the proof data for withdraw verification
type VerifyWithdrawProofsQuery struct {
	Equality []byte `json:"equality"`
	Range    []byte `json:"range"`
}

// ProofResponse matches the JSON response from the chain: {"valid":true,"error":""}
type ProofResponse struct {
	Valid bool   `json:"valid"`
	Error string `json:"error"`
}


