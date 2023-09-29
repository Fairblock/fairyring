package cli

import (
	"context"

	"fairyring/x/conditionalenc/types"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cast"
	"github.com/spf13/cobra"
)

func CmdListEncryptedTx() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list-encrypted-tx",
		Short: "list all pending encrypted transactions from all future blocks",
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
		Short: "list all encrypted transactions for a particular target height",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientQueryContext(cmd)
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			argtargetCondition := string(args[0])
			

			params := &types.QueryAllEncryptedTxFromconditionRequest{
				TargetCondition: argtargetCondition,
			}

			res, err := queryClient.EncryptedTxAllFromCondition(context.Background(), params)
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
		Short: "shows a particular encrypted transaction at a given target height and index",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			clientCtx, err := client.GetClientQueryContext(cmd)
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			argtargetCondition := string(args[0])
			
			argIndex, err := cast.ToUint64E(args[1])
			if err != nil {
				return err
			}

			params := &types.QueryGetEncryptedTxRequest{
				TargetCondition: argtargetCondition,
				Index:           argIndex,
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
