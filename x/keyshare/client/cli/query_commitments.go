package cli

import (
	"context"

	"github.com/Fairblock/fairyring/x/keyshare/types"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cobra"
)

func CmdShowCommitments() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "show-commitments",
		Short: "Show the active & queued commitments ",
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientQueryContext(cmd)
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			commitReq := &types.QueryCommitmentsRequest{}

			res, err := queryClient.Commitments(context.Background(), commitReq)
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
