package client

import (
	govclient "github.com/cosmos/cosmos-sdk/x/gov/client"

	"fairyring/x/pricefeed/client/cli"
)

// ProposalHandler is the param change proposal handler.
var ProposalHandler = govclient.NewProposalHandler(cli.NewSubmitUpdateSymbolRequestProposalTxCmd)
