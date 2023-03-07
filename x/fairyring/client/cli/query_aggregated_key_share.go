package cli

import (
	"context"

	"fairyring/x/fairyring/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
)

func CmdListAggregatedKeyShare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list-aggregated-key-share",
		Short: "list all AggregatedKeyShare",
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx := client.GetClientContextFromCmd(cmd)

			pageReq, err := client.ReadPageRequest(cmd.Flags())
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			params := &types.QueryAllAggregatedKeyShareRequest{
				Pagination: pageReq,
			}

			res, err := queryClient.AggregatedKeyShareAll(context.Background(), params)
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

func CmdShowAggregatedKeyShare() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "show-aggregated-key-share [height]",
		Short: "shows a AggregatedKeyShare",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			clientCtx := client.GetClientContextFromCmd(cmd)

			queryClient := types.NewQueryClient(clientCtx)

			argHeight, err := cast.ToUint64E(args[0])
			if err != nil {
				return err
			}

			params := &types.QueryGetAggregatedKeyShareRequest{
				Height: argHeight,
			}

			res, err := queryClient.AggregatedKeyShare(context.Background(), params)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}
