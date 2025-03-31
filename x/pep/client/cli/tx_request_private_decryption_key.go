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

func CmdRequestPrivateDecryptionKey() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "request-private-decryption-key [req-id] [secp-pubkey] [requester-address]",
		Short: "Broadcast message request-private-decryption-key",
		Args:  cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			argReqId := args[0]
			argPubkey := args[1]
			argRequester := args[2]

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgRequestPrivateDecryptionKey(
				clientCtx.GetFromAddress().String(),
				argReqId,
				argPubkey,
				argRequester,
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
