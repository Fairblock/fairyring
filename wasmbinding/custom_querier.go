package wasmbinding

import (
	"encoding/json"
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"

	"github.com/Fairblock/fairyring/x/pep/keeper"
	peptypes "github.com/Fairblock/fairyring/x/pep/types"
	"github.com/Fairblock/fairyring/wasmbinding/bindings"
)

// CustomQuerier returns the function used for wasm Custom queries.
// This function routes FairyQuery variants to the PEP keeper methods.
func CustomQuerier(pepKeeper keeper.Keeper) func(ctx sdk.Context, request json.RawMessage) ([]byte, error) {
	return func(ctx sdk.Context, request json.RawMessage) ([]byte, error) {
		var q bindings.FairyQuery
		if err := json.Unmarshal(request, &q); err != nil {
			return nil, fmt.Errorf("failed to unmarshal FairyQuery: %w", err)
		}

		switch {
		case q.VerifyTransferProofs != nil:
			req := q.VerifyTransferProofs

			// Call the PEP keeper's VerifyTransferProofs method directly
			res, err := pepKeeper.VerifyTransferProofs(
				ctx,
				&peptypes.QueryVerifyTransferProofsRequest{
					EqualityProofData: req.Equality,
					RangeProofData:    req.Range,
					ValidityProofData: req.Validity,
				},
			)
			if err != nil {
				return nil, err
			}

			// Convert the response to the JSON format expected by the contract
			out := bindings.ProofResponse{
				Valid: res.Valid,
				Error: res.Error,
			}
			return json.Marshal(out)

		case q.VerifyWithdrawProofs != nil:
			req := q.VerifyWithdrawProofs

			// Call the PEP keeper's VerifyWithdrawProofs method directly
			res, err := pepKeeper.VerifyWithdrawProofs(
				ctx,
				&peptypes.QueryVerifyWithdrawProofsRequest{
					EqualityProofData: req.Equality,
					RangeProofData:    req.Range,
				},
			)
			if err != nil {
				return nil, err
			}

			// Convert the response to the JSON format expected by the contract
			out := bindings.ProofResponse{
				Valid: res.Valid,
				Error: res.Error,
			}
			return json.Marshal(out)

		default:
			return nil, sdkerrors.ErrUnknownRequest.Wrap("unknown FairyQuery variant")
		}
	}
}

