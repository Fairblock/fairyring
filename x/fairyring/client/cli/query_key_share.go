package cli

import (
	"context"

	"fairyring/x/fairyring/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
)

func CmdListKeyShare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list-key-share",
		Short: "list all keyShare",
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx := client.GetClientContextFromCmd(cmd)

			pageReq, err := client.ReadPageRequest(cmd.Flags())
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			params := &types.QueryAllKeyShareRequest{
				Pagination: pageReq,
			}

			res, err := queryClient.KeyShareAll(context.Background(), params)
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

func CmdShowKeyShare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "show-key-share [validator] [block-height]",
		Short: "shows a keyShare",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			clientCtx := client.GetClientContextFromCmd(cmd)

			queryClient := types.NewQueryClient(clientCtx)

			argValidator := args[0]
			argBlockHeight, err := cast.ToUint64E(args[1])
			if err != nil {
				return err
			}

			params := &types.QueryGetKeyShareRequest{
				Validator:   argValidator,
				BlockHeight: argBlockHeight,
			}

			res, err := queryClient.KeyShare(context.Background(), params)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}
