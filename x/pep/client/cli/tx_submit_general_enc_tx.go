package cli

import (
	"errors"
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
		Use:   "submit-general-encrypted-tx [data] [req-id] [data-type]",
		Short: "Submit an encrypted transaction along with its req-id. The data-type can be either DATA or TRANSACTION",
		Args:  cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			argData := args[0]
			argReqId := args[1]
			argDataType := args[2]

			var enumType types.EncrytedDataType
			if argDataType == "DATA" {
				enumType = types.EncrytedDataType_DATA
			} else if argDataType == "TRANSACTION" {
				enumType = types.EncrytedDataType_TRANSACTION
			} else {
				return errors.New("data type must be DATA or TRANSACTION")
			}

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgSubmitGeneralEncryptedData(
				clientCtx.GetFromAddress().String(),
				argData,
				argReqId,
				enumType,
			)
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
