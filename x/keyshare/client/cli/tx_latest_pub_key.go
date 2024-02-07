package cli

import (
	"fairyring/x/keyshare/types"
	"github.com/spf13/cast"
	"strings"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cobra"
)

func CmdCreateLatestPubKey() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "create-latest-pub-key [public-key] [commitments] [number-of-validators]",
		Short: "Create a latest public key",
		Args:  cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) (err error) {

			// Get value arguments
			argPublicKey := args[0]

			commitmentStr := args[1]
			commitments := strings.Split(commitmentStr, ",")

			numberOfValidators, err := cast.ToUint64E(args[2])
			if err != nil {
				return err
			}

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgCreateLatestPubKey(
				clientCtx.GetFromAddress().String(),
				argPublicKey,
				commitments,
				numberOfValidators,
			)
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
