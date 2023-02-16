package cli

import (
	"fairyring/x/fairblock/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
)

func CmdCreateAggregatedKeyShare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "create-aggregated-key-share [height] [data] [publicKey]",
		Short: "Create a new AggregatedKeyShare",
		Args:  cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			// Get indexes
			indexHeight, err := cast.ToUint64E(args[0])
			if err != nil {
				return err
			}

			// Get value arguments
			argData := args[1]

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgCreateAggregatedKeyShare(
				clientCtx.GetFromAddress().String(),
				indexHeight,
				argData,
				args[2],
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
