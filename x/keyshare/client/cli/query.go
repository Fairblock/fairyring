package cli

import (
	"fairyring/x/keyshare/types"
	"fmt"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/spf13/cobra"
)

// GetQueryCmd returns the cli query commands for this module
func GetQueryCmd(queryRoute string) *cobra.Command {
	// Group keyshare queries under a subcommand
	cmd := &cobra.Command{
		Use:                        types.ModuleName,
		Short:                      fmt.Sprintf("Querying commands for the %s module", types.ModuleName),
		DisableFlagParsing:         true,
		SuggestionsMinimumDistance: 2,
		RunE:                       client.ValidateCmd,
	}

	cmd.AddCommand(CmdQueryParams())
	cmd.AddCommand(CmdListValidatorSet())
	cmd.AddCommand(CmdShowValidatorSet())
	cmd.AddCommand(CmdListKeyShare())
	cmd.AddCommand(CmdShowKeyShare())
	cmd.AddCommand(CmdListAggregatedKeyShare())
	cmd.AddCommand(CmdShowAggregatedKeyShare())
	cmd.AddCommand(CmdShowPubKey())
	// this line is used by starport scaffolding # 1

	return cmd
}
