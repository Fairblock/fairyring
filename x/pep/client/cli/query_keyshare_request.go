package cli

import (
	"context"

	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cobra"
)

func CmdListKeyshareReq() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list-keyshare-req",
		Short: "list all pending keyshare requests",
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

			params := &types.QueryAllKeyshareRequest{
				Pagination: pageReq,
			}

			res, err := queryClient.KeyshareReqAll(context.Background(), params)
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

func CmdShowKeyshareReq() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "show-keyshare-req [req-id]",
		Short: "show a particular pending keyshare request by request-id",
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientQueryContext(cmd)
			if err != nil {
				return err
			}

			argReqId := args[0]

			queryClient := types.NewQueryClient(clientCtx)

			params := &types.QueryKeyshareRequest{
				ReqId: argReqId,
			}

			res, err := queryClient.KeyshareReq(context.Background(), params)
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
