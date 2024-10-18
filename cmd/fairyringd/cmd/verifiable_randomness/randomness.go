package verifiable_randomness

import (
	"context"
	"errors"

	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/spf13/cobra"
)

func VerifiableRandomness() *cobra.Command {
	return &cobra.Command{
		Use:   "randomness",
		Short: "Query the latest verifiable randomness from fairyring",
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientQueryContext(cmd)
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			res, err := queryClient.VerifiableRandomness(
				context.Background(),
				&types.QueryVerifiableRandomnessRequest{},
			)
			if err != nil {
				return err
			}

			if len(res.Randomness) == 0 {
				return errors.New("randomness not found")
			}

			return clientCtx.PrintProto(res)
		},
	}
}
