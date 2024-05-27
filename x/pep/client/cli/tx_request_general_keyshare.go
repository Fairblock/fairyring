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

func CmdRequestGeneralKeyshare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "request-general-keyshare",
		Short: "Broadcast message request-general-keyshare",
		Args:  cobra.ExactArgs(0),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			// Retrieve the flag value
			cAddr, err := cmd.Flags().GetString("contract_address")
			if err != nil {
				return err
			}

			msg := types.NewMsgRequestGeneralKeyshare(
				clientCtx.GetFromAddress().String(),
				cAddr,
			)
			if err := msg.ValidateBasic(); err != nil {
				return err
			}
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	cmd.Flags().String("contract_address", "", "should be ONLY filled when the tx is made from a contract, do not use otherwise")
	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
