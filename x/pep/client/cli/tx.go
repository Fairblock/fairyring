package cli

import (
	"fmt"
	"time"

	"github.com/spf13/cobra"

	"github.com/cosmos/cosmos-sdk/client"
	// "github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/Fairblock/fairyring/x/pep/types"
)

var DefaultRelativePacketTimeoutTimestamp = uint64((time.Duration(10) * time.Minute).Nanoseconds())

const listSeparator = ","

// GetTxCmd returns the transaction commands for this module.
func GetTxCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:                        types.ModuleName,
		Short:                      fmt.Sprintf("%s transactions subcommands", types.ModuleName),
		DisableFlagParsing:         true,
		SuggestionsMinimumDistance: 2,
		RunE:                       client.ValidateCmd,
	}

	cmd.AddCommand(CmdSubmitEncryptedTx())
	cmd.AddCommand(CmdCreateAggregatedKeyShare())
	cmd.AddCommand(CmdRequestGeneralKeyshare())
	cmd.AddCommand(CmdGetGeneralKeyshare())
	cmd.AddCommand(CmdSubmitGeneralEncryptedTx())
	// this line is used by starport scaffolding # 1

	return cmd
}
