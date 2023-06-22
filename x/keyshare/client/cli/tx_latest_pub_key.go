package cli

import (
	"fairyring/x/keyshare/types"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cobra"
)

func CmdCreateLatestPubKey() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "create-latest-pub-key [public-key]",
		Short: "Register a new pubkey to the chain",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) (err error) {

			// Get value arguments
			argPublicKey := args[0]

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgCreateLatestPubKey(
				clientCtx.GetFromAddress().String(),
				argPublicKey,
			)
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
