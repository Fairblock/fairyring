package cli

import (
	"encoding/json"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cobra"
)

func CmdCreateGeneralKeyShare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "create-general-key-share [array of general key-shares]",
		Short: "Create a new GeneralKeyShare",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			arrayStr := args[0]
			var generalSharesArr []*types.GeneralKeyShare
			if json.Unmarshal([]byte(arrayStr), &generalSharesArr) != nil {
				return err
			}

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgCreateGeneralKeyShare(
				clientCtx.GetFromAddress().String(),
				generalSharesArr,
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
