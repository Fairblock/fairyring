package cli

import (
	"fairyring/x/fairyring/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
)

func CmdCreatePubKeyID() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "create-pub-key-id [height] [public-key]",
		Short: "Create a new PubKeyID",
		Args:  cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			// Get indexes
			indexHeight, err := cast.ToUint64E(args[0])
			if err != nil {
				return err
			}

			// Get value arguments
			argPublicKey := args[1]

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgCreatePubKeyID(
				clientCtx.GetFromAddress().String(),
				indexHeight,
				argPublicKey,
			)
			if err := msg.ValidateBasic(); err != nil {
				return err
			}
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
