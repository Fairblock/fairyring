package cli

import (
	"encoding/json"
	"strings"

	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/spf13/cast"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/spf13/cobra"
)

func CmdOverrideLatestPubkey() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "override-latest-pubkey [public-key] [commitments] [number-of-validators] [encrypted-keyshares]",
		Short: "Override a latest public key",
		Args:  cobra.ExactArgs(4),
		RunE: func(cmd *cobra.Command, args []string) (err error) {

			// Get value arguments
			argPublicKey := args[0]

			commitmentStr := args[1]
			commitments := strings.Split(commitmentStr, ",")

			numberOfValidators, err := cast.ToUint64E(args[2])
			if err != nil {
				return err
			}

			encryptedShares := make([]*types.EncryptedKeyshare, numberOfValidators)

			if err := json.Unmarshal([]byte(args[3]), &encryptedShares); err != nil {
				return err
			}

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgOverrideLatestPubKey(
				clientCtx.GetFromAddress().String(),
				argPublicKey,
				commitments,
				numberOfValidators,
				encryptedShares,
			)
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
