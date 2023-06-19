package cli

import (
	"strconv"

	"fairyring/x/keyshare/types"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
)

var _ = strconv.Itoa(0)

func CmdSendKeyshare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "send-keyshare [message] [commitment] [keyshare-index] [block-height]",
		Short: "Broadcast message sendKeyshare",
		Args:  cobra.ExactArgs(4),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			argMessage := args[0]
			argCommitment := args[1]

			keyshareIndex, err := cast.ToUint64E(args[2])
			if err != nil {
				return err
			}

			argBlockHeight, err := cast.ToUint64E(args[3])
			if err != nil {
				return err
			}

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgSendKeyshare(
				clientCtx.GetFromAddress().String(),
				argMessage,
				argCommitment,
				keyshareIndex,
				argBlockHeight,
			)
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
