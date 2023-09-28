package cli

import (
	"context"

	"fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cobra"
)

func CmdListAuthorizedAddress() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list-authorized-address",
		Short: "list all authorizedAddress",
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx := client.GetClientContextFromCmd(cmd)

			pageReq, err := client.ReadPageRequest(cmd.Flags())
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			params := &types.QueryAllAuthorizedAddressRequest{
				Pagination: pageReq,
			}

			res, err := queryClient.AuthorizedAddressAll(context.Background(), params)
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

func CmdShowAuthorizedAddress() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "show-authorized-address [target]",
		Short: "shows a authorizedAddress",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			clientCtx := client.GetClientContextFromCmd(cmd)

			queryClient := types.NewQueryClient(clientCtx)

			argTarget := args[0]

			params := &types.QueryGetAuthorizedAddressRequest{
				Target: argTarget,
			}

			res, err := queryClient.AuthorizedAddress(context.Background(), params)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}
