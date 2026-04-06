package wasmbinding

import (
	"encoding/base64"
	"encoding/json"
	"errors"

	sdk "github.com/cosmos/cosmos-sdk/types"
	zkpmodulekeeper "github.com/Fairblock/fairyring/x/zkp/keeper"
	zkpmoduletypes "github.com/Fairblock/fairyring/x/zkp/types"
)

// CustomQuerier returns a function that handles CosmWasm custom queries
func CustomQuerier(zkpKeeper *zkpmodulekeeper.Keeper) func(ctx sdk.Context, request json.RawMessage) ([]byte, error) {
	return func(ctx sdk.Context, request json.RawMessage) ([]byte, error) {
		// Parse the custom query
		var query struct {
			VerifyTransferProofs *TransferProofsQuery `json:"verify_transfer_proofs,omitempty"`
			VerifyWithdrawProofs *WithdrawProofsQuery `json:"verify_withdraw_proofs,omitempty"`
		}

		if err := json.Unmarshal(request, &query); err != nil {
			return nil, err
		}

		// Handle VerifyTransferProofs query
		if query.VerifyTransferProofs != nil {
			// Decode base64 strings to []byte
			equalityData, err := base64.StdEncoding.DecodeString(query.VerifyTransferProofs.EqualityProofData)
			if err != nil {
				return nil, err
			}
			rangeData, err := base64.StdEncoding.DecodeString(query.VerifyTransferProofs.RangeProofData)
			if err != nil {
				return nil, err
			}
			validityData, err := base64.StdEncoding.DecodeString(query.VerifyTransferProofs.ValidityProofData)
			if err != nil {
				return nil, err
			}
			senderPK, err := base64.StdEncoding.DecodeString(query.VerifyTransferProofs.SenderPubkey)
			if err != nil {
				return nil, err
			}
			recipientPK, err := base64.StdEncoding.DecodeString(query.VerifyTransferProofs.RecipientPubkey)
			if err != nil {
				return nil, err
			}
			curC1, err := base64.StdEncoding.DecodeString(query.VerifyTransferProofs.CurrentBalanceCommitment)
			if err != nil {
				return nil, err
			}
			curC2, err := base64.StdEncoding.DecodeString(query.VerifyTransferProofs.CurrentBalanceHandle)
			if err != nil {
				return nil, err
			}

			req := &zkpmoduletypes.QueryVerifyTransferProofsRequest{
				EqualityProofData:        equalityData,
				RangeProofData:           rangeData,
				ValidityProofData:        validityData,
				SenderPubkey:             senderPK,
				RecipientPubkey:          recipientPK,
				CurrentBalanceCommitment: curC1,
				CurrentBalanceHandle:     curC2,
			}

			resp, err := zkpKeeper.VerifyTransferProofs(ctx, req)
			if err != nil {
				return nil, err
			}

			// Return response as JSON
			response := map[string]interface{}{
				"valid": resp.Valid,
				"error": resp.Error,
			}
			return json.Marshal(response)
		}

		// Handle VerifyWithdrawProofs query
		if query.VerifyWithdrawProofs != nil {
			// Decode base64 strings to []byte
			equalityData, err := base64.StdEncoding.DecodeString(query.VerifyWithdrawProofs.EqualityProofData)
			if err != nil {
				return nil, err
			}
			rangeData, err := base64.StdEncoding.DecodeString(query.VerifyWithdrawProofs.RangeProofData)
			if err != nil {
				return nil, err
			}
			userPK, err := base64.StdEncoding.DecodeString(query.VerifyWithdrawProofs.UserPubkey)
			if err != nil {
				return nil, err
			}
			ctC1, err := base64.StdEncoding.DecodeString(query.VerifyWithdrawProofs.CiphertextCommitment)
			if err != nil {
				return nil, err
			}
			ctC2, err := base64.StdEncoding.DecodeString(query.VerifyWithdrawProofs.CiphertextHandle)
			if err != nil {
				return nil, err
			}

			req := &zkpmoduletypes.QueryVerifyWithdrawProofsRequest{
				EqualityProofData:   equalityData,
				RangeProofData:      rangeData,
				UserPubkey:          userPK,
				CiphertextCommitment: ctC1,
				CiphertextHandle:    ctC2,
				ExpectedNonce:       query.VerifyWithdrawProofs.ExpectedNonce,
			}

			resp, err := zkpKeeper.VerifyWithdrawProofs(ctx, req)
			if err != nil {
				return nil, err
			}

			// Return response as JSON
			response := map[string]interface{}{
				"valid": resp.Valid,
				"error": resp.Error,
			}
			return json.Marshal(response)
		}

		return nil, errors.New("unknown custom query")
	}
}

// TransferProofsQuery represents the CosmWasm query structure for transfer proofs
// CosmWasm Binary types are serialized as base64 strings in JSON
type TransferProofsQuery struct {
	EqualityProofData        string `json:"equality_proof_data"`
	RangeProofData           string `json:"range_proof_data"`
	ValidityProofData        string `json:"validity_proof_data"`
	SenderPubkey             string `json:"sender_pubkey"`
	RecipientPubkey          string `json:"recipient_pubkey"`
	CurrentBalanceCommitment string `json:"current_balance_commitment"`
	CurrentBalanceHandle     string `json:"current_balance_handle"`
}

// WithdrawProofsQuery represents the CosmWasm query structure for withdraw proofs
// CosmWasm Binary types are serialized as base64 strings in JSON
type WithdrawProofsQuery struct {
	EqualityProofData      string `json:"equality_proof_data"`
	RangeProofData         string `json:"range_proof_data"`
	UserPubkey             string `json:"user_pubkey"`
	CiphertextCommitment   string `json:"ciphertext_commitment"`
	CiphertextHandle       string `json:"ciphertext_handle"`
	ExpectedNonce          uint64 `json:"expected_nonce"`
}

