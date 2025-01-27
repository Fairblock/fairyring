package cli

import (
	"github.com/Fairblock/fairyring/x/auction/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
)

func CmdCreateAuction() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "create-auction [resolve-at-block-number] [is-timed-auction]",
		Short: "Broadcast message create-auction",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			resolveAt, err := cast.ToUint64E(args[0])
			if err != nil {
				return err
			}

			isTimed := cast.ToBool(args[1])

			msg := types.MsgCreateAuction{
				Creator:   clientCtx.GetFromAddress().String(),
				ResolveAt: resolveAt,
				IsTimed:   isTimed,
			}
			if err := msg.ValidateBasic(); err != nil {
				return err
			}
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), &msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
