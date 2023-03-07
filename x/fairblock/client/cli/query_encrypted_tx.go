package cli

import (
	"context"

	"fairyring/x/fairblock/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
)

func CmdListEncryptedTx() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list-encrypted-tx",
		Short: "list all EncryptedTx",
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx := client.GetClientContextFromCmd(cmd)

			pageReq, err := client.ReadPageRequest(cmd.Flags())
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			params := &types.QueryAllEncryptedTxRequest{
				Pagination: pageReq,
			}

			res, err := queryClient.EncryptedTxAll(context.Background(), params)
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

func CmdListEncryptedTxFromBlock() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list-encrypted-tx-from-block",
		Short: "list all EncryptedTx from block",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx := client.GetClientContextFromCmd(cmd)

			queryClient := types.NewQueryClient(clientCtx)

			argTargetHeight, err := cast.ToUint64E(args[0])
			if err != nil {
				return err
			}

			params := &types.QueryAllEncryptedTxFromHeightRequest{
				TargetHeight: argTargetHeight,
			}

			res, err := queryClient.EncryptedTxAllFromHeight(context.Background(), params)
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

func CmdShowEncryptedTx() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "show-encrypted-tx [target-height] [index]",
		Short: "shows a EncryptedTx",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			clientCtx := client.GetClientContextFromCmd(cmd)

			queryClient := types.NewQueryClient(clientCtx)

			argTargetHeight, err := cast.ToUint64E(args[0])
			if err != nil {
				return err
			}
			argIndex, err := cast.ToUint64E(args[1])
			if err != nil {
				return err
			}

			params := &types.QueryGetEncryptedTxRequest{
				TargetHeight: argTargetHeight,
				Index:        argIndex,
			}

			res, err := queryClient.EncryptedTx(context.Background(), params)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}
