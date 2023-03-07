package cli

import (
	"fmt"
	// "strings"

	"github.com/spf13/cobra"

	"github.com/cosmos/cosmos-sdk/client"
	// "github.com/cosmos/cosmos-sdk/client/flags"
	// sdk "github.com/cosmos/cosmos-sdk/types"

	"fairyring/x/fairblock/types"
)

// GetQueryCmd returns the cli query commands for this module
func GetQueryCmd(queryRoute string) *cobra.Command {
	// Group fairblock queries under a subcommand
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

	cmd.AddCommand(CmdListFairblockNonce())
	cmd.AddCommand(CmdShowFairblockNonce())
	cmd.AddCommand(CmdListFairblockExecutedNonce())
	cmd.AddCommand(CmdShowFairblockExecutedNonce())
	// this line is used by starport scaffolding # 1

	return cmd
}
