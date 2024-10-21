package cli

import (
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
)

func CmdSubmitGeneralKeyshare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "submit-general-keyshare [id-type] [id-value] [keyshare] [keyshare-index]",
		Short: "submit a new GeneralKeyshare",
		Args:  cobra.ExactArgs(4),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			// Get indexes
			indexIdType := args[0]
			indexIdValue := args[1]

			// Get value arguments
			argKeyshare := args[2]
			argKeyshareIndex, err := cast.ToUint64E(args[3])
			if err != nil {
				return err
			}

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgSubmitGeneralKeyshare(
				clientCtx.GetFromAddress().String(),
				indexIdType,
				indexIdValue,
				argKeyshare,
				argKeyshareIndex,
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

func CmdSubmitEncryptedKeyshare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "submit-encrypted-keyshare [identity] [requester] [encrypted-keyshare] [keyshare-index]",
		Short: "Submit a new EncryptedKeyshare",
		Args:  cobra.ExactArgs(4),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			// Get indexes
			identity := args[0]
			requester := args[1]
			encKeyshare := args[2]
			argKeyshareIndex, err := cast.ToUint64E(args[3])
			if err != nil {
				return err
			}

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgSubmitEncryptedKeyshare(
				clientCtx.GetFromAddress().String(),
				identity,
				requester,
				encKeyshare,
				argKeyshareIndex,
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
