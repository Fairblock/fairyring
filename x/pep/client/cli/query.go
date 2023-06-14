package cli

import (
	"fairyring/x/pep/types"
	"fmt"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/spf13/cobra"
)

// GetQueryCmd returns the cli query commands for this module
func GetQueryCmd(queryRoute string) *cobra.Command {
	// Group pep queries under a subcommand
	cmd := &cobra.Command{
		Use:                        types.ModuleName,
		Short:                      fmt.Sprintf("Querying commands for the %s module", types.ModuleName),
		DisableFlagParsing:         true,
		SuggestionsMinimumDistance: 2,
		RunE:                       client.ValidateCmd,
	}

	cmd.AddCommand(CmdQueryParams())
	cmd.AddCommand(CmdListEncryptedTx())
	cmd.AddCommand(CmdListEncryptedTxFromBlock())
	cmd.AddCommand(CmdShowEncryptedTx())
	cmd.AddCommand(CmdLatestHeight())

	cmd.AddCommand(CmdListPepNonce())
	cmd.AddCommand(CmdShowPepNonce())
	cmd.AddCommand(CmdShowPubKey())

	// this line is used by starport scaffolding # 1

	return cmd
}
