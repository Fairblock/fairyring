package cli

import (
	"strconv"

	"fairyring/x/keyshare/types"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	
	"github.com/spf13/cobra"
)

var _ = strconv.Itoa(0)

func CmdRequestAggrKeyshare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "request-aggr-key-share [req-id]",
		Short: "request aggregated keyshare",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			argReqId := args[0]

			
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgRequestAggrKeyshare(
				
				argReqId,
				clientCtx.GetFromAddress().String(),
			
			)
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
