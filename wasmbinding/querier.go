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

			req := &zkpmoduletypes.QueryVerifyTransferProofsRequest{
				EqualityProofData: equalityData,
				RangeProofData:    rangeData,
				ValidityProofData: validityData,
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

			req := &zkpmoduletypes.QueryVerifyWithdrawProofsRequest{
				EqualityProofData: equalityData,
				RangeProofData:    rangeData,
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
	EqualityProofData string `json:"equality_proof_data"`
	RangeProofData    string `json:"range_proof_data"`
	ValidityProofData string `json:"validity_proof_data"`
}

// WithdrawProofsQuery represents the CosmWasm query structure for withdraw proofs
// CosmWasm Binary types are serialized as base64 strings in JSON
type WithdrawProofsQuery struct {
	EqualityProofData string `json:"equality_proof_data"`
	RangeProofData    string `json:"range_proof_data"`
}

