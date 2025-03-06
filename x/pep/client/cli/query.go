package cli

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/Fairblock/fairyring/x/pep/types"
	cometabci "github.com/cometbft/cometbft/abci/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/rpc"
	"github.com/spf13/cobra"
	"strconv"
)

// GetQueryCmd returns the cli query commands for this module
func GetQueryCmd(queryRoute string) *cobra.Command {
	// Group pep queries under a subcommand
	cmd := &cobra.Command{
		Use:                        types.ModuleName,
		Short:                      fmt.Sprintf("Querying commands for the %s module", types.ModuleName),
		DisableFlagParsing:         true,
		SuggestionsMinimumDistance: 2,
		RunE:                       client.ValidateCmd,
	}

	cmd.AddCommand(QueryBlockResultsCmd())

	// this line is used by starport scaffolding # 1

	return cmd
}

func QueryBlockResultsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "list-decrypted-txs [height]",
		Short: "List all decrypted txs in a certain height",
		Args:  cobra.RangeArgs(0, 1),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientQueryContext(cmd)
			if err != nil {
				return err
			}

			node, err := clientCtx.GetNode()
			if err != nil {
				return err
			}

			// optional height
			var height uint64
			if len(args) > 0 {
				height, err = strconv.ParseUint(args[0], 10, 64)
				if err != nil {
					return err
				}
			} else {
				cmd.Println("Falling back to latest block height:")
				heightInt64, err := rpc.GetChainHeight(clientCtx)
				if err != nil {
					return fmt.Errorf("failed to get chain height: %w", err)
				} else {
					height = uint64(heightInt64)
				}
			}

			queryClient := types.NewQueryClient(clientCtx)

			res, err := queryClient.EncryptedTxAllFromHeight(context.Background(), &types.QueryEncryptedTxAllFromHeightRequest{
				TargetHeight: height,
			})
			if err != nil {
				return err
			}

			if len(res.EncryptedTxArray.EncryptedTxs) == 0 {
				j, _ := json.Marshal(map[string]interface{}{
					"results": []string{},
				})
				return clientCtx.PrintRaw(j)
			}

			out := make([][]cometabci.EventAttribute, 0)
			for _, eachTx := range res.EncryptedTxArray.EncryptedTxs {
				h := int64(eachTx.ProcessedAtChainHeight)
				blockRes, err := node.BlockResults(context.Background(), &h)
				if err != nil {
					return err
				}
				for _, e := range blockRes.FinalizeBlockEvents {
					if e.Type == "executed-encrypted-tx" {
						out = append(out, e.Attributes)
						break
					}
				}
			}

			allBlockResStr, err := json.Marshal(map[string]interface{}{
				"results": out,
			})
			if err != nil {
				return err
			}

			return clientCtx.PrintRaw(allBlockResStr)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}
