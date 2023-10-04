package cli

import (
	"context"

	"fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cobra"
)

func CmdListGeneralKeyShare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list-general-key-share",
		Short: "list all GeneralKeyShare",
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx := client.GetClientContextFromCmd(cmd)

			pageReq, err := client.ReadPageRequest(cmd.Flags())
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			params := &types.QueryAllGeneralKeyShareRequest{
				Pagination: pageReq,
			}

			res, err := queryClient.GeneralKeyShareAll(context.Background(), params)
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

func CmdShowGeneralKeyShare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "show-general-key-share [validator] [id-type] [id-value]",
		Short: "shows a GeneralKeyShare",
		Args:  cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			clientCtx := client.GetClientContextFromCmd(cmd)

			queryClient := types.NewQueryClient(clientCtx)

			argValidator := args[0]
			argIdType := args[1]
			argIdValue := args[2]

			params := &types.QueryGetGeneralKeyShareRequest{
				Validator: argValidator,
				IdType:    argIdType,
				IdValue:   argIdValue,
			}

			res, err := queryClient.GeneralKeyShare(context.Background(), params)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}
