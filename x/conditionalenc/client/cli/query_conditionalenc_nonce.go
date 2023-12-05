package cli

import (
	"context"

	"fairyring/x/conditionalenc/types"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cobra"
)

func CmdListConditionalencNonce() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list-conditionalenc-nonce",
		Short: "list all ConditionalencNonce of all addresses",
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientQueryContext(cmd)
			if err != nil {
				return err
			}

			pageReq, err := client.ReadPageRequest(cmd.Flags())
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			params := &types.QueryAllConditionalencNonceRequest{
				Pagination: pageReq,
			}

			res, err := queryClient.ConditionalencNonceAll(context.Background(), params)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddPaginationFlagsToCmd(cmd, cmd.Use)
	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}

func CmdShowConditionalencNonce() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "show-pep-nonce [address]",
		Short: "shows a ConditionalencNonce for a particular address",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			clientCtx, err := client.GetClientQueryContext(cmd)
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			argAddress := args[0]

			params := &types.QueryGetConditionalencNonceRequest{
				Address: argAddress,
			}

			res, err := queryClient.ConditionalencNonce(context.Background(), params)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}
