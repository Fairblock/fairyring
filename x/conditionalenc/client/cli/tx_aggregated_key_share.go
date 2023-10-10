package cli

import (
	"fairyring/x/conditionalenc/types"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"

	"github.com/spf13/cobra"
)

func CmdCreateAggregatedConditionalKeyShare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "create-aggregated-key-share [condition] [data]",
		Short: "Submit a new aggregated keyshare into a destination chain",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			// Get indexes
			indexCondition := string(args[0])

			// Get value arguments
			argData := args[1]

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgCreateAggregatedConditionalKeyShare(
				clientCtx.GetFromAddress().String(),
				indexCondition,
				argData,
			)
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
