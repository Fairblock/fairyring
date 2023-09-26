package types

import (
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types/v1beta1"
)

const (
	// UpdateSymbolRequest defines the type for a UpdateSymbolRequestProposal
	UpdateSymbolRequest = "UpdateSymbolRequest"
)

// Assert UpdateSymbolRequestProposal implements govtypes.Content at compile-time
var _ govtypes.Content = &UpdateSymbolRequestProposal{}

func init() {
	govtypes.RegisterProposalType(UpdateSymbolRequest)
}

func NewUpdateSymbolRequestProposal(
	title, description string, symbolRequests []SymbolRequest,
) *UpdateSymbolRequestProposal {
	return &UpdateSymbolRequestProposal{title, description, symbolRequests}
}

// GetTitle returns the title of a update symbol request proposal.
func (p *UpdateSymbolRequestProposal) GetTitle() string { return p.Title }

// GetDescription returns the description of a update symbol request proposal.
func (p *UpdateSymbolRequestProposal) GetDescription() string { return p.Description }

// ProposalRoute returns the routing key of a update symbol request proposal.
func (*UpdateSymbolRequestProposal) ProposalRoute() string { return RouterKey }

// ProposalType returns the type of a update symbol request proposal.
func (*UpdateSymbolRequestProposal) ProposalType() string { return UpdateSymbolRequest }

// ValidateBasic validates the update symbol request proposal.
func (p *UpdateSymbolRequestProposal) ValidateBasic() error {
	err := govtypes.ValidateAbstract(p)
	if err != nil {
		return err
	}

	return ValidateSymbolRequests(p.SymbolRequests)
}

func NewSymbolRequest(symbol string, oracleScriptID, interval uint64, priceStep uint64) SymbolRequest {
	return SymbolRequest{symbol, oracleScriptID, interval, priceStep}
}

// ValidateSymbolRequests performs basic validation checks over a set of SymbolRequest. It
// returns an error if any SymbolRequest is invalid.
func ValidateSymbolRequests(symbols []SymbolRequest) error {
	if len(symbols) == 0 {
		return ErrEmptySymbolRequests
	}

	for _, s := range symbols {
		if len(s.Symbol) == 0 {
			return ErrEmptySymbol
		}
		if s.BlockInterval != 0 && s.OracleScriptID == 0 {
			return ErrInvalidOracleScriptID
		}
	}

	return nil
}
