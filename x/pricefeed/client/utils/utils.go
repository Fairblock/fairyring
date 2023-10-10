package utils

import (
	"os"

	"github.com/cosmos/cosmos-sdk/codec"

	"fairyring/x/pricefeed/types"
)

type (
	// SymbolRequestsJSON defines a slice of SymbolRequestJSON objects which can be
	// converted to a slice of ParamChange objects.
	SymbolRequestsJSON []SymbolRequestJSON

	// SymbolRequestJSON defines a parameter change used in JSON input. This
	// allows values to be specified in raw JSON instead of being string encoded.
	SymbolRequestJSON struct {
		Symbol         string `json:"symbol"           yaml:"symbol"`
		OracleScriptID uint64 `json:"oracle_script_id" yaml:"oracle_script_id"`
		BlockInterval  uint64 `json:"block_interval"   yaml:"block_interval"`
		PriceStep      uint64 `json:"price_step"   yaml:"price_step"`
	}

	// UpdateSymbolRequestProposalJSON defines a ParameterChangeProposal with a deposit used
	// to parse parameter change proposals from a JSON file.
	UpdateSymbolRequestProposalJSON struct {
		Title          string             `json:"title"           yaml:"title"`
		Description    string             `json:"description"     yaml:"description"`
		SymbolRequests SymbolRequestsJSON `json:"symbol_requests" yaml:"symbol_requests"`
		Deposit        string             `json:"deposit"         yaml:"deposit"`
	}
)

func NewSymbolRequestJSON(symbol string, oracleScriptID, blockInterval uint64, priceStep uint64) SymbolRequestJSON {
	return SymbolRequestJSON{symbol, oracleScriptID, blockInterval, priceStep}
}

// ToSymbolRequest converts a SymbolRequestJSON object to SymbolRequest.
func (srj SymbolRequestJSON) ToSymbolRequest() types.SymbolRequest {
	return types.SymbolRequest{
		Symbol:         srj.Symbol,
		OracleScriptID: srj.OracleScriptID,
		BlockInterval:  srj.BlockInterval,
		PriceStep:      srj.PriceStep,
	}
}

// ToSymbolRequests converts a slice of SymbolRequestJSON objects to a slice of
// ToSymbolRequest.
func (srsj SymbolRequestsJSON) ToSymbolRequests() []types.SymbolRequest {
	res := make([]types.SymbolRequest, len(srsj))
	for i, s := range srsj {
		res[i] = s.ToSymbolRequest()
	}
	return res
}

// ParseUpdateSymbolRequestProposalJSON reads and parses a UpdateSymbolRequestProposalJSON from
// file.
func ParseUpdateSymbolRequestProposalJSON(
	cdc *codec.LegacyAmino,
	proposalFile string,
) (UpdateSymbolRequestProposalJSON, error) {
	proposal := UpdateSymbolRequestProposalJSON{}
	contents, err := os.ReadFile(proposalFile)
	if err != nil {
		return proposal, err
	}

	if err := cdc.UnmarshalJSON(contents, &proposal); err != nil {
		return proposal, err
	}

	return proposal, nil
}
