package cli

import (
	"context"

	"fairyring/x/fairblock/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cobra"
)

func CmdListFairblockExecutedNonce() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list-fairblock-executed-nonce",
		Short: "list all FairblockExecutedNonce",
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx := client.GetClientContextFromCmd(cmd)

			pageReq, err := client.ReadPageRequest(cmd.Flags())
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			params := &types.QueryAllFairblockExecutedNonceRequest{
				Pagination: pageReq,
			}

			res, err := queryClient.FairblockExecutedNonceAll(context.Background(), params)
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

func CmdShowFairblockExecutedNonce() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "show-fairblock-executed-nonce [address]",
		Short: "shows a FairblockExecutedNonce",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			clientCtx := client.GetClientContextFromCmd(cmd)

			queryClient := types.NewQueryClient(clientCtx)

			argAddress := args[0]

			params := &types.QueryGetFairblockExecutedNonceRequest{
				Address: argAddress,
			}

			res, err := queryClient.FairblockExecutedNonce(context.Background(), params)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}
