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
		Short: "submit a new GeneralKeyShare",
		Args:  cobra.ExactArgs(4),
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

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgSubmitGeneralKeyshare(
				clientCtx.GetFromAddress().String(),
				indexIdType,
				indexIdValue,
				argKeyShare,
				argKeyShareIndex,
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

func CmdSubmitEncryptedKeyShare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "submit-encrypted-keyshare [identity] [requester] [encrypted-keyshare] [keyshare-index]",
		Short: "Submit a new EncryptedKeyShare",
		Args:  cobra.ExactArgs(4),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			// Get indexes
			identity := args[0]
			requester := args[1]
			encKeyshare := args[2]
			argKeyShareIndex, err := cast.ToUint64E(args[3])
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
				argKeyShareIndex,
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
