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

func CmdSubmitGeneralEncryptedTx() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "submit-general-encrypted-tx [data] [req-id]",
		Short: "Submit an encrypted transaction along with its req-id",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			argData := args[0]
			argReqId := args[1]

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgSubmitGeneralEncryptedTx(
				clientCtx.GetFromAddress().String(),
				argData,
				argReqId,
			)
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
