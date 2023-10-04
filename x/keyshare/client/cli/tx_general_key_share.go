package cli

import (
	"fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
)

func CmdCreateGeneralKeyShare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "create-general-key-share [id-type] [id-value] [key-share] [key-share-index] [received-timestamp] [received-block-height]",
		Short: "Create a new GeneralKeyShare",
		Args:  cobra.ExactArgs(6),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			// Get indexes
			indexIdType := args[0]
			indexIdValue := args[1]

			// Get value arguments
			argKeyShare := args[2]
			argKeyShareIndex, err := cast.ToUint64E(args[3])
			if err != nil {
				return err
			}
			argReceivedTimestamp, err := cast.ToUint64E(args[4])
			if err != nil {
				return err
			}
			argReceivedBlockHeight, err := cast.ToUint64E(args[5])
			if err != nil {
				return err
			}

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgCreateGeneralKeyShare(
				clientCtx.GetFromAddress().String(),
				indexIdType,
				indexIdValue,
				argKeyShare,
				argKeyShareIndex,
				argReceivedTimestamp,
				argReceivedBlockHeight,
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
