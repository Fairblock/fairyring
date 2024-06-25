package cli

import (
	"encoding/json"
	"strconv"

	"github.com/Fairblock/fairyring/x/keyshare/types"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	
	"github.com/spf13/cobra"
)

var _ = strconv.Itoa(0)

func CmdResharing() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "resharing [old_group] [new_group] [timeout]",
		Short: "Broadcast message Resharing",
		Args:  cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			
			var old_group *types.Group = new(types.Group)
			err = json.Unmarshal([]byte(args[0]), old_group)
			if err != nil {
				return err
			}

			var new_group *types.Group = new(types.Group)
			err = json.Unmarshal([]byte(args[1]), new_group)
			if err != nil {
				return err
			}
			timeout := args[2]
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgResharing(
				clientCtx.GetFromAddress().String(),
				old_group,
				new_group,
				timeout,
			)
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
