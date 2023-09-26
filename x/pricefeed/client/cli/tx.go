package cli

import (
	"fmt"
	"strings"
	"time"

	"github.com/spf13/cobra"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/tx"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/version"
	govv1beta1 "github.com/cosmos/cosmos-sdk/x/gov/types/v1beta1"

	"fairyring/x/pricefeed/client/utils"
	"fairyring/x/pricefeed/types"
)

var (
	DefaultRelativePacketTimeoutTimestamp = uint64((time.Duration(10) * time.Minute).Nanoseconds())
)

// GetTxCmd returns the transaction commands for this module
func GetTxCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:                        types.ModuleName,
		Short:                      fmt.Sprintf("%s transactions subcommands", types.ModuleName),
		DisableFlagParsing:         true,
		SuggestionsMinimumDistance: 2,
		RunE:                       client.ValidateCmd,
	}

	return cmd
}

func NewSubmitUpdateSymbolRequestProposalTxCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "update-symbol-request [proposal-file]",
		Args:  cobra.ExactArgs(1),
		Short: "Submit update symbol request proposal",
		Long: strings.TrimSpace(
			fmt.Sprintf(`Submit a parameter proposal along with an initial deposit.
The proposal details must be supplied via a JSON file. For values that contains
objects, only non-empty fields will be updated.

IMPORTANT: Currently parameter changes are evaluated but not validated, so it is
very important that any "value" change is valid (ie. correct type and within bounds)

Proper vetting of a parameter change proposal should prevent this from happening
(no deposits should occur during the governance process), but it should be noted
regardless.

Example:
$ %s tx gov submit-legacy-proposal update-symbol-request <path/to/proposal.json> --from=<key_or_address>

Where proposal.json contains:

{
	"title": "Update Symbol requests",
	"description": "Update symbol that request price from BandChain",
	"symbol_requests": [
	  {
		"symbol": "BTC",
		"oracle_script_id": "396",
		"block_interval": "40"
	  },
	  {
		"symbol": "ETH",
		"oracle_script_id": "396",
		"block_interval": "40"
	  }
	],
	"deposit": "10000000stake"
  }
`,
				version.AppName,
			),
		),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}
			proposal, err := utils.ParseUpdateSymbolRequestProposalJSON(clientCtx.LegacyAmino, args[0])
			if err != nil {
				return err
			}
			from := clientCtx.GetFromAddress()
			content := types.NewUpdateSymbolRequestProposal(
				proposal.Title, proposal.Description, proposal.SymbolRequests.ToSymbolRequests(),
			)
			deposit, err := sdk.ParseCoinsNormalized(proposal.Deposit)
			if err != nil {
				return err
			}
			msg, err := govv1beta1.NewMsgSubmitProposal(content, deposit, from)
			if err != nil {
				return err
			}
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}
}
