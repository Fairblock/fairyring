package cli

import (
	"strconv"

	"fairyring/x/pricefeed/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cobra"
)

var _ = strconv.Itoa(0)

func CmdCurrentNonce() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "current-nonce [denom] [price]",
		Short: "Query currentNonce",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			reqDenom := args[0]
			reqPrice := args[1]

			clientCtx, err := client.GetClientQueryContext(cmd)
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			params := &types.QueryCurrentNonceRequest{

				Denom: reqDenom,
				Price: reqPrice,
			}

			res, err := queryClient.CurrentNonce(cmd.Context(), params)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}
