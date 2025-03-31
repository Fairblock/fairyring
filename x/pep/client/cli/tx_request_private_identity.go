package cli

import (
	"strconv"

	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cobra"
)

var _ = strconv.Itoa(0)

func CmdRequestPrivateIdentity() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "request-private-identity [req-id] [via-contract] [register-contract]",
		Short: "Broadcast message request-private-identity",
		Args:  cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			viaContract, err := strconv.ParseBool(args[1])
			if err != nil {
				return err
			}

			registerContract, err := strconv.ParseBool(args[2])
			if err != nil {
				return err
			}

			msg := types.NewMsgRequestPrivateIdentity(
				clientCtx.GetFromAddress().String(),
				args[0],
				viaContract,
				registerContract,
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
